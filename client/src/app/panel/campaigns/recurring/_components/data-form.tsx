'use client';
import { QuickTemplateMessageProps } from '@/app/panel/conversations/_components/message-input';
import { useFields } from '@/components/context/tags';
import TemplateDialog from '@/components/elements/dialogs/template-data-selector';
import TagsSelector from '@/components/elements/popover/tags';
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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
	delay: 0,
	startTime: '10:00',
	endTime: '18:00',
	body: [],
} as Recurring;

export default function DataForm({
	defaultValues = _defaultValues,
	onSubmit,
}: {
	defaultValues?: Recurring;
	onSubmit: (data: Recurring) => void;
}) {
	let phonebook_fields = useFields();
	phonebook_fields = phonebook_fields.filter((field) => field.value !== 'all');

	const form = useForm<Recurring>({
		resolver: zodResolver(recurringSchema),
		defaultValues: defaultValues || _defaultValues,
	});

	const fields = form.watch();

	function handleSave(data: Recurring) {
		onSubmit(data);
	}

	function handleTemplateSave(template: QuickTemplateMessageProps) {
		form.setValue('template_id', template.template_id);
		form.setValue('template_name', template.template_name);
		form.setValue('body', template.body);
		form.setValue('carousel', template.carousel);
		form.setValue('buttons', template.buttons);
		form.setValue('header', template.header);
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
										body: fields.body,
										template_id: fields.template_id,
										template_name: fields.template_name,
										buttons: fields.buttons,
										carousel: fields.carousel,
										header: fields.header,
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
					<Button className='w-[150px]'>Save</Button>
				</div>
			</form>
		</Form>
	);
}
