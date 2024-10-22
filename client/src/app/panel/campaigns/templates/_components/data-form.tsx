'use client';

import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import DeleteDialog from '@/components/elements/dialogs/delete';
import TemplatePreview from '@/components/elements/template-preview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Carousel, Template, templateSchema } from '@/schema/template';
import UploadService from '@/services/upload.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleMinus, Trash } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import BodyWithVariables from './body-with-variables';
import { AddQuickReply, CarouselTemplateDialog, PhoneNumberButton, URLButton } from './dialogs';

export default function DataForm({
	onSave,
	defaultValues,
	onDelete = () => {},
}: {
	onSave: (data: Template) => void;
	onDelete?: () => void;
	defaultValues?: Template;
}) {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const form = useForm<Template>({
		resolver: zodResolver(templateSchema),
		defaultValues: defaultValues ?? {
			name: '',
			category: 'MARKETING',
			allow_category_change: true,
			header: {
				format: 'TEXT',
				text: '',
				example: [],
			},
			body: {
				text: '',
				example: [],
			},
			footer: {
				text: '',
			},
			buttons: [],
		},
	});

	const header = form.watch('header');
	const body = form.watch('body');
	const buttons = form.watch('buttons');
	const carousel = form.watch('carousel');

	const saveTemplate = async (data: Template, handle?: string) => {
		if (data.buttons) {
			data.buttons.some((button, buttonIndex) => {
				if (button.type === 'URL') {
					button.example.some((variable, variableIndex) => {
						if (variable === '') {
							return toast.error(
								`Please fill the example value of button ${buttonIndex + 1} variable ${
									variableIndex + 1
								}`
							);
						}
					});
				}
			});
		}
		if (data.buttons?.length === 0) {
			delete data.buttons;
		}
		if (data.header?.format === 'NONE') {
			delete data.header;
		}

		if (handle) {
			data.header = {
				format: data.header?.format as 'IMAGE' | 'VIDEO' | 'DOCUMENT',
				example: handle,
			};
		}
		onSave(data);
	};

	function handleSave(data: Template) {
		if (file) {
			toast.promise(UploadService.generateMetaHandle(file), {
				success: (handle) => {
					saveTemplate(data, handle);
					return 'File uploaded';
				},
				error: 'Failed to upload file',
				loading: 'Uploading file',
			});
		} else {
			saveTemplate(data);
		}
	}

	function addButton(
		payload:
			| {
					type: 'QUICK_REPLY';
					text: string;
			  }
			| {
					type: 'URL';
					text: string;
					example: string[];
					url: string;
			  }
			| {
					type: 'PHONE_NUMBER';
					text: string;
					phone_number: string;
			  }
			| {
					type: 'FLOW';
					text: string;
					flow_id: string;
					flow_action: 'navigate' | 'data_exchange';
					navigate_screen: string;
			  }
	) {
		if ((buttons ?? []).length >= 3) return;
		form.setValue('buttons', [...(buttons ?? []), payload]);
	}

	function removeButtonComponent(index: number) {
		form.setValue(
			'buttons',
			(buttons ?? []).filter((_, i) => i !== index)
		);
	}

	function addQuickReply(text: string) {
		addButton({ type: 'QUICK_REPLY', text });
	}

	function addPhoneNumberButton(payload: { text: string; phone_number: string }) {
		addButton({ type: 'PHONE_NUMBER', ...payload });
	}

	function addURLButton(payload: { text: string; url: string; example: string[] }) {
		addButton({ type: 'URL', ...payload });
	}

	function handleAddCarousels(carousels: Carousel) {
		form.setValue('carousel', carousels);
	}

	const hasError = templateSchema.safeParse(form.getValues()).success === false;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSave)} className='w-full space-y-2'>
				<div className='flex flex-col lg:flex-row w-full justify-between gap-3'>
					<div className='flex flex-col w-full lg:w-[70%] space-y-2'>
						<div>
							<FormField
								rules={{ pattern: /^[a-z0-9_]+$/ }}
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem className='space-y-0 flex-1'>
										<FormLabel className='text-primary'>
											Template Name<span className='ml-[0.2rem] text-red-800'>*</span>
										</FormLabel>
										<FormControl>
											<Input placeholder='lowercase_without_any_spaces' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Separator />

						<div className='inline-flex justify-between w-full items-end'>
							<div className='inline-flex gap-4'>
								<FormField
									control={form.control}
									name='category'
									render={({ field }) => (
										<FormItem className='space-y-0 flex-1'>
											<FormLabel className='text-primary'>
												Template Type<span className='ml-[0.2rem] text-red-800'>*</span>
											</FormLabel>
											<FormControl>
												<Select value={field.value} onValueChange={field.onChange}>
													<SelectTrigger className='w-[180px]'>
														<SelectValue placeholder='Select template type' />
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															<Each
																items={['MARKETING', 'UTILITY']}
																render={(type) => <SelectItem value={type}>{type}</SelectItem>}
															/>
														</SelectGroup>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={'header'}
									render={({ field }) => (
										<Show.ShowIf condition={!!form.getValues('header')}>
											<FormItem className='space-y-0 flex-1'>
												<FormLabel className='text-primary'>
													Template Header Type<span className='ml-[0.2rem] text-red-800'>*</span>
												</FormLabel>
												<FormControl>
													<Select
														value={field.value?.format}
														onValueChange={(format) => {
															if (format === 'TEXT') {
																form.setValue('header', {
																	format: 'TEXT',
																	text: '',
																	example: [],
																});
															} else if (
																format === 'IMAGE' ||
																format === 'VIDEO' ||
																format === 'DOCUMENT'
															) {
																form.setValue('header', {
																	format,
																	example: '',
																});
															} else {
																form.setValue('header', {
																	format: 'NONE',
																});
															}
														}}
													>
														<SelectTrigger className='w-[180px]'>
															<SelectValue placeholder='Select header type' />
														</SelectTrigger>
														<SelectContent>
															<SelectGroup>
																<SelectItem value='NONE'>None</SelectItem>
																<SelectItem value='TEXT'>Text</SelectItem>
																<SelectItem value='IMAGE'>Image</SelectItem>
																<SelectItem value='VIDEO'>Video</SelectItem>
																<SelectItem value='DOCUMENT'>Document</SelectItem>
															</SelectGroup>
														</SelectContent>
													</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										</Show.ShowIf>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name='carousel'
								render={({ field }) => (
									<FormItem className='space-y-0 items-center justify-center inline-flex gap-3'>
										<FormLabel className='text-primary'>Carousel Template</FormLabel>
										<FormControl>
											<Switch
												checked={!!form.watch('carousel')}
												onCheckedChange={(val) => {
													if (val) {
														form.setValue('header', undefined);
														form.setValue('buttons', undefined);
														form.setValue('footer', undefined);
														form.setValue('carousel', { cards: [] });
													} else {
														form.setValue('header', {
															format: 'TEXT',
															text: '',
															example: [],
														});
														form.setValue('footer', { text: '' });
														form.setValue('buttons', []);
														form.setValue('carousel', undefined);
													}
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Separator />

						<Show.ShowIf condition={!!header}>
							<Show.ShowIf condition={!!header && header?.format === 'TEXT'}>
								<BodyWithVariables
									label='Header Text'
									limit='60'
									placeholder='Header Text'
									text={header?.format === 'TEXT' ? header?.text : ''}
									text_variables={header?.format === 'TEXT' ? header.example : []}
									headerTextChange={(text, example) => {
										form.setValue('header.text', text);
										form.setValue('header.example', example);
									}}
								/>
							</Show.ShowIf>
							<Show.ShowIf
								condition={!!header && header.format !== 'TEXT' && header.format !== 'NONE'}
							>
								<FormItem className='space-y-0 flex-1'>
									<FormLabel className='text-primary'>Header Media</FormLabel>
									<FormControl>
										<Input
											type='file'
											ref={fileInputRef}
											accept={
												header?.format === 'IMAGE'
													? 'image/*'
													: header?.format === 'VIDEO'
													? 'video/*'
													: header?.format === 'DOCUMENT'
													? 'application/pdf'
													: ''
											}
											onChange={(e) => setFile(e.target.files?.[0] ?? null)}
										/>
									</FormControl>
								</FormItem>
							</Show.ShowIf>
						</Show.ShowIf>

						<Separator />

						<div className='flex flex-col gap-3'>
							<BodyWithVariables
								label='Body Text'
								limit='1024'
								placeholder='Body Text'
								text={body?.text ?? ''}
								text_variables={body?.example ?? []}
								headerTextChange={(text, example) => {
									form.setValue('body.text', text);
									form.setValue('body.example', example);
								}}
							/>
						</div>

						<Separator />

						<Show>
							<Show.When condition={!!form.getValues('carousel')}>
								<div className={'flex flex-col gap-3'}>
									<div className='flex flex-col'>
										<CarouselTemplateDialog
											carousel={carousel}
											onSubmit={(carousels) => handleAddCarousels(carousels)}
										>
											<Button>Customize Carousel Cards</Button>
										</CarouselTemplateDialog>
									</div>
								</div>
							</Show.When>
							<Show.Else>
								<div className={'flex flex-col gap-3'}>
									<FormField
										control={form.control}
										name='footer.text'
										render={({ field }) => (
											<FormItem className='space-y-0 flex-1'>
												<FormLabel className='text-primary'>Footer Text (Optional)</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
								<Separator />

								<div className='flex flex-col gap-3'>
									<FormLabel className='text-primary'>Buttons</FormLabel>
									<FormDescription className='text-xs pb-2'>
										Insert buttons so your customers can take action and engage with your message!
									</FormDescription>

									<div
										className={cn(
											' gap-3 border border-dashed p-3',
											(buttons ?? []).length > 0 ? 'inline-flex' : 'hidden'
										)}
									>
										<Each
											items={buttons ?? []}
											render={(button: { type: string }, index) => (
												<Badge>
													<span className='text-sm font-medium'>
														{button.type.replaceAll('_', ' ')}
													</span>
													<CircleMinus
														className='w-3 h-3 ml-2 cursor-pointer'
														onClick={() => removeButtonComponent(index)}
													/>
												</Badge>
											)}
										/>
									</div>

									<div className='flex flex-col md:flex-row gap-3'>
										<AddQuickReply
											disabled={(buttons ?? []).length >= 3}
											onSubmit={addQuickReply}
										/>
										<PhoneNumberButton
											disabled={(buttons ?? []).length >= 3}
											onSubmit={addPhoneNumberButton}
										/>
										<URLButton disabled={(buttons ?? []).length >= 3} onSubmit={addURLButton} />
									</div>
								</div>
							</Show.Else>
						</Show>
					</div>
					<div className='w-full lg:w-[30%] flex flex-col-reverse lg:flex-col justify-start items-start gap-3'>
						<TemplatePreview template={form.watch()} />
						<div className='w-[90%] mx-auto'>
							<div className='w-full flex gap-3'>
								<Button type='submit' className='w-full' disabled={hasError}>
									Save
								</Button>
								<Show.ShowIf condition={!!defaultValues}>
									<DeleteDialog onDelete={onDelete} action='Template'>
										<Button variant={'destructive'} size={'icon'}>
											<Trash className='w-4 h-4' />
										</Button>
									</DeleteDialog>
								</Show.ShowIf>
							</div>
						</div>
					</div>
				</div>

				<div className='flex justify-end'></div>
			</form>
		</Form>
	);
}
