'use client';

import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { useFields } from '@/components/context/tags';
import { useTemplates } from '@/components/context/templates';
import ContactSelectorDialog from '@/components/elements/dialogs/contact-selector';
import MediaSelectorDialog from '@/components/elements/dialogs/media-selector';
import TemplatePreview from '@/components/elements/template-preview';
import TemplateSelector from '@/components/elements/templetes-selector';
import AbsoluteCenter from '@/components/ui/absolute-center';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { countOccurrences, parseToObject } from '@/lib/utils';
import { ChatbotFlow, ChatbotFlowSchema } from '@/schema/chatbot-flow';
import { ContactWithID } from '@/schema/phonebook';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeftIcon, InfoIcon, Plus, TrashIcon } from 'lucide-react';
import { notFound, useParams, useRouter, useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { createChatbotFlow, editChatbotFlow } from '../action';

const DEFAULT_VALUE = {
	id: '',
	name: '',
	trigger: [],
	options: 'INCLUDES_IGNORE_CASE',
	isActive: false,
	nurturing: [],
	forward: {
		number: '',
		message: '',
	},
};

const tagsVariable = [
	'{{first_name}}',
	'{{last_name}}',
	'{{middle_name}}',
	'{{phone_number}}',
	'{{email}}',
	'{{birthday}}',
	'{{anniversary}}',
];

export default function CreateChatbotFlow() {
	const messageRef = useRef(0);
	const forwardMessageRef = useRef(0);
	const router = useRouter();
	const params = useParams();
	const templates = useTemplates();
	let phonebook_fields = useFields();
	phonebook_fields = phonebook_fields.filter((field) => field.value !== 'all');

	const raw = parseToObject(useSearchParams().get('data'));
	const isEditing = !!raw;

	const form = useForm<z.infer<typeof ChatbotFlowSchema>>({
		resolver: zodResolver(ChatbotFlowSchema),
		mode: 'onChange',
		defaultValues: raw || DEFAULT_VALUE,
	});

	const trigger = form.watch('trigger');
	const nurturing = form.watch('nurturing');

	const handleSubmit = (data: z.infer<typeof ChatbotFlowSchema>) => {
		for (let i = 0; i < data.nurturing.length; i++) {
			if (data.nurturing[i].respond_type === 'normal') {
				if (
					Number(data.nurturing[i].after.value) *
						(data.nurturing[i].after.type === 'min'
							? 60
							: data.nurturing[i].after.type === 'hours'
							? 3600
							: 86400) >
					86400
				) {
					toast.error('Normal message cannot be sent after more than 24 hours');
					return;
				}
			}
		}
		const details = {
			...data,
			nurturing: data.nurturing.map((nurturing) => ({
				...nurturing,
				after:
					Number(nurturing.after.value) *
					(nurturing.after.type === 'min' ? 60 : nurturing.after.type === 'hours' ? 3600 : 86400),
			})),
		};
		const promise = isEditing ? editChatbotFlow(data.id, details) : createChatbotFlow(details);
		toast.promise(promise, {
			loading: 'Saving...',
			success: (res) => {
				router.replace(`/panel/campaigns/chatbot-flow/${res}/customize`);
				return 'Saved';
			},
			error: (err) => {
				console.log(err);
				return 'Failed to save';
			},
		});
	};

	const insertVariablesToMessage = (index: number, variable: string) => {
		form.setValue(
			`nurturing.${index}.message`,
			form.getValues().nurturing[index].message.slice(0, messageRef.current) +
				variable +
				form.getValues().nurturing[index].message.slice(messageRef.current)
		);
	};

	const insertVariablesToForward = (variable: string) => {
		const message = form.getValues('forward.message');
		form.setValue(
			'forward.message',
			message?.substring(0, forwardMessageRef.current) +
				' ' +
				variable +
				' ' +
				message?.substring(forwardMessageRef.current ?? 0, message?.length)
		);
	};

	const handleTemplateChange = (index: number, details: { id: string; name: string } | null) => {
		if (!details) return;
		form.setValue(`nurturing.${index}.template_name`, details.name);
		const selectedTemplate = templates.find((template) => template.id === details.id);
		form.setValue(`nurturing.${index}.template_id`, details.id);

		const body = selectedTemplate?.components.find((c) => c.type === 'BODY');
		const variables = countOccurrences(body?.text ?? '');

		form.setValue(
			`nurturing.${index}.template_body`,
			Array.from({ length: variables }).map(() => ({
				custom_text: '',
				phonebook_data: '',
				variable_from: 'custom_text' as 'custom_text' | 'phonebook_data',
				fallback_value: '',
			}))
		);

		const header = selectedTemplate?.components.find((c) => c.type === 'HEADER');
		form.setValue(`nurturing.${index}.template_header`, {
			type: header?.format ?? '',
			media_id: '',
		});
	};

	const addEmptyTrigger = () => {
		form.setValue('trigger', [...trigger, '']);
	};

	const addEmptyNurturing = () => {
		form.setValue('nurturing', [
			...form.getValues().nurturing,
			{
				after: {
					type: 'min',
					value: '1',
				},
				respond_type: 'normal',
				message: '',
				images: [],
				videos: [],
				audios: [],
				documents: [],
				contacts: [],
				template_id: '',
				template_name: '',
				template_body: [],
				template_header: {
					type: '',
					media_id: '',
				},
			},
		]);
	};

	if (params.chatbot_id !== 'new' && !isEditing) {
		return notFound();
	}

	const deleteNurturing = (index: number) => {
		const newNurturing = [...nurturing];
		newNurturing.splice(index, 1);
		form.setValue('nurturing', newNurturing);
	};

	const isValid = ChatbotFlowSchema.safeParse(form.getValues()).success;

	return (
		<div className='custom-scrollbar flex flex-col gap-2 justify-center p-4'>
			{/*--------------------------------- TRIGGER SECTION--------------------------- */}
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className='flex flex-col rounded-xl mb-4 gap-8'
				>
					<div className='flex flex-col gap-2'>
						<Button
							type='button'
							className='self-start'
							variant={'link'}
							onClick={() => router.back()}
						>
							<ChevronLeftIcon className='w-6 h-6' />
						</Button>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem className='space-y-0 flex-1'>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder='eg. Fanfest' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='flex justify-between items-center'>
							<p>Trigger</p>
							<div className='flex gap-2 items-center'>
								<FormField
									control={form.control}
									name='trigger'
									render={({ field }) => (
										<FormItem className='space-y-0 flex-1 inline-flex items-center gap-2'>
											<FormControl>
												<Checkbox
													checked={field.value.length === 0}
													onCheckedChange={(checked) => checked && field.onChange([])}
												/>
											</FormControl>
											<div className='text-sm'>Default Message</div>
										</FormItem>
									)}
								/>
								<Button type='button' size={'sm'} onClick={addEmptyTrigger}>
									<Plus className='w-4 h-4' />
									<span>Add Trigger</span>
								</Button>
							</div>
						</div>
						<Each
							items={trigger}
							render={(item, index) => (
								<FormField
									control={form.control}
									name={`trigger.${index}`}
									render={({ field }) => (
										<FormItem className='space-y-0 flex-1'>
											<FormControl>
												<Textarea placeholder='eg. Fanfest' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						/>
					</div>

					{/*--------------------------------- RECIPIENTS SECTION--------------------------- */}

					<div className='grid grid-cols-1 gap-4'>
						<FormField
							control={form.control}
							name='options'
							render={({ field }) => (
								<FormItem className='space-y-0 flex-1'>
									<FormLabel>Conditions</FormLabel>
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='INCLUDES_IGNORE_CASE'>Includes Ignore Case</SelectItem>
												<SelectItem value='INCLUDES_MATCH_CASE'>Includes Match Case</SelectItem>
												<SelectItem value='EXACT_IGNORE_CASE'>Exact Ignore Case</SelectItem>
												<SelectItem value='EXACT_MATCH_CASE'>Exact Match Case</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* -------------------------------- FORWARD SECTION -------------------------- */}

					<div className='flex flex-col gap-2 mt-4'>
						<div className='relative'>
							<Separator />
							<AbsoluteCenter className='px-4'>Forward Leads</AbsoluteCenter>
						</div>
						<div className='flex-1 mt-2'>
							<FormField
								name='forward.number'
								control={form.control}
								render={({ field }) => (
									<FormItem className='space-y-0 flex-1'>
										<FormLabel>Forward To (without +)</FormLabel>
										<FormControl>
											<Input placeholder='ex 9175XXXXXX68' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className='flex items-center justify-center text-center text-sm mt-2 text-muted-foreground'>
							<InfoIcon className='w-4 h-4 mr-1' />
							Kindly send hi from the mentioned number to this whatsapp business api number twice a
							day preferably at 11AM and 6PM to keep getting the lead notification
						</div>
						<div className='flex-1'>
							<FormField
								name='forward.message'
								control={form.control}
								render={({ field }) => (
									<FormItem className='space-y-0 flex-1'>
										<FormLabel>Message</FormLabel>
										<FormControl>
											<Textarea
												placeholder='ex. Forwarded Lead'
												{...field}
												onMouseUp={(e: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {
													if (e.target instanceof HTMLTextAreaElement) {
														forwardMessageRef.current = e.target.selectionStart;
													}
												}}
											/>
										</FormControl>
										<div className='flex flex-wrap gap-4 pt-2'>
											<Each
												items={tagsVariable}
												render={(tag) => (
													<Badge
														className='cursor-pointer'
														onClick={() => insertVariablesToForward(tag)}
													>
														{tag}
													</Badge>
												)}
											/>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					{/*--------------------------------- NURTURING SECTION--------------------------- */}

					<div>
						<div className='flex justify-between items-center'>
							<p>Nurturing</p>
							<div className='flex gap-2 items-center'>
								<Button type='button' size={'sm'} onClick={addEmptyNurturing}>
									<Plus className='w-4 h-4' />
									<span>Add Nurturing</span>
								</Button>
							</div>
						</div>
						<Accordion type='single' collapsible>
							<Each
								items={nurturing}
								render={(item, index) => (
									<AccordionItem value={index.toString()}>
										<AccordionTrigger>Nurturing {index + 1}</AccordionTrigger>
										<Separator className='mb-4' />
										<AccordionContent>
											<div className='flex justify-between'>
												<div className='flex gap-2 items-center my-2'>
													<p>Send this message after</p>
													<div className='flex gap-2'>
														<FormField
															control={form.control}
															name={`nurturing.${index}.after.type`}
															render={({ field }) => (
																<FormItem className='space-y-0 flex-1'>
																	<FormControl>
																		<Select value={field.value} onValueChange={field.onChange}>
																			<SelectTrigger>
																				<SelectValue />
																			</SelectTrigger>
																			<SelectContent>
																				<SelectItem value='min'>Minutes</SelectItem>
																				<SelectItem value='hours'>Hours</SelectItem>
																				<SelectItem value='days'>Days</SelectItem>
																			</SelectContent>
																		</Select>
																	</FormControl>
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`nurturing.${index}.after.value`}
															render={({ field }) => (
																<FormItem className='space-y-0 flex-1'>
																	<FormControl>
																		<Input type='number' {...field} />
																	</FormControl>
																</FormItem>
															)}
														/>
													</div>
												</div>
												<Button
													variant={'destructive'}
													size={'icon'}
													onClick={() => deleteNurturing(index)}
												>
													<TrashIcon className='w-6 h-6' />
												</Button>
											</div>
											<Tabs
												defaultValue='normal'
												onValueChange={(value) =>
													form.setValue(
														`nurturing.${index}.respond_type`,
														value as ChatbotFlow['nurturing'][0]['respond_type']
													)
												}
												value={nurturing[index].respond_type}
											>
												<TabsList>
													<TabsTrigger value='normal'>Normal Message</TabsTrigger>
													<TabsTrigger value='template'>Template Message</TabsTrigger>
												</TabsList>
												<TabsContent value='normal'>
													<p>Medias</p>

													<div className='flex flex-wrap justify-stretch gap-4 my-4 w-full'>
														<ContactSelectorDialog
															onConfirm={(values: ContactWithID[]) =>
																form.setValue(
																	`nurturing.${index}.contacts`,
																	values.map((contact) => contact.id)
																)
															}
														>
															<Button variant={'outline'} className='flex-1 min-w-[200px]'>
																VCards ({nurturing[index].contacts.length})
															</Button>
														</ContactSelectorDialog>
														<MediaSelectorDialog
															type='audio'
															onConfirm={(id) => form.setValue(`nurturing.${index}.audios`, id)}
															selectedValue={nurturing[index].audios}
														>
															<Button variant={'outline'} className='flex-1 min-w-[200px]'>
																Audio ({nurturing[index].audios.length})
															</Button>
														</MediaSelectorDialog>
														<MediaSelectorDialog
															type='document'
															onConfirm={(id) => form.setValue(`nurturing.${index}.documents`, id)}
															selectedValue={nurturing[index].documents}
														>
															<Button variant={'outline'} className='flex-1 min-w-[200px]'>
																Document ({nurturing[index].documents.length})
															</Button>
														</MediaSelectorDialog>
														<MediaSelectorDialog
															type='image'
															onConfirm={(id) => form.setValue(`nurturing.${index}.images`, id)}
															selectedValue={nurturing[index].images}
														>
															<Button variant={'outline'} className='flex-1 min-w-[200px]'>
																Image ({nurturing[index].images.length})
															</Button>
														</MediaSelectorDialog>
														<MediaSelectorDialog
															type='video'
															onConfirm={(id) => form.setValue(`nurturing.${index}.videos`, id)}
															selectedValue={nurturing[index].videos}
														>
															<Button variant={'outline'} className='flex-1 min-w-[200px]'>
																Video ({nurturing[index].videos.length})
															</Button>
														</MediaSelectorDialog>
													</div>
													<FormField
														control={form.control}
														name={`nurturing.${index}.message`}
														render={({ field }) => (
															<FormItem className='space-y-0 flex-1'>
																<FormControl>
																	<Textarea
																		className='min-h-[80px] resize-none'
																		placeholder={
																			'Type your message here. \nex. You are invited to join fanfest'
																		}
																		{...field}
																		onMouseUp={(
																			e: React.MouseEvent<HTMLTextAreaElement, MouseEvent>
																		) => {
																			if (e.target instanceof HTMLTextAreaElement) {
																				messageRef.current = e.target.selectionStart;
																			}
																		}}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<div className='flex flex-wrap gap-4 mt-4'>
														<Each
															items={tagsVariable}
															render={(tag) => (
																<Badge
																	className='cursor-pointer'
																	onClick={() => insertVariablesToMessage(index, tag)}
																>
																	{tag}
																</Badge>
															)}
														/>
													</div>
												</TabsContent>
												<TabsContent value='template'>
													<p>Template</p>
													<FormField
														control={form.control}
														name={`nurturing.${index}.template_name`}
														render={({ field }) => (
															<FormItem className='space-y-0 flex-1'>
																<FormControl>
																	<TemplateSelector
																		onChange={(value) => handleTemplateChange(index, value)}
																		value={field.value}
																		placeholder='Select template'
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<Separator className='my-4' />
													<div className='flex flex-col lg:flex-row w-full justify-between gap-3'>
														<div className='flex flex-col w-full lg:w-[70%] space-y-2'>
															<p
																className='text-lg font-medium'
																hidden={
																	!(
																		(!!nurturing[index].template_header &&
																			nurturing[index].template_header.type !== 'TEXT' &&
																			nurturing[index].template_header.type !== '') ||
																		nurturing[index].template_body.length > 0
																	)
																}
															>
																Template details
															</p>
															<Show.ShowIf
																condition={
																	!!nurturing[index].template_header &&
																	nurturing[index].template_header.type !== 'TEXT' &&
																	nurturing[index].template_header.type !== ''
																}
															>
																<div className='flex items-center gap-6'>
																	<p className='font-medium'>Header Media:- </p>
																	<MediaSelectorDialog
																		singleSelect
																		selectedValue={
																			nurturing[index].template_header?.media_id
																				? [nurturing[index].template_header?.media_id]
																				: []
																		}
																		onConfirm={(media) =>
																			form.setValue(
																				`nurturing.${index}.template_header.media_id`,
																				media[0]
																			)
																		}
																		returnType='media_id'
																	>
																		<Button variant={'outline'}>Select Media</Button>
																	</MediaSelectorDialog>

																	<span>
																		{nurturing[index].template_header?.media_id
																			? 'Media selected'
																			: 'No media selected'}
																	</span>
																</div>
															</Show.ShowIf>
															<Show.ShowIf condition={nurturing[index].template_body.length > 0}>
																<Each
																	items={nurturing[index].template_body}
																	render={(item, idx) => (
																		<div className='flex flex-col'>
																			<FormLabel>Variable value {idx + 1}</FormLabel>
																			<div className='flex gap-3 flex-col md:flex-row'>
																				<FormField
																					control={form.control}
																					name={`nurturing.${index}.template_body.${idx}.variable_from`}
																					render={({ field }) => (
																						<FormItem className='space-y-0 flex-1 max-w-xs'>
																							<FormControl>
																								<Select
																									onValueChange={field.onChange}
																									defaultValue={field.value}
																								>
																									<FormControl>
																										<SelectTrigger>
																											<SelectValue placeholder='Data From' />
																										</SelectTrigger>
																									</FormControl>
																									<SelectContent>
																										<SelectItem value='phonebook_data'>
																											Phonebook Data
																										</SelectItem>
																										<SelectItem value='custom_text'>
																											Custom Text
																										</SelectItem>
																									</SelectContent>
																								</Select>
																							</FormControl>
																						</FormItem>
																					)}
																				/>
																				<Show.ShowIf
																					condition={item.variable_from === 'phonebook_data'}
																				>
																					<FormField
																						control={form.control}
																						name={`nurturing.${index}.template_body.${idx}.phonebook_data`}
																						render={({ field }) => (
																							<FormItem className='space-y-0 flex-1 max-w-xs'>
																								<FormControl>
																									<Select
																										onValueChange={field.onChange}
																										defaultValue={field.value}
																									>
																										<FormControl>
																											<SelectTrigger>
																												<SelectValue placeholder='Select Fields' />
																											</SelectTrigger>
																										</FormControl>
																										<SelectContent>
																											<Each
																												items={phonebook_fields}
																												render={(field) => (
																													<SelectItem value={field.value}>
																														{field.label}
																													</SelectItem>
																												)}
																											/>
																										</SelectContent>
																									</Select>
																								</FormControl>
																							</FormItem>
																						)}
																					/>
																					<FormField
																						control={form.control}
																						name={`nurturing.${index}.template_body.${idx}.fallback_value`}
																						render={({ field }) => (
																							<FormItem className='space-y-0 flex-1'>
																								<FormControl>
																									<Input placeholder='Fallback Value' {...field} />
																								</FormControl>
																							</FormItem>
																						)}
																					/>
																				</Show.ShowIf>

																				<Show.ShowIf
																					condition={item.variable_from === 'custom_text'}
																				>
																					<FormField
																						control={form.control}
																						name={`nurturing.${index}.template_body.${idx}.custom_text`}
																						render={({ field }) => (
																							<FormItem className='space-y-0 flex-1 max-w-lg'>
																								<FormControl>
																									<Input placeholder='Value' {...field} />
																								</FormControl>
																							</FormItem>
																						)}
																					/>
																				</Show.ShowIf>
																			</div>
																		</div>
																	)}
																/>
															</Show.ShowIf>
														</div>
														<div className='w-full lg:w-[30%] flex flex-col justify-start items-start gap-3'>
															<Show.ShowIf
																condition={
																	!!templates.find((t) => t.id === nurturing[index].template_id)
																}
															>
																<TemplatePreview
																	components={
																		templates.find((t) => t.id === nurturing[index].template_id)
																			?.components ?? []
																	}
																/>
															</Show.ShowIf>
														</div>
													</div>
												</TabsContent>
											</Tabs>
										</AccordionContent>
									</AccordionItem>
								)}
							/>
						</Accordion>
					</div>

					<div className='flex gap-4'>
						<Show.ShowIf condition={isEditing}>
							<Button
								className='flex-1'
								variant={'outline'}
								type='button'
								onClick={() => router.back()}
							>
								Cancel
							</Button>
						</Show.ShowIf>
						<Button className='flex-1' type='submit' disabled={!isValid}>
							Save
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
