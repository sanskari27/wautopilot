import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../../errors';
import COMMON_ERRORS from '../../../errors/common-errors';
import {
	ContactMessage,
	FlowMessage,
	InteractiveMediaMessage,
	LocationMessage,
	MediaMessage,
	TemplateMessage,
	TextMessage,
} from '../../../models/message';
import TemplateFactory from '../../../models/templates/templateFactory';
import ConversationService from '../../../services/conversation';
import MediaService from '../../../services/media';
import MessageSender from '../../../services/messageSender';
import PhoneBookService, { IPhonebookRecord } from '../../../services/phonebook';
import WhatsappFlowService from '../../../services/wa_flow';
import { Respond } from '../../../utils/ExpressUtils';
import {
	extractFormattedMessage,
	generateButtons,
	generateSections,
	parseToBodyVariables,
} from '../../../utils/MessageHelper';
import { SendMessageValidationResult } from './message.validator';

async function sendMessage(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount,
		serviceUser,
		device: { device },
	} = req.locals;
	const data = req.locals.data as SendMessageValidationResult;

	if (serviceUser.walletBalance < serviceUser.markupPrice) {
		return next(new CustomError(COMMON_ERRORS.INSUFFICIENT_BALANCE));
	}

	const whatsappFlow = new WhatsappFlowService(serviceAccount, device);
	const conversationService = new ConversationService(serviceAccount, device);
	const recipient = await conversationService.createConversation(data.recipient);
	const { type } = data.message;

	// const type =
	// 	_type === 'button' || _type === 'list' || _type === 'whatsapp_flow' ? 'interactive' : _type;

	let messageInst:
		| MediaMessage
		| LocationMessage
		| ContactMessage
		| InteractiveMediaMessage
		| TextMessage
		| FlowMessage
		| TemplateMessage
		| null = null;

	let formattedMessage: any = null;

	if (type === 'template') {
		const template = await TemplateFactory.findById(device, data.message.template_id);
		if (!template) {
			return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
		}

		const header = template.getHeader();
		const tButtons = template.getURLButtonsWithVariable();
		const tCarousel = template.getCarouselCards();
		const phonebookService = new PhoneBookService(serviceAccount);

		const fields = await phonebookService.findRecordByPhone(data.recipient);

		const msg = new TemplateMessage(data.recipient, template);

		if (header && data.message.template_header) {
			if (
				header.format !== 'TEXT' &&
				('link' in data.message.template_header || 'media_id' in data.message.template_header)
			) {
				msg.setMediaHeader(data.message.template_header as any);
			} else if (header.format === 'TEXT' && data.message.template_header.text) {
				if (header?.example.length > 0) {
					const headerVariables = parseToBodyVariables({
						variables: data.message.template_header.text,
						fields: fields || ({} as IPhonebookRecord),
					});
					msg.setTextHeader(headerVariables);
				}
			}
		}

		const bodyVariables = parseToBodyVariables({
			variables: data.message.template_body,
			fields: fields ?? ({} as IPhonebookRecord),
		});
		msg.setBody(bodyVariables);
		if (tButtons.length > 0) {
			msg.setButtons(data.message.template_buttons);
		}

		if (tCarousel.length > 0 && data.message.template_carousel) {
			const cards = data.message.template_carousel.cards.map((card, index) => {
				const bodyVariables = parseToBodyVariables({
					variables: card.body,
					fields: fields || ({} as IPhonebookRecord),
				});
				return {
					header: card.header,
					body: bodyVariables,
					buttons: card.buttons,
				};
			});
			msg.setCarousel(cards);
		}

		messageInst = msg;
		formattedMessage = extractFormattedMessage(messageInst.toObject().template, {
			template: template.buildToSave(),
			type: 'template',
		});
	} else {
		if (type === 'audio' || type === 'video' || type === 'document' || type === 'image') {
			const msg = new MediaMessage(data.recipient, type);

			if (data.message.media_link) {
				const id = await new MediaService(serviceAccount, device).linkToMediaId(
					data.message.media_link
				);
				if (!id) {
					return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
				}
				msg.setMediaId(id);
			} else {
				msg.setMediaId(data.message.media_id);
			}

			messageInst = msg;
		} else if (type === 'location') {
			const msg = new LocationMessage(data.recipient, data.message.location)
				.setName(data.message.location.name)
				.setAddress(data.message.location.address);

			messageInst = msg;
		} else if (type === 'contacts') {
			const msg = new ContactMessage(data.recipient, data.message.contacts[0]);
			messageInst = msg;
		} else if (type === 'button') {
			const msg = new InteractiveMediaMessage(data.recipient, 'none')
				.setBody(data.message.text)
				.setButtons(generateButtons(data.message.buttons));

			messageInst = msg;
		} else if (type === 'list') {
			const msg = new InteractiveMediaMessage(data.recipient, 'none')
				.setTextHeader(data.message.header)
				.setBody(data.message.body)
				.setSections(generateSections(data.message.sections))
				.setInteractiveType('list');

			messageInst = msg;
		} else if (type === 'whatsapp_flow') {
			const details = await whatsappFlow.getWhatsappFlowContents(data.message.flow_id);
			const msg = new FlowMessage(data.recipient)
				.setTextHeader(data.message.header)
				.setBody(data.message.body)
				.setFooter(data.message.footer)
				.setFlowDetails(data.message.flow_id, data.message.button_text, details[0].id);

			messageInst = msg;
		} else if (type === 'text') {
			const msg = new TextMessage(data.recipient, data.message.text);
			messageInst = msg;
		} else {
			return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
		}

		formattedMessage = extractFormattedMessage(messageInst.toObject());
	}

	if (!messageInst) {
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}

	if (data.context) {
		messageInst.setContextMessage(data.context.message_id);
	}

	const messageSender = new MessageSender(device);
	const result = await messageSender.sendMessage(messageInst);

	await conversationService.addMessageToConversation(recipient._id, {
		recipient: data.recipient,
		...result,
		...formattedMessage,
		...(extractFormattedMessage(messageInst.toObject()) as any),
		...(data.context
			? {
					context: {
						id: data.context.message_id,
					},
			  }
			: {}),
	});

	serviceUser.deductCredit(1);

	return Respond({
		res,
		status: 200,
	});
}

const Controller = {
	sendMessage,
};

export default Controller;
