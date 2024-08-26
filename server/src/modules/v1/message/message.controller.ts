import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import FormData from 'form-data';
import fs from 'fs';
import IPhoneBook from '../../../../mongo/types/phonebook';
import { Path } from '../../../config/const';
import MetaAPI from '../../../config/MetaAPI';
import { CustomError } from '../../../errors';
import COMMON_ERRORS from '../../../errors/common-errors';
import ConversationService from '../../../services/conversation';
import PhoneBookService from '../../../services/phonebook';
import TemplateService from '../../../services/templates';
import WhatsappFlowService from '../../../services/wa_flow';
import { generateText, Respond } from '../../../utils/ExpressUtils';
import FileUtils from '../../../utils/FileUtils';
import {
	extractInteractiveBody,
	extractInteractiveButtons,
	extractInteractiveFooter,
	extractInteractiveHeader,
	extractTemplateBody,
	extractTemplateButtons,
	extractTemplateFooter,
	extractTemplateHeader,
	generateBodyText,
	generateButtons,
	generateListBody,
	generateSections,
	generateTemplateMessageObject,
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
	const { type: _type, ...message } = data.message;

	const type =
		_type === 'button' || _type === 'list' || _type === 'whatsapp_flow' ? 'interactive' : _type;

	const msgObj = {
		messaging_product: 'whatsapp',
		to: data.recipient,
		type,
		context: data.context,
	} as any;

	if (_type === 'button' || _type === 'list' || _type === 'whatsapp_flow') {
		if (_type === 'button') {
			msgObj[type] = {
				type: 'button',
				...generateBodyText(data.message.text),
				action: {
					buttons: generateButtons(data.message.buttons),
				},
			};
		} else if (_type === 'list') {
			msgObj[type] = {
				type: 'list',
				...generateListBody(data.message as any),
				action: {
					button: data.message.button_text,
					sections: generateSections(data.message.sections),
				},
			};
		} else if (_type === 'whatsapp_flow') {
			let details;
			try {
				details = await whatsappFlow.getWhatsappFlowContents(data.message.flow_id);
			} catch (e) {
				return next(
					new CustomError({
						STATUS: 400,
						TITLE: 'BAD_REQUEST',
						MESSAGE: `Invalid flow id`,
					})
				);
			}

			msgObj[type] = {
				type: 'flow',
				...generateListBody(data.message as any),
				action: {
					name: 'flow',
					parameters: {
						flow_message_version: '3',
						flow_action: 'navigate',
						flow_token: `wautopilot_${data.message.flow_id}_${generateText(2)}`,
						flow_id: data.message.flow_id,
						flow_cta: data.message.button_text,
						flow_action_payload: {
							screen: details[0].id,
						},
					},
				},
			};
		}

		const header = extractInteractiveHeader(msgObj.interactive);
		const body = extractInteractiveBody(msgObj.interactive);
		const footer = extractInteractiveFooter(msgObj.interactive);
		const buttons = extractInteractiveButtons(msgObj.interactive);

		try {
			const { data: res } = await MetaAPI(device.accessToken).post(
				`/${device.phoneNumberId}/messages`,
				msgObj
			);
			await conversationService.addMessageToConversation(recipient._id, {
				message_id: res.messages[0].id,
				recipient: data.recipient,
				...(header ? { ...header } : {}),
				...(body ? { body: { body_type: 'TEXT', text: body } } : {}),
				...(footer ? { footer_content: footer } : {}),
				...(buttons ? { buttons } : {}),
				...(data.context
					? {
							context: {
								id: data.context.message_id,
							},
					  }
					: {}),
			});
			serviceUser.deductCredit(1);
		} catch (err) {
			let failed_reason;
			if (axios.isAxiosError(err)) {
				failed_reason = JSON.stringify(err.response?.data ?? '') as string;
			} else {
				failed_reason = (err as any).message as string;
			}
			return next(
				new CustomError({
					STATUS: 400,
					TITLE: 'BAD_REQUEST',
					MESSAGE: `Failed to send message. Reason: ${failed_reason}`,
				})
			);
		}
	} else if (_type === 'template') {
		const templateService = new TemplateService(serviceAccount, device);
		const template = await templateService.fetchTemplateByName(data.message.template_name);

		if (!template) {
			return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
		}
		const phonebook = new PhoneBookService(serviceAccount);
		const contact = await phonebook.findRecordByPhone(data.recipient);

		const {
			template: { components },
		} = generateTemplateMessageObject(data.recipient, {
			template_name: data.message.template_name,
			header: data.message.template_header,
			body: data.message.template_body,
			contact: contact as unknown as IPhoneBook,
		});

		const header = extractTemplateHeader(template.components, components);
		const body = extractTemplateBody(template.components, components);
		const footer = extractTemplateFooter(template.components);
		const buttons = extractTemplateButtons(template.components);
		try {
			const { data: res } = await MetaAPI(device.accessToken).post(
				`/${device.phoneNumberId}/messages`,
				{
					messaging_product: 'whatsapp',
					to: data.recipient,
					recipient_type: 'individual',
					type: 'template',
					template: {
						name: data.message.template_name,
						language: {
							code: 'en_US',
						},
						components: components,
					},
				}
			);
			await conversationService.addMessageToConversation(recipient._id, {
				message_id: res.messages[0].id,
				recipient: data.recipient,
				...(header ? { ...header } : {}),
				...(body ? { body: { body_type: 'TEXT', text: body } } : {}),
				...(footer ? { footer_content: footer } : {}),
				...(buttons ? { buttons } : {}),
				...(data.context
					? {
							context: {
								id: data.context.message_id,
							},
					  }
					: {}),
			});
			serviceUser.deductCredit(1);
		} catch (err) {
			let failed_reason;
			if (axios.isAxiosError(err)) {
				failed_reason = JSON.stringify(err.response?.data ?? '') as string;
			} else {
				failed_reason = (err as any).message as string;
			}
			return next(
				new CustomError({
					STATUS: 400,
					TITLE: 'BAD_REQUEST',
					MESSAGE: `Failed to send message. Reason: ${failed_reason}`,
				})
			);
		}
	} else {
		let media_id;

		if (_type === 'audio' || _type === 'video' || _type === 'document' || _type === 'image') {
			if (data.message.media_link) {
				const media_link = data.message.media_link;
				const media = await axios.get(media_link, {
					responseType: 'arraybuffer',
				});

				const uploadedFilePath = FileUtils.createFile({
					base_path: __basedir + Path.Misc,
					file_name: `media_${generateText(5)}`,
					data: Buffer.from(media.data).toString('base64'),
					mime_type: media.headers['content-type'],
				});

				try {
					const form = new FormData();
					form.append('messaging_product', 'whatsapp');
					form.append('file', fs.createReadStream(uploadedFilePath));

					const { data } = await MetaAPI(device.accessToken).post(
						`/${device.phoneNumberId}/media`,
						form,
						{
							headers: {
								'Content-Type': 'multipart/form-data',
							},
						}
					);
					FileUtils.deleteFile(uploadedFilePath);
					media_id = data.id;
				} catch (e) {
					FileUtils.deleteFile(uploadedFilePath);
					return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, e));
				}
			} else {
				media_id = data.message.media_id;
			}
		}

		msgObj[type] =
			_type === 'text'
				? {
						body: data.message.text,
				  }
				: _type === 'location'
				? data.message.location
				: _type === 'contacts'
				? data.message.contacts
				: {
						id: media_id,
				  };

		try {
			const { data: res } = await MetaAPI(device.accessToken).post(
				`/${device.phoneNumberId}/messages`,
				msgObj
			);
			await conversationService.addMessageToConversation(recipient._id, {
				message_id: res.messages[0].id,
				recipient: data.recipient,
				body: {
					body_type:
						type === 'text'
							? 'TEXT'
							: type === 'contacts'
							? 'CONTACT'
							: type === 'location'
							? 'LOCATION'
							: 'MEDIA',
					...{ ...message, media_id: media_id ?? null },
				},
				...(data.context
					? {
							context: {
								id: data.context.message_id,
							},
					  }
					: {}),
			});
			serviceUser.deductCredit(1);
		} catch (err) {
			let failed_reason;
			if (axios.isAxiosError(err)) {
				failed_reason = JSON.stringify(err.response?.data ?? '') as string;
			} else {
				failed_reason = (err as any).message as string;
			}
			return next(
				new CustomError({
					STATUS: 400,
					TITLE: 'BAD_REQUEST',
					MESSAGE: `Failed to send message. Reason: ${failed_reason}`,
				})
			);
		}
	}

	return Respond({
		res,
		status: 200,
	});
}

const Controller = {
	sendMessage,
};

export default Controller;
