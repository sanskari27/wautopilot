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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { countOccurrences, parseToObject } from '@/lib/utils';
import { ChatBot, chatbotSchema } from '@/schema/chatbot';
import { ContactWithID } from '@/schema/phonebook';
import ChatBotService from '@/services/chatbot.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetIcon } from '@radix-ui/react-icons';
import { Separator } from '@radix-ui/react-separator';
import { ChevronLeftIcon, InfoIcon, Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import LeadNurturingDialog from '../_component/lead-nurturing-dialog';

const tagsVariable = [
	'{{first_name}}',
	'{{last_name}}',
	'{{middle_name}}',
	'{{phone_number}}',
	'{{email}}',
	'{{birthday}}',
	'{{anniversary}}',
	'{{trigger}}',
];

const tagsVariableMessage = [
	'{{first_name}}',
	'{{last_name}}',
	'{{middle_name}}',
	'{{phone_number}}',
	'{{email}}',
	'{{birthday}}',
	'{{anniversary}}',
];

const DEFAULT_DATA: ChatBot = {
	id: '',
	reply_to_message: false,
	trigger: [],
	options: 'INCLUDES_IGNORE_CASE',
	trigger_gap_time: '1',
	trigger_gap_type: 'SEC',
	response_delay_time: '1',
	response_delay_type: 'SEC',
	startAt: '',
	endAt: '',
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
		type: 'TEXT',
		link: '',
		media_id: '',
	},
	nurturing: [],
	forward: {
		number: '',
		message: '',
	},
	isActive: false,
};

