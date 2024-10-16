'use client';
import Show from '@/components/containers/show';
import { useFields } from '@/components/context/tags';
import { usePermissions } from '@/components/context/user-details';
import NumberInputDialog from '@/components/elements/dialogs/numberInput';
import TemplateDialog from '@/components/elements/dialogs/template-data-input';
import TagsSelector from '@/components/elements/popover/tags';
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
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import api from '@/lib/api';
import { getDateObject, getFormattedDate } from '@/lib/utils';
import { Broadcast, broadcastSchema } from '@/schema/broadcastSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { QuickTemplateMessageProps } from '../../conversations/_components/message-input';

export default function BroadcastPage() {
	const permissions = usePermissions().broadcast;
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

	const validationResult = broadcastSchema.safeParse(fields);
	if (!validationResult.success) {
		console.error(validationResult.error.errors);
	}

	const handleTemplateSave = (template: QuickTemplateMessageProps) => {
		form.setValue('template_id', template.template_id);
		form.setValue('template_name', template.template_name);
		form.setValue('body', template.body);
		form.setValue('carousel', template.carousel);
		form.setValue('buttons', template.buttons);
		form.setValue('header', template.header);
	};

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
			...(data.body && { body: data.body }),
			...(data.carousel && { carousel: data.carousel }),
			...(data.buttons && { buttons: data.buttons }),
			...(data.header && data.header.type !== 'NONE' && { header: data.header }),
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

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Campaign</h2>
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
											Campaign Name<span className='ml-[0.2rem] text-red-800'>*</span>
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
									<TemplateDialog
										template={{
											template_id: fields.template_id,
											template_name: fields.template_name,
											buttons: fields.buttons,
											carousel: fields.carousel,
											header: fields.header,
											body: fields.body,
										}}
										onConfirm={(details) => handleTemplateSave(details)}
									>
										<Button variant={'outline'} className='w-full'>
											{fields.template_name ? fields.template_name : 'Select Template'}
										</Button>
									</TemplateDialog>
								</FormControl>
								<FormMessage />
							</FormItem>
							<FormField
								control={form.control}
								name='broadcast_options.broadcast_type'
								render={({ field }) => (
									<FormItem className='space-y-0 flex-1 max-w-[15rem]'>
										<FormLabel className='text-primary'>
											Campaign Type<span className='ml-[0.2rem] text-red-800'>*</span>
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
					</div>
					<Button className='w-[150px]'>Start</Button>
				</form>
			</Form>
		</div>
	);
}
