'use client';
import { QuickTemplateMessageProps } from '@/app/panel/conversations/_components/message-input';
import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { useFields } from '@/components/context/tags';
import { useTemplates } from '@/components/context/templates';
import TemplateSelector from '@/components/elements/templetes-selector';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { countOccurrences } from '@/lib/utils';
import { Carousel } from '@/schema/template';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import TemplateBodyInput from '../template-body-input';
import TemplateButtonInput from '../template-buttons-input';
import TemplateHeaderInput from '../template-header-input';
import TemplatePreview from '../template-preview';

export default function TemplateDialog({
	children,
	onConfirm,
	template: _template,
}: {
	template?: QuickTemplateMessageProps;
	children: React.ReactNode;
	onConfirm: (details: QuickTemplateMessageProps) => void;
}) {
	const buttonRef = useRef<HTMLButtonElement>(null);

	const templates = useTemplates();

	const [template_name, setTemplateName] = useState<string>('');
	const [template_header, setTemplateHeader] = useState<{
		type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'NONE';
		link?: string;
		media_id?: string;
		text?: {
			custom_text: string;
			phonebook_data?: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value?: string;
		}[];
	}>({
		type: 'NONE',
		link: '',
		media_id: '',
		text: [],
	});
	const [template_body, setTemplateBody] = useState<
		{
			custom_text: string;
			phonebook_data?: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value?: string;
		}[]
	>([]);
	const [template_id, setTemplateId] = useState<string>('');
	const [template_carousel, setTemplateCarousel] = useState<{
		cards: {
			header: {
				media_id: string;
			};
			body: {
				custom_text: string;
				phonebook_data?: string;
				variable_from: 'custom_text' | 'phonebook_data';
				fallback_value?: string;
			}[];
			buttons: string[][];
		}[];
	}>({ cards: [] });
	const [template_buttons, setTemplateButton] = useState<string[][]>([]);

	useEffect(() => {
		if (_template) {
			setTemplateName(_template.template_name);
			setTemplateId(_template.template_id);
			if (_template.header) {
				setTemplateHeader(_template.header);
			}
			if (_template.body) {
				setTemplateBody(_template.body);
			}
			if (_template.buttons) {
				setTemplateButton(_template.buttons);
			}
			if (_template.carousel) {
				setTemplateCarousel(_template.carousel);
			}
		}
	}, [_template]);

	let phonebook_fields = useFields();
	phonebook_fields = phonebook_fields.filter((field) => field.value !== 'all');

	const validateTemplate = () => {
		if (!template_id) {
			return toast.error('Please select a template');
		}
		if (
			(template?.header?.format === 'IMAGE' ||
				template?.header?.format === 'VIDEO' ||
				template?.header?.format === 'DOCUMENT') &&
			!template_header.media_id
		) {
			return toast.error('No media for header');
		}
		if (template_header.type === 'TEXT') {
			if (template_header.text) {
				if (
					template_header.text.some(
						(text) => text.variable_from === 'custom_text' && !text.custom_text
					)
				) {
					return toast.error('Empty variables in template header');
				}
				if (
					template_header.text.some(
						(text) => text.variable_from === 'phonebook_data' && !text.phonebook_data
					)
				) {
					return toast.error('Phonebook field not selected in template header');
				}
				if (
					template_header.text.some(
						(text) => text.variable_from === 'phonebook_data' && !text.fallback_value
					)
				) {
					return toast.error('Empty fallback value in template header');
				}
			}
		}
		if (template_body.length > 0) {
			if (
				template_body.some(
					(body) => body.variable_from === 'phonebook_data' && !body.phonebook_data
				)
			) {
				return toast.error('Phonebook field not selected in template body');
			}
			if (
				template_body.some(
					(body) => body.variable_from === 'phonebook_data' && !body.fallback_value
				)
			) {
				return toast.error('Empty fallback value in template body');
			}
			if (template_body.some((body) => body.variable_from === 'custom_text' && !body.custom_text)) {
				return toast.error('Empty value in template body');
			}
		}
		if (template_carousel.cards.length > 0) {
			if (template_carousel.cards.some((card) => !card.header.media_id)) {
				return toast.error('Empty media in carousel headers');
			}
			if (
				template_carousel.cards.some((card) =>
					card.body.some((body) => body.variable_from === 'phonebook_data' && !body.phonebook_data)
				)
			) {
				return toast.error('Phonebook field not selected in carousel body');
			}
			if (
				template_carousel.cards.some((card) =>
					card.body.some((body) => body.variable_from === 'phonebook_data' && !body.fallback_value)
				)
			) {
				return toast.error('Empty fallback value in carousel body');
			}
			if (
				template_carousel.cards.some((card) =>
					card.body.some((body) => body.variable_from === 'custom_text' && !body.custom_text)
				)
			) {
				return toast.error('Empty value in carousel body');
			}
			if (
				template_carousel.cards.some((card) =>
					card.buttons.some((button) => button.some((button) => !button))
				)
			) {
				return toast.error('Empty value in carousel buttons');
			}
		}
		if (template_buttons.some((button) => button.some((variable) => !variable))) {
			return toast.error('Empty value in buttons');
		}
	};

	const handleSave = () => {
		if (validateTemplate()) {
			return;
		}

		onConfirm({
			template_id,
			template_name,
			header: template_header,
			body: template_body,
			buttons: template_buttons,
			...(template_carousel.cards.length > 0 && { carousel: template_carousel }),
		});
		buttonRef.current?.click();
		setTemplateName('');
		setTemplateHeader({
			type: 'TEXT',
			link: '',
			media_id: '',
			text: [],
		});
		setTemplateBody([]);
		setTemplateId('');
		setTemplateButton([]);
		setTemplateCarousel({ cards: [] });
	};

	const template = templates.find((t) => t.id === template_id);

	const handleTemplateChange = (details: { id: string; name: string } | null) => {
		if (!details) return;

		setTemplateName(details.name);
		setTemplateId(details.id);

		const selectedTemplate = templates.find((template) => template.id === details.id);

		const body_variables = countOccurrences(selectedTemplate?.body?.text ?? '');
		if (selectedTemplate?.header && selectedTemplate?.header?.format === 'TEXT') {
			const header_variables = countOccurrences(selectedTemplate?.header.text ?? '');
			setTemplateHeader({
				type: selectedTemplate?.header?.format ?? '',
				link: '',
				media_id: '',
				text: Array.from({ length: header_variables }).map((_, index) => ({
					custom_text: `{{${index + 1}}}`,
					phonebook_data: '',
					variable_from: 'custom_text',
					fallback_value: '',
				})),
			});
		} else {
			setTemplateHeader({
				type: selectedTemplate?.header?.format ?? 'NONE',
				media_id: '',
				link: '',
				text: [],
			});
		}

		setTemplateBody(
			Array.from({ length: body_variables }).map((_, index) => ({
				custom_text: `{{${index + 1}}}`,
				phonebook_data: '',
				variable_from: 'custom_text',
				fallback_value: '',
			}))
		);

		if (selectedTemplate?.buttons) {
			setTemplateButton(
				Array.from({ length: (selectedTemplate?.buttons).length }).map((button, index) => {
					if ((selectedTemplate?.buttons ?? [])[index].type === 'URL') {
						return Array.from({
							length: countOccurrences((selectedTemplate?.buttons ?? [])[index].text),
						}).map(() => '');
					}
					return [];
				})
			);
		} else {
			setTemplateButton([]);
		}

		if (selectedTemplate?.carousel?.cards) {
			setTemplateCarousel({
				cards: Array.from({
					length: (selectedTemplate?.carousel?.cards as Carousel['cards']).length,
				}).map((_, index) => {
					return {
						header: {
							media_id: '',
						},
						body: Array.from({
							length: countOccurrences(selectedTemplate?.carousel?.cards[index].body.text ?? ''),
						}).map((_, index) => ({
							custom_text: `{{${index + 1}}}`,
							phonebook_data: '',
							variable_from: 'custom_text',
							fallback_value: '',
						})),

						buttons: Array.from({
							length: (selectedTemplate?.carousel?.cards[index].buttons ?? []).length,
						}).map((_, buttonIndex) => {
							if (selectedTemplate?.carousel?.cards[index].buttons[buttonIndex].type === 'URL') {
								return Array.from({
									length: countOccurrences(
										selectedTemplate?.carousel?.cards[index].buttons[buttonIndex].url
									),
								}).map(() => '');
							}
							return [];
						}),
					};
				}),
			});
		} else {
			setTemplateCarousel({
				cards: [],
			});
		}
	};

	return (
		<Dialog>
			<DialogTrigger ref={buttonRef} asChild>
				{children}
			</DialogTrigger>
			<DialogContent className='max-w-sm md:max-w-xl lg:max-w-[90%]'>
				<DialogHeader>
					<DialogTitle>Template Message</DialogTitle>
				</DialogHeader>
				<ScrollArea className=' max-h-[700px] '>
					<TemplateSelector
						onChange={(value) => handleTemplateChange(value)}
						value={template_name}
						placeholder='Select template'
					/>
					<Separator className='my-4' />
					<div className='flex flex-col lg:flex-row w-full justify-between gap-3'>
						<div className='flex flex-col w-full lg:w-[70%] space-y-2'>
							<p
								className='text-lg font-medium'
								hidden={
									!(
										(!!template_header &&
											template_header.type !== 'TEXT' &&
											template_header.type !== 'NONE') ||
										template_body.length > 0
									)
								}
							>
								Template details
							</p>
							<TemplateHeaderInput
								template_header={template_header}
								setTemplateHeader={setTemplateHeader}
								phonebook_fields={phonebook_fields}
							/>
							<Show.ShowIf condition={template_body.length > 0}>
								<div className='border-2 p-2 rounded-lg border-dashed mt-2'>
									<div className='w-full text-md !text-center font-bold'>Body Variables</div>
									<TemplateBodyInput
										template_body={template_body}
										phonebook_fields={phonebook_fields}
										setTemplateBody={setTemplateBody}
									/>
								</div>
							</Show.ShowIf>

							<Show.ShowIf condition={template_carousel.cards.length > 0}>
								<div className='border-2 p-2 rounded-lg '>
									<div className='w-full text-md !text-center font-bold'>Carousel Variables</div>

									<Each
										items={template_carousel.cards}
										render={(card, cardIndex) => (
											<div>
												<div className='text-center border-t-2 pt-2 mt-1 font-bold'>
													Card number {cardIndex + 1}
												</div>
												<div className='flex items-center gap-6 border-2 border-dashed p-2 mb-2 rounded-lg'>
													<TemplateHeaderInput
														template_header={{
															type: 'IMAGE',
															media_id: card.header.media_id,
														}}
														phonebook_fields={phonebook_fields}
														setTemplateHeader={(header) => {
															setTemplateCarousel((prev) => {
																const newCarousel = { ...prev };
																newCarousel.cards[cardIndex].header.media_id = (header.media_id ??
																	[])[0];
																return newCarousel;
															});
														}}
													/>
												</div>

												<div className='border-2 border-dashed p-2 rounded-lg'>
													<div className='text-center'>Body variables</div>
													<TemplateBodyInput
														phonebook_fields={phonebook_fields}
														template_body={card.body}
														setTemplateBody={(body) => {
															setTemplateCarousel((prev) => {
																const newCarousel = { ...prev };
																newCarousel.cards[cardIndex].body = body;
																return newCarousel;
															});
														}}
													/>
												</div>
												<Show.ShowIf condition={card.buttons.length > 0}>
													<div className='border-2 border-dashed p-2 mt-2 rounded-lg'>
														<div className='w-full text-md !text-center'>Buttons Variables</div>
														<TemplateButtonInput
															buttons={card.buttons}
															setButtons={(buttons) => {
																setTemplateCarousel((prev) => {
																	const newCarousel = { ...prev };
																	newCarousel.cards[cardIndex].buttons = buttons;
																	return newCarousel;
																});
															}}
														/>
													</div>
												</Show.ShowIf>
											</div>
										)}
									/>
								</div>
							</Show.ShowIf>
							<Show.ShowIf condition={template_buttons.length > 0}>
								<div className='border-2 border-dashed p-2 mt-2 rounded-lg'>
									<div className='w-full text-md !text-center'>Buttons Variables</div>
									<TemplateButtonInput buttons={template_buttons} setButtons={setTemplateButton} />
								</div>
							</Show.ShowIf>
						</div>
						<div className='w-full lg:w-[30%] flex flex-col justify-start items-start gap-3'>
							<Show.ShowIf condition={!!template}>
								<TemplatePreview
									headerVariables={(template_header.text ?? []).map((variable) => {
										if (variable.variable_from === 'custom_text') {
											return variable.custom_text;
										} else {
											return variable.fallback_value ?? '';
										}
									})}
									bodyVariables={template_body.map((variable) => {
										if (variable.variable_from === 'custom_text') {
											return variable.custom_text;
										} else {
											return variable.fallback_value ?? '';
										}
									})}
									carouselVariables={template_carousel.cards.map((card) => {
										return card.body.map((body) => {
											if (body.variable_from === 'custom_text') {
												return body.custom_text;
											} else {
												return body.fallback_value ?? '';
											}
										});
									})}
									template={template}
								/>
							</Show.ShowIf>
						</div>
					</div>
				</ScrollArea>
				<DialogFooter>
					<Button onClick={handleSave}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
