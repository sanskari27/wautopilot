'use client';
import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { useFields } from '@/components/context/tags';
import { useTemplates } from '@/components/context/templates';
import { usePermissions } from '@/components/context/user-details';
import MediaSelectorDialog from '@/components/elements/dialogs/media-selector';
import NumberInputDialog from '@/components/elements/dialogs/numberInput';
import TagsSelector from '@/components/elements/popover/tags';
import TemplatePreview from '@/components/elements/template-preview';
import TemplatesSelector from '@/components/elements/templetes-selector';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
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
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import api from '@/lib/api';
import { countOccurrences, getDateObject, getFormattedDate } from '@/lib/utils';
import { Broadcast, broadcastSchema } from '@/schema/broadcastSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function BroadcastPage() {
	const permissions = usePermissions().broadcast;

	const templates = useTemplates();
	let phonebook_fields = useFields();
	phonebook_fields = phonebook_fields.filter((field) => field.value !== 'all');

	const form = useForm<Broadcast>({
		resolver: zodResolver(broadcastSchema),
		defaultValues: {
			name: '',
			description: '',
			template_id: '',
			template_name: '',
			to: [],
			labels: [],
			body: [],
			broadcast_options: {
				broadcast_type: 'scheduled',
				startDate: getFormattedDate(new Date()),
				startTime: '10:00',
				endTime: '18:00',
				daily_messages_count: 100,
			},
			recipients_from: 'numbers',
		},
	});

	const fields = form.watch();
	const template = templates.find((t) => t.id === fields.template_id);
	const header = template?.components.find((component) => component.type === 'HEADER');
	const carousels = template?.components.filter((component) => component.type === 'CAROUSEL');

	console.log(carousels);

	const validationResult = broadcastSchema.safeParse(fields);
	if (!validationResult.success) {
		console.error(validationResult.error.errors);
	}

	function handleSave(data: Broadcast) {
		if (!permissions.create) return toast.error('You do not have permission to create a broadcast');
		const promise = api.post(`/broadcast/send`, {
			name: data.name,
			description: data.description,
			template_id: data.template_id,
			template_name: data.template_name,
			to: data.recipients_from === 'numbers' ? data.to : [],
			labels: data.recipients_from === 'tags' ? data.labels : [],
			broadcast_options: data.broadcast_options,
			body: data.body,
			...(header
				? {
						header: {
							media_id: data.header?.media_id,
							link: data.header?.link,
							type: header.format,
						},
				  }
				: {}),
		});

		toast.promise(promise, {
			loading: 'Scheduling Broadcast...',
			success: () => {
				form.reset();
				return 'Broadcast scheduled successfully';
			},
			error: 'Failed to schedule broadcast',
		});
	}

	function handleTemplateChange(selected: { id: string; name: string } | null) {
		form.setValue('template_id', selected?.id ?? '');
		form.setValue('template_name', selected?.name ?? '');
		const template = templates.find((t) => t.id === selected?.id);
		if (!template) {
			return;
		}
		const header = template?.components.find((component) => component.type === 'HEADER');
		const body = template?.components.find((component) => component.type === 'BODY');
		const variables = countOccurrences(body?.text ?? '');
		if (header && header.format !== 'TEXT') {
			form.setValue('header', {
				type: header.format,
				media_id: '',
			});
		}
		const carousels = template?.components.filter((component) => component.type === 'CAROUSEL')[0]
			.cards;
		form.setValue(
			'body',
			Array.from({ length: variables }).map((_, index) => ({
				custom_text: '',
				phonebook_data: '',
				variable_from: 'custom_text' as 'custom_text' | 'phonebook_data',
				fallback_value: '',
			}))
		);
		form.setValue(
			'carousel',
			Array.from({ length: carousels.length }).map((_, index) => ({
				header: {
					type: carousels[index].components.filter((component) => component.type === 'HEADER')[0]
						.format as 'IMAGE' | 'VIDEO',
					media_id: '',
				},
				body: Array.from({
					length: countOccurrences(
						carousels[index].components.filter((component) => component.type === 'BODY')[0].text
					),
				}).map(() => ({
					custom_text: '',
					phonebook_data: '',
					variable_from: 'custom_text' as 'custom_text' | 'phonebook_data',
					fallback_value: '',
				})),
			}))
		);
	}

	console.log(form.getValues('carousel'));

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Broadcast</h2>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSave)} className='w-full space-y-2'>
					<div className='flex flex-col gap-3 w-full'>
						<div className='flex gap-x-3 gap-y-2 flex-wrap'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem className='space-y-0 flex-1 max-w-md'>
										<FormLabel className='text-primary'>
											Broadcast Name<span className='ml-[0.2rem] text-red-800'>*</span>
										</FormLabel>
										<FormControl>
											<Input placeholder='eg. Fanfest' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormItem className='space-y-0 flex-1 max-w-sm'>
								<FormLabel className='text-primary'>
									Select Template<span className='ml-[0.2rem] text-red-800'>*</span>
								</FormLabel>
								<FormControl>
									<TemplatesSelector
										placeholder='Select Template'
										value={fields.template_name}
										onChange={handleTemplateChange}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
							<FormField
								control={form.control}
								name='broadcast_options.broadcast_type'
								render={({ field }) => (
									<FormItem className='space-y-0 flex-1 max-w-[15rem]'>
										<FormLabel className='text-primary'>
											Broadcast Type<span className='ml-[0.2rem] text-red-800'>*</span>
										</FormLabel>
										<FormControl>
											<ToggleGroup
												className='justify-start'
												type='single'
												value={field.value}
												onValueChange={field.onChange}
											>
												<ToggleGroupItem value='scheduled' aria-label='scheduled'>
													Scheduled
												</ToggleGroupItem>
												<ToggleGroupItem value='instant' aria-label='instant'>
													Instant
												</ToggleGroupItem>
											</ToggleGroup>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='recipients_from'
								render={({ field }) => (
									<FormItem className='space-y-0 flex-1 max-w-[15rem]'>
										<FormLabel className='text-primary'>
											Recipients From<span className='ml-[0.2rem] text-red-800'>*</span>
										</FormLabel>
										<FormControl>
											<ToggleGroup
												className='justify-start'
												type='single'
												value={field.value}
												onValueChange={field.onChange}
											>
												<ToggleGroupItem value='numbers' aria-label='numbers'>
													Numbers
												</ToggleGroupItem>
												<ToggleGroupItem value='tags' aria-label='tags'>
													Tags
												</ToggleGroupItem>
											</ToggleGroup>
										</FormControl>
									</FormItem>
								)}
							/>

							<div className='space-y-0 flex-1 flex items-end pb-1'>
								<Show.ShowIf condition={fields.recipients_from === 'numbers'}>
									<NumberInputDialog
										onSubmit={(numbers) => {
											form.setValue('to', numbers);
										}}
									>
										<Button variant={'outline'} className='w-full'>
											Choose Numbers:- {fields.to.length ? `(${fields.to.length})` : '(0)'}
										</Button>
									</NumberInputDialog>
								</Show.ShowIf>
								<Show.ShowIf condition={fields.recipients_from === 'tags'}>
									<TagsSelector
										onChange={(tags) => {
											form.setValue('labels', tags);
										}}
									>
										<Button variant={'outline'} className='w-full'>
											Select Tags:- {fields.labels.length ? `(${fields.labels.length})` : '(0)'}
										</Button>
									</TagsSelector>
								</Show.ShowIf>
							</div>
						</div>

						<div className='flex flex-col lg:flex-row justify-between lg:items-end gap-3'>
							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem className='space-y-0 flex-1'>
										<FormLabel className='text-primary'>Description</FormLabel>
										<FormControl>
											<Textarea className='h-24' placeholder='eg. Fanfest audience' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Show.ShowIf condition={fields.broadcast_options.broadcast_type === 'scheduled'}>
								<div className='flex-1'>
									<h3 className='font-medium text-lg'>Scheduling Options</h3>
									<div className='flex gap-x-3 gap-y-2 flex-wrap'>
										<FormField
											control={form.control}
											name='broadcast_options.startDate'
											render={({ field }) => (
												<FormItem className='space-y-0 flex-1 max-w-xs'>
													<FormLabel className='text-primary'>
														Start Date<span className='ml-[0.2rem] text-red-800'>*</span>
													</FormLabel>
													<FormControl>
														<DatePicker
															onChange={(date) => {
																form.setValue(
																	'broadcast_options.startDate',
																	date ? getFormattedDate(date) : ''
																);
															}}
															value={getDateObject(field.value)}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name='broadcast_options.startTime'
											render={({ field }) => (
												<FormItem className='space-y-0'>
													<FormLabel className='text-primary'>
														Start Time<span className='ml-[0.2rem] text-red-800'>*</span>
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
											name='broadcast_options.endTime'
											render={({ field }) => (
												<FormItem className='space-y-0'>
													<FormLabel className='text-primary'>
														End Time<span className='ml-[0.2rem] text-red-800'>*</span>
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
											name='broadcast_options.daily_messages_count'
											render={({ field }) => (
												<FormItem className='space-y-0 flex-1 max-w-xs'>
													<FormLabel className='text-primary'>
														No of messages daily<span className='ml-[0.2rem] text-red-800'>*</span>
													</FormLabel>
													<FormControl>
														<Input
															type='number'
															value={field.value}
															onChange={(e) => {
																const value = Number(e.target.value);
																if (isNaN(value) || value < 0) {
																	return field.onChange(0);
																}
																field.onChange(Number(value));
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							</Show.ShowIf>
						</div>

						<Separator />
						<div className='flex flex-col lg:flex-row w-full justify-between gap-3'>
							<div className='flex flex-col w-full lg:w-[70%] space-y-2'>
								<p
									className='text-lg font-medium'
									hidden={!((!!header && header.format !== 'TEXT') || fields.body.length > 0)}
								>
									Template details
								</p>
								<Show.ShowIf condition={!!header && header.format !== 'TEXT'}>
									<div className='flex items-center gap-6'>
										<p className='font-medium'>Header Media:- </p>
										<MediaSelectorDialog
											singleSelect
											selectedValue={fields.header?.media_id ? [fields.header?.media_id] : []}
											onConfirm={(media) => form.setValue('header.media_id', media[0])}
											returnType='media_id'
										>
											<Button variant={'outline'}>Select Media</Button>
										</MediaSelectorDialog>

										<span>{fields.header?.media_id ? 'Media selected' : 'No media selected'}</span>
									</div>
								</Show.ShowIf>
								<Show.ShowIf condition={fields.body.length > 0}>
									<Each
										items={fields.body}
										render={(item, index) => (
											<div className='flex flex-col'>
												<FormLabel>Variable value {index + 1}</FormLabel>
												<div className='flex gap-3 flex-col md:flex-row'>
													<FormField
														control={form.control}
														name={`body.${index}.variable_from`}
														render={({ field }) => (
															<FormItem className='space-y-0 flex-1 max-w-xs'>
																<FormControl>
																	<Select onValueChange={field.onChange} defaultValue={field.value}>
																		<FormControl>
																			<SelectTrigger>
																				<SelectValue placeholder='Data From' />
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			<SelectItem value='phonebook_data'>Phonebook Data</SelectItem>
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
															name={`body.${index}.phonebook_data`}
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
															name={`body.${index}.fallback_value`}
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
															name={`body.${index}.custom_text`}
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
								<Show.ShowIf condition={fields.carousel && fields.carousel.length > 0}>
									<Each
										items={fields.carousel}
										render={(card, cardIndex) => (
											<div className='border-2 border-dashed p-2 rounded-xl'>
												<FormLabel className='mb-4'>Card {cardIndex + 1}</FormLabel>
												<div className='my-4'>
													<p className='font-medium'>Header Media:- </p>
													<MediaSelectorDialog
														singleSelect
														selectedValue={
															fields.carousel[cardIndex].header.media_id
																? [fields.carousel[cardIndex].header.media_id]
																: []
														}
														onConfirm={(media) =>
															form.setValue(`carousel.${cardIndex}.header.media_id`, media[0])
														}
														returnType='media_id'
													>
														<Button variant={'outline'}>Select Media</Button>
													</MediaSelectorDialog>

													<span>
														{fields.carousel[cardIndex].header.media_id
															? 'Media selected'
															: 'No media selected'}
													</span>
												</div>
												<FormField
													control={form.control}
													name={`carousel.${cardIndex}`}
													render={({ field }) => (
														<Each
															items={field.value.body}
															render={(body, bodyIndex) => (
																<div className='flex flex-col'>
																	<FormLabel>Variable value {bodyIndex + 1}</FormLabel>
																	<div className='flex gap-3 flex-col md:flex-row'>
																		<FormField
																			control={form.control}
																			name={`carousel.${cardIndex}.body.${bodyIndex}.variable_from`}
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
																			condition={body.variable_from === 'phonebook_data'}
																		>
																			<FormField
																				control={form.control}
																				name={`carousel.${cardIndex}.body.${bodyIndex}.phonebook_data`}
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
																				name={`carousel.${cardIndex}.body.${bodyIndex}.fallback_value`}
																				render={({ field }) => (
																					<FormItem className='space-y-0 flex-1'>
																						<FormControl>
																							<Input placeholder='Fallback Value' {...field} />
																						</FormControl>
																					</FormItem>
																				)}
																			/>
																		</Show.ShowIf>

																		<Show.ShowIf condition={body.variable_from === 'custom_text'}>
																			<FormField
																				control={form.control}
																				name={`carousel.${cardIndex}.body.${bodyIndex}.custom_text`}
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
													)}
												/>
											</div>
										)}
									/>
								</Show.ShowIf>
							</div>
							<div className='w-full lg:w-[30%] flex flex-col justify-start items-start gap-3'>
								<Show.ShowIf condition={!!template}>
									<TemplatePreview components={template?.components ?? []} />
								</Show.ShowIf>

								<Button
									type='submit'
									className='w-[80%] mx-auto'
									disabled={
										!permissions.create ||
										!form.formState.isValid ||
										(fields.recipients_from === 'numbers' && fields.to.length === 0) ||
										(fields.recipients_from === 'tags' && fields.labels.length === 0)
									}
								>
									Schedule
								</Button>
							</div>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}