export default function ChatbotForm() {
	let phonebook_fields = useFields();
	phonebook_fields = phonebook_fields.filter((field) => field.value !== 'all');

	const messageRef = useRef(0);
	const forwardMessageRef = useRef(0);

	const router = useRouter();
	const raw = parseToObject(useSearchParams().get('data'));
	const isEditingBot = !!raw;

	const templates = useTemplates();

	const form = useForm<z.infer<typeof chatbotSchema>>({
		resolver: zodResolver(chatbotSchema),
		mode: 'onChange',
		defaultValues: raw || DEFAULT_DATA,
	});
	const trigger = form.watch('trigger');
	const images = form.watch('images');
	const videos = form.watch('videos');
	const audios = form.watch('audios');
	const documents = form.watch('documents');
	const contacts = form.watch('contacts');
	const message = form.watch('message');
	const template_id = form.watch('template_id');
	const template_body = form.watch('template_body');
	const header = form.watch('template_header');
	const respond_type = form.watch('respond_type');

	const isChatbotValid = form.formState.isValid;

	const template = templates.find((t) => t.id === template_id);

	const insertVariablesToMessage = (variable: string) => {
		form.setValue(
			'message',
			message?.substring(0, messageRef.current) +
				' ' +
				variable +
				' ' +
				message?.substring(messageRef.current ?? 0, message?.length)
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

	const handleTemplateChange = (details: { id: string; name: string } | null) => {
		if (!details) return;
		form.setValue('template_name', details.name);
		const selectedTemplate = templates.find((template) => template.id === details.id);
		form.setValue('template_id', details.id);

		const body = selectedTemplate?.components.find((c) => c.type === 'BODY');
		const variables = countOccurrences(body?.text ?? '');

		form.setValue(
			'template_body',
			Array.from({ length: variables }).map(() => ({
				custom_text: '',
				phonebook_data: '',
				variable_from: 'custom_text' as 'custom_text' | 'phonebook_data',
				fallback_value: '',
			}))
		);

		const header = selectedTemplate?.components.find((c) => c.type === 'HEADER');
		form.setValue('template_header', {
			type: header?.format ?? '',
			link: '',
			media_id: '',
		});
	};

	const handleSubmit = (data: ChatBot) => {
		const details = {
			...data,
			nurturing: data.nurturing.map((item) => {
				return {
					...item,
					after:
						Number(item.after.value) *
						(item.after.type === 'minutes' ? 60 : item.after.type === 'hours' ? 3600 : 86400),
				};
			}),
			trigger_gap_seconds:
				Number(data.trigger_gap_time) *
				(data.trigger_gap_type === 'SEC' ? 1 : data.trigger_gap_type === 'MINUTE' ? 60 : 3600),
			response_delay_seconds:
				Number(data.response_delay_time) *
				(data.response_delay_type === 'SEC'
					? 1
					: data.response_delay_type === 'MINUTE'
					? 60
					: 3600),
		};

		const promise = data.id
			? ChatBotService.editChatBot({
					botId: data.id,
					details: details,
			  })
			: ChatBotService.createBot(details);

		toast.promise(promise, {
			loading: 'Saving Chatbot...',
			success: (res) => {
				if (!res) {
					return 'Error saving chatbot. Please try agin.';
				}
				router.push(`/panel/campaigns/chatbot`);
				return 'Successfully saved chatbot.';
			},
			error: (err) => {
				console.log(err);
				return 'Error saving chatbot. Please try agin.';
			},
		});
	};

	const addEmptyTrigger = () => {
		form.setValue('trigger', [...trigger, '']);
	};

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
								<div>
									<FormField
										control={form.control}
										name='reply_to_message'
										render={({ field }) => (
											<FormItem className='space-y-0 flex-1 inline-flex items-center gap-2'>
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={(checked) => field.onChange(checked)}
													/>
												</FormControl>
												<div className='text-sm'>Reply</div>
											</FormItem>
										)}
									/>
								</div>
								<Button type='button' size={'sm'} onClick={addEmptyTrigger}>
									<Plus className='w-4 h-4' />
									<span>Add Trigger</span>
								</Button>
							</div>
						</div>
						<Each
							items={trigger}
							render={(_trigger, index) => (
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

					<div>
						<FormField
							control={form.control}
							name='options'
							render={({ field }) => (
								<FormItem className='space-y-0 flex-1'>
									<FormLabel>
										Conditions<span className='ml-[0.2rem] text-red-800'>*</span>
									</FormLabel>
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

					{/*--------------------------------- GAP & DELAY SECTION--------------------------- */}
					<div className='flex flex-col md:flex-row gap-4'>
						<div className='flex flex-col md:flex-row gap-4 flex-1'>
							<div className='flex flex-col gap-2'>
								<div className='grid grid-cols-2 gap-2 items-end'>
									<FormField
										control={form.control}
										name='trigger_gap_time'
										render={({ field }) => (
											<FormItem className='space-y-0 flex-1 max-w-md'>
												<FormLabel>
													Gap Delay<span className='ml-[0.2rem] text-red-800'>*</span>
												</FormLabel>
												<FormControl>
													<Input type='number' placeholder='eg. 10' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='trigger_gap_type'
										render={({ field }) => (
											<FormItem className='space-y-0 flex-1 max-w-md'>
												<FormControl>
													<Select value={field.value} onValueChange={field.onChange}>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value='SEC'>Second</SelectItem>
															<SelectItem value='MINUTE'>Min</SelectItem>
															<SelectItem value='HOUR'>Hour</SelectItem>
														</SelectContent>
													</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
							<div className='flex flex-col gap-2'>
								<div className='grid grid-cols-2 items-end gap-2'>
									<FormField
										control={form.control}
										name='response_delay_time'
										render={({ field }) => (
											<FormItem className='space-y-0 flex-1 max-w-md'>
												<FormLabel>
													Message Delay<span className='ml-[0.2rem] text-red-800'>*</span>
												</FormLabel>
												<FormControl>
													<Input type='number' placeholder='eg. 10' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='response_delay_type'
										render={({ field }) => (
											<FormItem className='space-y-0 flex-1 max-w-md'>
												<FormControl>
													<Select value={field.value} onValueChange={field.onChange}>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value='SEC'>Second</SelectItem>
															<SelectItem value='MINUTE'>Min</SelectItem>
															<SelectItem value='HOUR'>Hour</SelectItem>
														</SelectContent>
													</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>
						<div className='flex flex-col md:flex-row gap-4 flex-1'>
							<FormField
								control={form.control}
								name='startAt'
								render={({ field }) => (
									<FormItem className='space-y-0 flex-1 max-w-md'>
										<FormLabel>
											Start At (in IST)<span className='ml-[0.2rem] text-red-800'>*</span>
										</FormLabel>
										<FormControl>
											<Input type='time' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='endAt'
								render={({ field }) => (
									<FormItem className='space-y-0 flex-1 max-w-md'>
										<FormLabel>
											End At (in IST)<span className='ml-[0.2rem] text-red-800'>*</span>
										</FormLabel>
										<FormControl>
											<Input type='time' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					{/*--------------------------------- MESSAGE SECTION--------------------------- */}
					<Tabs
						defaultValue='normal'
						onValueChange={(value) =>
							form.setValue('respond_type', value as ChatBot['respond_type'])
						}
						value={respond_type}
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
											'contacts',
											values.map((contact) => contact.id)
										)
									}
								>
									<Button variant={'outline'} className='flex-1 min-w-[200px]'>
										VCards ({contacts.length})
									</Button>
								</ContactSelectorDialog>
								<MediaSelectorDialog
									type='audio'
									onConfirm={(id) => form.setValue('audios', id)}
									selectedValue={audios}
								>
									<Button variant={'outline'} className='flex-1 min-w-[200px]'>
										Audio ({audios.length})
									</Button>
								</MediaSelectorDialog>
								<MediaSelectorDialog
									type='document'
									onConfirm={(id) => form.setValue('documents', id)}
									selectedValue={documents}
								>
									<Button variant={'outline'} className='flex-1 min-w-[200px]'>
										Document ({documents.length})
									</Button>
								</MediaSelectorDialog>
								<MediaSelectorDialog
									type='image'
									onConfirm={(id) => form.setValue('images', id)}
									selectedValue={images}
								>
									<Button variant={'outline'} className='flex-1 min-w-[200px]'>
										Image ({images.length})
									</Button>
								</MediaSelectorDialog>
								<MediaSelectorDialog
									type='video'
									onConfirm={(id) => form.setValue('videos', id)}
									selectedValue={videos}
								>
									<Button variant={'outline'} className='flex-1 min-w-[200px]'>
										Video ({videos.length})
									</Button>
								</MediaSelectorDialog>
							</div>
							<FormField
								control={form.control}
								name='message'
								render={({ field }) => (
									<FormItem className='space-y-0 flex-1'>
										<FormControl>
											<Textarea
												className='min-h-[80px] resize-none'
												placeholder={
													'Type your message here. \nex. You are invited to join fanfest'
												}
												{...field}
												onMouseUp={(e: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {
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
									items={tagsVariableMessage}
									render={(tag) => (
										<Badge className='cursor-pointer' onClick={() => insertVariablesToMessage(tag)}>
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
								name='template_name'
								render={({ field }) => (
									<FormItem className='space-y-0 flex-1'>
										<FormControl>
											<TemplateSelector
												onChange={(value) => handleTemplateChange(value)}
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
												(!!header && header.type !== 'TEXT' && header.type !== '') ||
												template_body.length > 0
											)
										}
									>
										Template details
									</p>
									<Show.ShowIf condition={!!header && header.type !== 'TEXT' && header.type !== ''}>
										<div className='flex items-center gap-6'>
											<p className='font-medium'>
												Header Media<span className='mr-[0.2rem] text-red-800'>*</span>:{' '}
											</p>
											<MediaSelectorDialog
												singleSelect
												selectedValue={header?.media_id ? [header?.media_id] : []}
												onConfirm={(media) => form.setValue('template_header.media_id', media[0])}
												returnType='media_id'
											>
												<Button variant={'outline'}>Select Media</Button>
											</MediaSelectorDialog>

											<span>{header?.media_id ? 'Media selected' : 'No media selected'}</span>
										</div>
									</Show.ShowIf>
									<Show.ShowIf condition={template_body.length > 0}>
										<Each
											items={template_body}
											render={(item, index) => (
												<div className='flex flex-col'>
													<FormLabel>
														Variable value {index + 1}
														<span className='ml-[0.2rem] text-red-800'>*</span>
													</FormLabel>
													<div className='flex gap-3 flex-col md:flex-row'>
														<FormField
															control={form.control}
															name={`template_body.${index}.variable_from`}
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
																				<SelectItem value='custom_text'>Custom Text</SelectItem>
																			</SelectContent>
																		</Select>
																	</FormControl>
																</FormItem>
															)}
														/>
														<Show.ShowIf condition={item.variable_from === 'phonebook_data'}>
															<FormField
																control={form.control}
																name={`template_body.${index}.phonebook_data`}
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
																name={`template_body.${index}.fallback_value`}
																render={({ field }) => (
																	<FormItem className='space-y-0 flex-1'>
																		<FormControl>
																			<Input placeholder='Fallback Value' {...field} />
																		</FormControl>
																	</FormItem>
																)}
															/>
														</Show.ShowIf>

														<Show.ShowIf condition={item.variable_from === 'custom_text'}>
															<FormField
																control={form.control}
																name={`template_body.${index}.custom_text`}
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
									<Show.ShowIf condition={!!template}>
										<TemplatePreview components={template?.components ?? []} />
									</Show.ShowIf>
								</div>
							</div>
						</TabsContent>
					</Tabs>
					<div className='flex justify-end m-4'>
						<LeadNurturingDialog form={form} nurturing={form.getValues('nurturing')}>
							<Button onClick={() => {}}>
								Leads Nurturing ({form.getValues('nurturing').length})
							</Button>
						</LeadNurturingDialog>
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

					<Separator className='my-2' />

					{/*--------------------------------- BUTTONS SECTION--------------------------- */}

					<div className='flex gap-4 justify-between items-center py-8'>
						{isEditingBot && (
							<Button
								type='button'
								className='w-full'
								variant={'outline'}
								onClick={() => {
									router.back();
								}}
							>
								Cancel
							</Button>
						)}
						<Button className='w-full' type='submit' disabled={!isChatbotValid}>
							Save
						</Button>
						<Button
							type='button'
							onClick={() => form.reset()}
							className='py-4'
							size={'icon'}
							variant={'secondary'}
						>
							<ResetIcon className='w-6 h-4' />
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
