'use client';

import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn, countOccurrences } from '@/lib/utils';
import { Template, templateSchema } from '@/schema/template';
import UploadService from '@/services/upload.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleMinus } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { AddQuickReply, PhoneNumberButton, URLButton } from './dialogs';

export default function DataForm({
	onSave,
	defaultValues,
}: {
	onSave: (data: Template) => void;
	defaultValues?: Template;
}) {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const form = useForm<Template>({
		resolver: zodResolver(templateSchema),
		defaultValues: defaultValues ?? {
			name: '',
			category: 'MARKETING',
			components: [],
			allow_category_change: true,
		},
	});

	const components = form.watch('components');
	const headers = components.filter((component) => component.type === 'HEADER');
	const header = headers.length > 0 ? headers[0] : null;
	const bodies = components.filter((component) => component.type === 'BODY');
	const body =
		bodies.length > 0
			? (bodies[0] as {
					type: 'BODY';
					text: '';
					example: {
						body_text: [string[]];
					};
			  })
			: null;
	const footers = components.filter((component) => component.type === 'FOOTER');
	const footer = footers.length > 0 ? (footers[0] as { type: 'FOOTER'; text: '' }) : null;
	const buttons =
		components.filter((component) => component.type === 'BUTTONS')?.[0]?.buttons ?? [];

	const saveTemplate = async (data: Template, handle?: string) => {
		const buttons =
			data.components.filter((component) => component.type === 'BUTTONS')?.[0]?.buttons ?? [];

		if (buttons.length === 0) {
			data.components = data.components.filter((c: { type: string }) => c.type !== 'BUTTONS');
		}

		if (handle) {
			data.components = data.components.map((component) => {
				if (component.type === 'HEADER' && component.format !== 'TEXT') {
					return {
						...component,
						example: {
							header_handle: [handle],
						},
					};
				}
				return component;
			});
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

	const bodyVariables = countOccurrences(body?.text ?? '');

	function addButton(payload: {
		type: 'URL' | 'PHONE_NUMBER' | 'QUICK_REPLY' | 'VOICE_CALL';
		text: string;
		url?: string | undefined;
		phone_number?: string | undefined;
	}) {
		if (buttons.length >= 3) return;
		const _buttons = components.find((c: any) => c.type === 'BUTTONS');
		if (_buttons) {
			form.setValue(
				'components',
				components.map((component) => {
					if (component.type === 'BUTTONS') {
						return {
							...component,
							buttons: [...component.buttons, payload],
						};
					}
					return component;
				})
			);
		} else {
			form.setValue('components', [
				...components,
				{
					type: 'BUTTONS',
					buttons: [payload],
				},
			]);
		}
	}

	function removeButtonComponent(index: number) {
		form.setValue(
			'components',
			components.map((component) => {
				if (component.type === 'BUTTONS') {
					return {
						...component,
						buttons: component.buttons.filter((_, i) => i !== index),
					};
				}
				return component;
			})
		);
	}

	function addQuickReply(text: string) {
		addButton({ type: 'QUICK_REPLY', text });
	}

	function addPhoneNumberButton(payload: { text: string; phone_number: string }) {
		addButton({ type: 'PHONE_NUMBER', ...payload });
	}

	function addURLButton(payload: { text: string; url: string }) {
		addButton({ type: 'URL', ...payload });
	}

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

						<div>
							<FormField
								control={form.control}
								name='category'
								render={({ field }) => (
									<FormItem className='space-y-0 flex-1'>
										<FormLabel className='text-primary'>
											Template Type<span className='ml-[0.2rem] text-red-800'>*</span>
										</FormLabel>
										<FormControl>
											<ToggleGroup
												className='justify-start'
												type='single'
												value={field.value}
												onValueChange={field.onChange}
											>
												<ToggleGroupItem value='MARKETING' aria-label='Marketing'>
													Marketing
												</ToggleGroupItem>
												<ToggleGroupItem value='UTILITY' aria-label='Utility'>
													Utility
												</ToggleGroupItem>
											</ToggleGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Separator />

						<div>
							<FormItem className='space-y-0 flex-1'>
								<FormLabel className='text-primary'>
									Template Header<span className='ml-[0.2rem] text-red-800'>*</span>
								</FormLabel>
								<FormControl>
									<ToggleGroup
										className='justify-start'
										type='single'
										value={header ? header.format : 'none'}
										onValueChange={(format: 'none' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT') => {
											if (fileInputRef.current) {
												fileInputRef.current.value = '';
											}
											if (!header) {
												if (format === 'none') return;
												form.setValue('components', [...components, { type: 'HEADER', format }]);
											} else {
												if (format === 'none') {
													form.setValue(
														'components',
														components.filter((component) => component.type !== 'HEADER')
													);
												} else {
													form.setValue(
														'components',
														components.map((component) => {
															if (component.type === 'HEADER') {
																return { ...component, format };
															}
															return component;
														})
													);
												}
											}
										}}
									>
										<ToggleGroupItem value='none' aria-label='None'>
											None
										</ToggleGroupItem>
										<ToggleGroupItem value='TEXT' aria-label='Text'>
											Text
										</ToggleGroupItem>
										<ToggleGroupItem value='IMAGE' aria-label='Image'>
											Image
										</ToggleGroupItem>
										<ToggleGroupItem value='VIDEO' aria-label='Video'>
											Video
										</ToggleGroupItem>
										<ToggleGroupItem value='DOCUMENT' aria-label='Document'>
											Document
										</ToggleGroupItem>
									</ToggleGroup>
								</FormControl>
							</FormItem>

							<Show.ShowIf condition={!!header && header.format === 'TEXT'}>
								<FormItem className='space-y-0 flex-1'>
									<FormLabel className='text-primary'>Header Text</FormLabel>
									<FormControl>
										<Input
											placeholder='Header Text'
											value={header?.text ?? ''}
											onChange={(e) => {
												form.setValue(
													'components',
													components.map((component) => {
														if (component.type === 'HEADER') {
															return { ...component, text: e.target.value };
														}
														return component;
													})
												);
											}}
										/>
									</FormControl>
								</FormItem>
							</Show.ShowIf>
							<Show.ShowIf condition={!!header && header.format !== 'TEXT'}>
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
						</div>

						<Separator />

						<div className='flex flex-col gap-3'>
							<FormItem className='space-y-0 flex-1'>
								<FormLabel className='text-primary'>
									Template Body<span className='ml-[0.2rem] text-red-800'>*</span>
								</FormLabel>
								<FormDescription className='text-xs pb-2'>
									{`Use dynamic variable like {{1}} {{2}} and so on`}. (Limit{' '}
									{body?.text?.length ?? 0} / 2000)
								</FormDescription>
								<FormControl>
									<Textarea
										placeholder='Body Text'
										value={body?.text ?? ''}
										className='h-[300px]'
										onChange={(e) => {
											if (e.target.value.length > 2000) return;
											if (!body) {
												form.setValue('components', [
													...components,
													{ type: 'BODY', text: e.target.value },
												]);
											} else {
												form.setValue(
													'components',
													components.map((component) => {
														if (component.type === 'BODY') {
															return {
																...component,
																text: e.target.value,
															};
														}
														return component;
													})
												);
											}
										}}
									/>
								</FormControl>
							</FormItem>

							<Show.ShowIf condition={bodyVariables > 0}>
								<FormItem className='space-y-0 flex-1'>
									<FormLabel className='text-primary'>
										Example Values (Total:- {bodyVariables})
										<span className='ml-[0.2rem] text-red-800'>*</span>
									</FormLabel>
									<FormDescription className='text-xs'>
										eg. Dave; John; 1234567890 (Semi-colon separated) (
										{(body?.example?.body_text?.[0] ?? []).length} of {bodyVariables} provided)
									</FormDescription>
									<FormControl>
										<Input
											placeholder='Example Values'
											isInvalid={bodyVariables !== (body?.example?.body_text?.[0] ?? []).length}
											value={(body?.example?.body_text?.[0] ?? []).join('; ')}
											onChange={(e) => {
												form.setValue(
													'components',
													components.map((component) => {
														if (component.type === 'BODY') {
															return {
																...component,
																example: {
																	body_text: [e.target.value.split(';').map((t) => t.trim())],
																},
															};
														}
														return component;
													})
												);
											}}
										/>
									</FormControl>
								</FormItem>
							</Show.ShowIf>
						</div>

						<Separator />

						<div className='flex flex-col gap-3'>
							<FormItem className='space-y-0 flex-1'>
								<FormLabel className='text-primary'>Footer Text (Optional)</FormLabel>
								<FormControl>
									<Input
										placeholder='Footer Text'
										value={footer?.text ?? ''}
										onChange={(e) => {
											if (!footer) {
												form.setValue('components', [
													...components,
													{ type: 'FOOTER', text: e.target.value },
												]);
											} else {
												form.setValue(
													'components',
													components.map((component) => {
														if (component.type === 'FOOTER') {
															return { ...component, text: e.target.value };
														}
														return component;
													})
												);
											}
										}}
									/>
								</FormControl>
							</FormItem>
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
									buttons.length > 0 ? 'inline-flex' : 'hidden'
								)}
							>
								<Each
									items={buttons}
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
								<AddQuickReply disabled={buttons.length >= 3} onSubmit={addQuickReply} />
								<PhoneNumberButton disabled={buttons.length >= 3} onSubmit={addPhoneNumberButton} />
								<URLButton disabled={buttons.length >= 3} onSubmit={addURLButton} />
							</div>
						</div>
					</div>
					<div className='w-full lg:w-[30%] flex flex-col-reverse lg:flex-col justify-start items-start gap-3'>
						<TemplatePreview components={components} />
						<Button type='submit' className='w-[80%] mx-auto'>
							Save
						</Button>
					</div>
				</div>

				<div className='flex justify-end'></div>
			</form>
		</Form>
	);
}
