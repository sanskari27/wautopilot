'use client';
import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from '@/components/ui/dialog';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn, countOccurrences } from '@/lib/utils';
import { Carousel, carouselSchema } from '@/schema/template';
import UploadService from '@/services/upload.service';
import { zodResolver } from '@hookform/resolvers/zod';
import {} from '@radix-ui/react-alert-dialog';
import { CircleMinus, Link, MessageCircleReply, PhoneCall, Trash } from 'lucide-react';
import React, { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export function AddQuickReply({
	onSubmit,
	disabled,
}: {
	disabled?: boolean;
	onSubmit: (text: string) => void;
}) {
	const [text, setText] = useState('');

	function submit() {
		onSubmit(text);
		setText('');
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild disabled={disabled}>
				<Button size={'sm'} variant={'outline'} className='border-primary text-primary'>
					<MessageCircleReply className='w-4 h-4 mr-2' />
					Add Quick Reply
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-xl'>
				<AlertDialogHeader>
					<AlertDialogTitle>Quick Reply Details</AlertDialogTitle>
				</AlertDialogHeader>
				<div className='grid gap-4'>
					<div className='grid gap-2'>
						<Label className='text-primary' htmlFor='name'>
							Text ({text.length} / 25)
						</Label>
						<Textarea
							id='name'
							className='h-48'
							value={text}
							placeholder='enter preferred text'
							onChange={(e) => setText(e.target.value.substring(0, 25))}
						/>
					</div>
				</div>
				<AlertDialogFooter className='mt-2'>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={submit}>Save</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function PhoneNumberButton({
	onSubmit,
	disabled,
}: {
	disabled?: boolean;
	onSubmit: (details: { phone_number: string; text: string }) => void;
}) {
	const [text, setText] = useState('');
	const [phone_number, setPhoneNumber] = useState('');

	function submit() {
		onSubmit({ text, phone_number });
		setText('');
		setPhoneNumber('');
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild disabled={disabled}>
				<Button size={'sm'} variant={'outline'} className='border-primary text-primary'>
					<PhoneCall className='w-4 h-4 mr-2' />
					Phone Number
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-xl'>
				<AlertDialogHeader>
					<AlertDialogTitle>Phone Number Details</AlertDialogTitle>
				</AlertDialogHeader>
				<div className='grid gap-3'>
					<div className='grid gap-2'>
						<Label className='text-primary' htmlFor='name'>
							Text to be displayed
						</Label>
						<Input
							id='name'
							value={text}
							placeholder='enter preferred text'
							onChange={(e) => setText(e.target.value)}
						/>
					</div>
					<div className='grid gap-2'>
						<Label className='text-primary' htmlFor='name'>
							Phone Number (with country code)
						</Label>
						<Input
							id='name'
							value={phone_number}
							placeholder='9199XXXXXX89'
							onChange={(e) => setPhoneNumber(e.target.value)}
						/>
					</div>
				</div>
				<AlertDialogFooter className='mt-2'>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={submit}>Save</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function URLButton({
	onSubmit,
	disabled,
}: {
	disabled?: boolean;
	onSubmit: (details: { url: string; text: string }) => void;
}) {
	const [text, setText] = useState('');
	const [link, setLink] = useState('');

	function submit() {
		onSubmit({ text, url: link });
		setText('');
		setLink('');
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild disabled={disabled}>
				<Button size={'sm'} variant={'outline'} className='border-primary text-primary'>
					<Link className='w-4 h-4 mr-2' />
					URL
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-xl'>
				<AlertDialogHeader>
					<AlertDialogTitle>URL Details</AlertDialogTitle>
				</AlertDialogHeader>
				<div className='grid gap-3'>
					<div className='grid gap-2'>
						<Label className='text-primary' htmlFor='name'>
							Text to be displayed
						</Label>
						<Input
							id='name'
							value={text}
							placeholder='enter preferred text'
							onChange={(e) => setText(e.target.value)}
						/>
					</div>
					<div className='grid gap-2'>
						<Label className='text-primary' htmlFor='link'>
							Link
						</Label>
						<Input
							id='link'
							value={link}
							placeholder='enter your link'
							onChange={(e) => setLink(e.target.value)}
						/>
					</div>
				</div>
				<AlertDialogFooter className='mt-2'>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={submit}>Save</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function CarouselTemplateDialog({
	children,
	carousel,
	onSubmit,
}: {
	children: ReactNode;
	carousel: Carousel;
	onSubmit: (data: Carousel) => void;
}) {
	const buttonRef = React.useRef<HTMLButtonElement>(null);

	const [file, setFile] = React.useState<
		{
			index: number;
			file: File | null;
		}[]
	>(Array.from({ length: carousel.cards.length }).map((_, index) => ({ index, file: null })));

	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const form = useForm<Carousel>({
		resolver: zodResolver(carouselSchema),
		defaultValues: carousel,
	});

	function handleBodyTextChange(index: number, componentIndex: number, value: string) {
		if (value.length > 160) return;
		form.setValue(`cards.${index}.components.${componentIndex}.text`, value);

		const body_variables = countOccurrences(value);

		if (body_variables === 0) {
			return form.setValue(`cards.${index}.components.${componentIndex}.example`, undefined);
		} else {
			form.setValue(`cards.${index}.components.${componentIndex}.example`, {
				body_text: [Array.from({ length: body_variables }).map(() => '')],
			});
		}
	}

	const addBlankCard = () => {
		if (form.getValues('cards').length >= 10) {
			return;
		}
		form.setValue('cards', [
			...form.getValues('cards'),
			{
				components: [
					{
						type: 'HEADER',
						format: 'IMAGE',
						example: {
							header_handle: [''],
						},
					},
					{
						type: 'BODY',
						text: '',
					},
					{
						type: 'BUTTONS',
						buttons: [],
					},
				],
			},
		]);
		setFile((prev) => {
			return [...prev, { index: form.getValues('cards').length - 1, file: null }];
		});
	};

	function removeButtonComponent(index: number, componentIndex: number, buttonIndex: number) {
		const buttons = form.getValues(`cards.${index}.components.${componentIndex}.buttons`);
		buttons.splice(buttonIndex, 1);
		form.setValue(`cards.${index}.components.${componentIndex}.buttons`, buttons);
	}

	function addQuickReply(index: number, componentIndex: number, text: string) {
		const buttons = form.getValues(`cards.${index}.components.${componentIndex}.buttons`);
		buttons.push({ type: 'QUICK_REPLY', text });
		form.setValue(`cards.${index}.components.${componentIndex}.buttons`, buttons);
	}

	function addPhoneNumberButton(
		index: number,
		componentIndex: number,
		text: {
			phone_number: string;
			text: string;
		}
	) {
		const buttons = form.getValues(`cards.${index}.components.${componentIndex}.buttons`);
		buttons.push({ type: 'PHONE_NUMBER', text: text.text, phone_number: text.phone_number });
		form.setValue(`cards.${index}.components.${componentIndex}.buttons`, buttons);
	}

	function addURLButton(
		index: number,
		componentIndex: number,
		text: {
			url: string;
			text: string;
		}
	) {
		const buttons = form.getValues(`cards.${index}.components.${componentIndex}.buttons`);
		buttons.push({ type: 'URL', text: text.text, url: text.url });
		form.setValue(`cards.${index}.components.${componentIndex}.buttons`, buttons);
	}

	const handleDeleteCard = (index: number) => {
		const cards = form.getValues('cards');
		cards.splice(index, 1);
		form.setValue('cards', cards);
		setFile((prev) => {
			const newFiles = [...prev];
			newFiles.splice(index, 1);
			return newFiles;
		});
	};

	const handleSave = (data: Carousel) => {
		if (data.cards.length < 2) {
			return toast.error('At least 2 cards are required');
		}
		if (data.cards.length > 10) {
			return toast.error('Maximum 10 cards are allowed');
		}
		const buttonLength = new Set();
		const buttonType = new Set();
		data.cards.forEach((card, index) => {
			return card.components.forEach((component) => {
				if (component.type === 'BODY') {
					if (component.text.length === 0) {
						return toast.error(`Card ${index + 1} has empty body`);
					}
					if (
						countOccurrences(component.text) < 0 &&
						component.example?.body_text?.[0].length === 0
					) {
						return toast.error(`Card ${index + 1} has no variables`);
					}
				}
				if (component.type === 'BUTTONS') {
					buttonLength.add(component.buttons.length);
					component.buttons.forEach((button) => {
						buttonType.add(button.type);
					});
				}
			});
		});
		if (buttonLength.size > 1) {
			return toast.error('All cards should have same number of buttons');
		}
		if (buttonLength.size === 1 && buttonLength.values().next().value === 0) {
			return toast.error('At least 1 button is required');
		}
		if (buttonLength.size === 1 && buttonLength.values().next().value > 2) {
			return toast.error('Maximum 2 buttons are allowed');
		}
		if (buttonType.size > 1) {
			return toast.error('All buttons should be of same type');
		}
		for (const ele of file) {
			if (ele.file === null) {
				return toast.error('Please select media for all cards');
			}
		}
		handleFileUpload(data);
	};

	const handleFileInput = (index: number, e: File | null) => {
		setFile((prev) => {
			const newFiles = [...prev];
			newFiles[index] = { index, file: e };
			return newFiles;
		});
	};

	const handleFileUpload = async (data: Carousel) => {
		const promises = file.map((ele) => {
			return UploadService.generateMetaHandle(ele.file as File);
		});

		toast.promise(Promise.all(promises), {
			loading: 'Uploading Media',
			success: (res) => {
				handleSubmit(data, res);
				return 'Media uploaded successfully';
			},
			error: 'Failed to upload media',
		});
	};

	const handleSubmit = (data: Carousel, handle: string[]) => {
		data = {
			...data,
			cards: data.cards.map((card, index) => {
				return {
					...card,
					components: card.components.map((component) => {
						if (component.type === 'HEADER') {
							return {
								...component,
								example: {
									header_handle: [handle[index]],
								},
							};
						}
						return component;
					}),
				};
			}),
		};
		onSubmit(data);
		buttonRef.current?.click();
	};

	return (
		<Dialog>
			<DialogTrigger ref={buttonRef} asChild>
				{children}
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-xl lg:max-w-3xl p-0'>
				<DialogHeader className='p-4'>Carousel Template</DialogHeader>
				<Button className='mx-4' onClick={addBlankCard}>
					Add Card
				</Button>
				<ScrollArea className='max-h-[60vh] min-h-[500px] p-4'>
					<FormField
						control={form.control}
						name='cards'
						render={({ field }) => (
							<Each
								items={field.value}
								render={(item, index) => (
									<Accordion type='single' collapsible key={index}>
										<AccordionItem
											className='border-2 border-dashed rounded-lg px-2'
											value={`${index}`}
										>
											<AccordionTrigger className='border-b-2 border-dashed'>
												Card {index + 1}
											</AccordionTrigger>
											<AccordionContent>
												<FormItem>
													<FormField
														control={form.control}
														name={`cards.${index}.components`}
														render={({ field }) => (
															<Each
																items={field.value}
																render={(component, componentIndex) => {
																	if (component.type === 'HEADER') {
																		return (
																			<>
																				<FormField
																					control={form.control}
																					name={`cards.${index}.components.${componentIndex}.format`}
																					render={({ field }) => (
																						<FormItem className='space-y-0 flex-1'>
																							<FormLabel className='text-primary'>
																								Template Header
																								<span className='ml-[0.2rem] text-red-800'>*</span>
																							</FormLabel>
																							<FormControl>
																								<ToggleGroup
																									className='justify-start'
																									type='single'
																									value={component.format ?? 'IMAGE'}
																									onValueChange={(format: 'IMAGE' | 'VIDEO') => {
																										form.setValue(
																											`cards.${index}.components.${componentIndex}.format`,
																											format
																										);
																									}}
																								>
																									<ToggleGroupItem value='IMAGE' aria-label='Image'>
																										Image
																									</ToggleGroupItem>
																									<ToggleGroupItem value='VIDEO' aria-label='Video'>
																										Video
																									</ToggleGroupItem>
																								</ToggleGroup>
																							</FormControl>
																						</FormItem>
																					)}
																				/>
																				<FormField
																					control={form.control}
																					name={`cards.${index}.components.${componentIndex}.example.header_handle.0`}
																					render={({ field }) => {
																						if (file[index].file) {
																							return <div>File selected</div>;
																						}
																						return (
																							<FormItem className='space-y-0 flex-1'>
																								<FormLabel className='text-primary'>
																									Header Media
																								</FormLabel>
																								<FormControl>
																									<Input
																										type='file'
																										ref={fileInputRef}
																										accept={
																											component.format === 'IMAGE'
																												? 'image/*'
																												: 'video/*'
																										}
																										onChange={(e) =>
																											handleFileInput(
																												index,
																												e.target.files?.[0] ?? null
																											)
																										}
																									/>
																								</FormControl>
																							</FormItem>
																						);
																					}}
																				/>
																			</>
																		);
																	} else if (component.type === 'BODY') {
																		return (
																			<>
																				<FormField
																					control={form.control}
																					name={`cards.${index}.components.${componentIndex}.text`}
																					render={({ field }) => (
																						<FormItem className='space-y-0 flex-1'>
																							<FormLabel className='text-primary'>
																								Template Body
																								<span className='ml-[0.2rem] text-red-800'>*</span>
																							</FormLabel>
																							<FormDescription className='text-xs pb-2'>
																								{`Use dynamic variable like {{1}} {{2}} and so on`}.
																								(Limit {field.value?.length ?? 0} / 160)
																							</FormDescription>
																							<FormControl>
																								<Textarea
																									placeholder='Body Text'
																									value={field.value ?? ''}
																									className='h-[300px]'
																									onChange={(e) =>
																										handleBodyTextChange(
																											index,
																											componentIndex,
																											e.target.value
																										)
																									}
																								/>
																							</FormControl>
																						</FormItem>
																					)}
																				/>
																				<Show.ShowIf
																					condition={countOccurrences(component.text ?? '') > 0}
																				>
																					<FormItem className='space-y-0 flex-1'>
																						<FormLabel className='text-primary'>
																							Example Values (Total:-{' '}
																							{countOccurrences(component.text ?? '')})
																							<span className='ml-[0.2rem] text-red-800'>*</span>
																						</FormLabel>
																						<FormDescription className='text-xs'>
																							(
																							{component?.example?.body_text?.[0].filter(
																								(v) => v.trim().length > 0
																							).length ?? 0}{' '}
																							of {countOccurrences(component.text ?? '')} provided)
																						</FormDescription>
																						<Each
																							items={Array.from({
																								length: countOccurrences(component.text ?? ''),
																							})}
																							render={(variable, variableIndex) => (
																								<FormControl>
																									<Input
																										key={variableIndex}
																										placeholder={`Example Value ${
																											variableIndex + 1
																										}`}
																										isInvalid={
																											(
																												component?.example?.body_text?.[0]?.[
																													variableIndex
																												] ?? ''
																											).length === 0
																										}
																										value={
																											(component?.example?.body_text?.[0] ?? [])[
																												variableIndex
																											] ?? ''
																										}
																										onChange={(e) => {
																											if (!component.example) {
																												component.example = {
																													body_text: [
																														Array.from({
																															length: countOccurrences(
																																component.text ?? ''
																															),
																														}).map(() => ''),
																													],
																												};
																											}

																											form.setValue(
																												`cards.${index}.components.${componentIndex}.example.body_text.0.${variableIndex}`,
																												e.target.value as never // TODO: Fix this
																											);
																										}}
																									/>
																								</FormControl>
																							)}
																						/>
																					</FormItem>
																				</Show.ShowIf>
																			</>
																		);
																	} else {
																		return (
																			<FormField
																				control={form.control}
																				name={`cards.${index}.components.${componentIndex}.buttons`}
																				render={({ field }) => (
																					<div className='flex flex-col gap-3'>
																						<FormLabel className='text-primary'>Buttons</FormLabel>
																						<FormDescription className='text-xs pb-2'>
																							Insert buttons so your customers can take action and
																							engage with your message!
																						</FormDescription>

																						<div
																							className={cn(
																								' gap-3 border border-dashed p-3',
																								field.value.length > 0 ? 'inline-flex' : 'hidden'
																							)}
																						>
																							<Each
																								items={field.value}
																								render={(button: { type: string }, buttonIndex) => (
																									<Badge>
																										<span className='text-sm font-medium'>
																											{button.type.replaceAll('_', ' ')}
																										</span>
																										<CircleMinus
																											className='w-3 h-3 ml-2 cursor-pointer'
																											onClick={() =>
																												removeButtonComponent(
																													index,
																													componentIndex,
																													buttonIndex
																												)
																											}
																										/>
																									</Badge>
																								)}
																							/>
																						</div>
																						<div className='flex justify-between'>
																							<div className='flex flex-col md:flex-row gap-3'>
																								<AddQuickReply
																									disabled={field.value.length >= 2}
																									onSubmit={(text) =>
																										addQuickReply(index, componentIndex, text)
																									}
																								/>
																								<PhoneNumberButton
																									disabled={field.value.length >= 2}
																									onSubmit={(text) =>
																										addPhoneNumberButton(
																											index,
																											componentIndex,
																											text
																										)
																									}
																								/>
																								<URLButton
																									disabled={field.value.length >= 2}
																									onSubmit={(text) =>
																										addURLButton(index, componentIndex, text)
																									}
																								/>
																							</div>
																							<Button
																								variant={'destructive'}
																								size={'icon'}
																								type='button'
																								onClick={() => handleDeleteCard(index)}
																							>
																								<Trash />
																							</Button>
																						</div>
																					</div>
																				)}
																			/>
																		);
																	}
																}}
															/>
														)}
													/>
												</FormItem>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								)}
							/>
						)}
					/>
				</ScrollArea>
				<DialogFooter className='p-4'>
					<Button
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							handleSave(form.getValues());
						}}
						disabled={form.watch('cards').length < 2}
						className='mt-4'
					>
						Submit
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
