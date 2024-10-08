'use client';
import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { useFields } from '@/components/context/tags';
import { useTemplates } from '@/components/context/templates';
import MediaSelectorDialog from '@/components/elements/dialogs/media-selector';
import TagsSelector from '@/components/elements/popover/tags';
import TemplatePreview from '@/components/elements/template-preview';
import TemplatesSelector from '@/components/elements/templetes-selector';
import { Button } from '@/components/ui/button';
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
import { countOccurrences } from '@/lib/utils';
import { Recurring, recurringSchema } from '@/schema/broadcastSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const _defaultValues = {
	name: '',
	description: '',
	template_id: '',
	template_name: '',
	labels: [],
	wish_from: 'birthday',
	template_body: [],
	delay: 0,
	startTime: '10:00',
	endTime: '18:00',
} as Recurring;

export default function DataForm({
	defaultValues = _defaultValues,
	onSubmit,
}: {
	defaultValues?: Recurring;
	onSubmit: (data: Recurring) => void;
}) {
	const templates = useTemplates();
	let phonebook_fields = useFields();
	phonebook_fields = phonebook_fields.filter((field) => field.value !== 'all');

	const form = useForm<Recurring>({
		resolver: zodResolver(recurringSchema),
		defaultValues: defaultValues || _defaultValues,
	});

	const fields = form.watch();
	const template = templates.find((t) => t.id === fields.template_id);
	const header = template?.components.find((component) => component.type === 'HEADER');

	function handleSave(data: Recurring) {
		onSubmit(data);
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
			form.setValue('template_header', {
				type: header.format,
				media_id: '',
			});
		}
		form.setValue(
			'template_body',
			Array.from({ length: variables }).map((_, index) => ({
				custom_text: '',
				phonebook_data: '',
				variable_from: 'custom_text' as 'custom_text' | 'phonebook_data',
				fallback_value: '',
			}))
		);
	}

	const isValid = recurringSchema.safeParse(form.getValues()).success;
	return (
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
							name='wish_from'
							render={({ field }) => (
								<FormItem className='space-y-0 flex-1 max-w-[15rem]'>
									<FormLabel className='text-primary'>
										Wish Type<span className='ml-[0.2rem] text-red-800'>*</span>
									</FormLabel>
									<FormControl>
										<ToggleGroup
											className='justify-start'
											type='single'
											value={field.value}
											onValueChange={field.onChange}
										>
											<ToggleGroupItem value='birthday' aria-label='birthday'>
												Birthday
											</ToggleGroupItem>
											<ToggleGroupItem value='anniversary' aria-label='anniversary'>
												Anniversary
											</ToggleGroupItem>
										</ToggleGroup>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className='flex-1 max-w-[15rem] inline-flex items-end'>
							<TagsSelector
								onChange={(tags) => {
									form.setValue('labels', tags);
								}}
							>
								<Button variant={'outline'} className='w-full'>
									Select Tags<span className='mr-1 text-red-800'>*</span>:{' '}
									{fields.labels.length ? `(${fields.labels.length})` : '(0)'}
								</Button>
							</TagsSelector>
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
						<div className='flex-1'>
							<h3 className='font-medium text-lg'>Scheduling Options</h3>
							<div className='flex gap-x-3 gap-y-2 flex-wrap'>
								<FormField
									control={form.control}
									name='delay'
									render={({ field }) => (
										<FormItem className='space-y-0 flex-1 max-w-xs'>
											<FormLabel className='text-primary'>
												Delay (in Days)<span className='ml-[0.2rem] text-red-800'>*</span>
											</FormLabel>
											<FormControl>
												<Input
													value={field.value}
													onChange={(e) => field.onChange(Number(e.target.value))}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='startTime'
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
									name='endTime'
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
							</div>
						</div>
					</div>

					<Separator />
					<div className='flex flex-col lg:flex-row w-full justify-between gap-3'>
						<div className='flex flex-col w-full lg:w-[70%] space-y-2'>
							<p
								className='text-2xl font-medium'
								hidden={
									!((!!header && header.format !== 'TEXT') || fields.template_body.length > 0)
								}
							>
								Template details
							</p>
							<Show.ShowIf condition={!!header && header.format !== 'TEXT'}>
								<div className='flex items-center gap-6'>
									<p className='font-medium'>Header Media:- </p>
									<MediaSelectorDialog
										singleSelect
										selectedValue={
											fields.template_header?.media_id ? [fields.template_header?.media_id] : []
										}
										onConfirm={(media) => form.setValue('template_header.media_id', media[0])}
										returnType='media_id'
									>
										<Button variant={'outline'}>Select Media</Button>
									</MediaSelectorDialog>

									<span>
										{fields.template_header?.media_id ? 'Media selected' : 'No media selected'}
									</span>
								</div>
							</Show.ShowIf>
							<Show.ShowIf condition={fields.template_body.length > 0}>
								<Each
									items={fields.template_body}
									render={(item, index) => (
										<div className='flex flex-col'>
											<FormLabel>Variable value {index + 1}</FormLabel>
											<div className='flex gap-3 flex-col md:flex-row'>
												<FormField
													control={form.control}
													name={`template_body.${index}.variable_from`}
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
														name={`template_body.${index}.phonebook_data`}
														render={({ field }) => (
															<FormItem className='space-y-0 flex-1 max-w-xs'>
																<FormControl>
																	<Select onValueChange={field.onChange} defaultValue={field.value}>
																		<FormControl>
																			<SelectTrigger>
																				<SelectValue placeholder='Select Fields' />
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			<Each
																				items={phonebook_fields}
																				render={(field) => (
																					<SelectItem value={field.value}>{field.label}</SelectItem>
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

							<Button type='submit' className='w-[80%] mx-auto' disabled={!isValid}>
								Schedule
							</Button>
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
}
