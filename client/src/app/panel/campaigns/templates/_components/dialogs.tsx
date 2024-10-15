'use client';
import Each from '@/components/containers/each';
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
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Carousel, carouselSchema } from '@/schema/template';
import UploadService from '@/services/upload.service';
import { zodResolver } from '@hookform/resolvers/zod';
import {} from '@radix-ui/react-alert-dialog';
import { CircleMinus, Link, MessageCircleReply, PhoneCall, Trash } from 'lucide-react';
import React, { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import BodyWithVariables from './body-with-variables';

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
	onSubmit: (details: { url: string; text: string; example: string[] }) => void;
}) {
	const [text, setText] = useState('');
	const [link, setLink] = useState('');
	const [example, setExamples] = useState<string[]>([]);

	const buttonRef = React.useRef<HTMLButtonElement>(null);

	function submit() {
		if (!text) {
			return toast.error('Please enter text to be displayed');
		}
		if (!link) {
			return toast.error('Please enter a link');
		}
		if (example.some((example) => example.length === 0)) {
			return toast.error('Please enter example values');
		}
		buttonRef.current?.click();
		onSubmit({ text, url: link, example });
		setText('');
		setLink('');
		setExamples([]);
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger ref={buttonRef} asChild disabled={disabled}>
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
						<BodyWithVariables
							headerTextChange={(text, example) => {
								setLink(text);
								setExamples(example);
							}}
							label='Link'
							limit='100000'
							placeholder='enter you link '
							text={link}
							text_variables={example}
						/>
					</div>
				</div>
				<AlertDialogFooter className='mt-2'>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button onClick={submit}>Save</Button>
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
	carousel: Carousel | undefined;
	onSubmit: (data: Carousel) => void;
}) {
	const buttonRef = React.useRef<HTMLButtonElement>(null);

	const [file, setFile] = React.useState<
		{
			index: number;
			file: File | null;
		}[]
	>([]);

	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const form = useForm<Carousel>({
		resolver: zodResolver(carouselSchema),
		defaultValues: carousel,
	});

	const cards = form.watch('cards');

	const addBlankCard = () => {
		if (form.getValues('cards').length >= 10) {
			return;
		}
		form.setValue('cards', [
			...form.getValues('cards'),
			{
				header: {
					format: 'IMAGE',
					example: '',
				},
				body: {
					text: '',
					example: [],
				},
				buttons: [],
			},
		]);
		setFile((prev) => {
			return [...prev, { index: form.getValues('cards').length - 1, file: null }];
		});
	};

	function removeButtonComponent(index: number, buttonIndex: number) {
		form.setValue(
			`cards.${index}.buttons`,
			form.getValues(`cards.${index}.buttons`).filter((_, i) => i !== buttonIndex)
		);
	}

	function addQuickReply(index: number, text: string) {
		form.setValue(`cards.${index}.buttons`, [
			...form.getValues(`cards.${index}.buttons`),
			{
				type: 'QUICK_REPLY',
				text,
			},
		]);
	}

	function addPhoneNumberButton(
		index: number,
		payload: {
			phone_number: string;
			text: string;
		}
	) {
		form.setValue(`cards.${index}.buttons`, [
			...form.getValues(`cards.${index}.buttons`),
			{
				type: 'PHONE_NUMBER',
				...payload,
			},
		]);
	}

	function addURLButton(
		index: number,
		payload: {
			url: string;
			text: string;
			example: string[];
		}
	) {
		form.setValue(`cards.${index}.buttons`, [
			...form.getValues(`cards.${index}.buttons`),
			{
				type: 'URL',
				...payload,
			},
		]);
	}

	const handleDeleteCard = (index: number) => {
		form.setValue(
			`cards`,
			form.getValues('cards').filter((_, i) => i !== index)
		);
	};

	const handleSave = (data: Carousel, e?: React.BaseSyntheticEvent<object, any, any>) => {
		e?.stopPropagation();
		e?.preventDefault();
		let hasError = false;
		if (data.cards.length < 2) {
			hasError = true;
			return toast.error('At least 2 cards are required');
		}
		if (data.cards.length > 10) {
			hasError = true;
			return toast.error('Maximum 10 cards are allowed');
		}
		if (file.length !== data.cards.length) {
			hasError = true;
			return toast.error('Please upload media file in all cards');
		}

		const buttonLength = new Set();
		const buttonType = new Set();
		data.cards.forEach((card, index) => {
			if (!card.header.example) {
				hasError = true;
				return toast.error(`Please upload media file in card ${index + 1}`);
			}
			if (card.body.text.length === 0) {
				hasError = true;

				return toast.error(`Card ${index + 1} has empty body`);
			}
			if (card.body.text.includes('\n')) {
				hasError = true;
				return toast.error(`Card ${index + 1} body should not contain new line`);
			}
			card.body.example.forEach((variable, index) => {
				if (variable.length === 0) {
					hasError = true;
					return toast.error(`Card ${index + 1} has no variables`);
				}
			});
			buttonLength.add(card.buttons.length);
			card.buttons.forEach((button) => {
				buttonType.add(button.type);
			});
		});
		if (buttonLength.size > 1) {
			hasError = true;
			return toast.error('All cards should have same number of buttons');
		}

		if (!hasError) {
			handleFileUpload(data);
		}
		return;
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
		data.cards.forEach((card, index) => {
			card.header.example = handle[index];
		});
		onSubmit(data);
		buttonRef.current?.click();
		return;
	};

	return (
		<Dialog>
			<DialogTrigger ref={buttonRef} asChild>
				{children}
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-xl lg:max-w-3xl'>
				<DialogHeader>
					<DialogTitle>Carousel Template</DialogTitle>
				</DialogHeader>
				<Button onClick={addBlankCard}>Add Card</Button>
				<ScrollArea className='max-h-[800px] px-1'>
					<form onSubmit={form.handleSubmit((data, e) => handleSave(data, e))}>
						<FormField
							control={form.control}
							name='cards'
							render={({ field }) => (
								<Each
									items={field.value}
									render={(item, index) => (
										<Accordion type='single' collapsible key={index}>
											<AccordionItem value={`${index}`}>
												<AccordionTrigger>Card {index + 1}</AccordionTrigger>
												<AccordionContent>
													<FormItem>
														<FormLabel>Components</FormLabel>
														<FormField
															control={form.control}
															name={`cards.${index}.header`}
															render={({ field }) => (
																<>
																	<FormItem className='space-y-0 flex-1'>
																		<FormLabel className='text-primary'>
																			Template Header Type
																			<span className='ml-[0.2rem] text-red-800'>*</span>
																		</FormLabel>
																		<FormControl>
																			<Select
																				value={field.value?.format}
																				onValueChange={(format) => {
																					form.setValue(`cards.${index}.header`, {
																						format: format as 'IMAGE' | 'VIDEO',
																						example: '',
																					});
																				}}
																			>
																				<SelectTrigger className='w-[180px]'>
																					<SelectValue placeholder='Select header type' />
																				</SelectTrigger>
																				<SelectContent>
																					<SelectGroup>
																						<SelectItem value='IMAGE'>Image</SelectItem>
																						<SelectItem value='VIDEO'>Video</SelectItem>
																					</SelectGroup>
																				</SelectContent>
																			</Select>
																		</FormControl>
																	</FormItem>
																	<FormItem className='space-y-0 flex-1'>
																		<FormLabel className='text-primary'>
																			Header Media
																			<span className='ml-[0.2rem] text-red-800'>*</span>
																		</FormLabel>
																		<FormControl>
																			{file[index]?.file ? (
																				<div>
																					<Label>
																						File Selected
																						<span
																							onClick={() =>
																								setFile((prev) => {
																									const newFiles = [...prev];
																									newFiles[index] = { index, file: null };
																									return newFiles;
																								})
																							}
																							className='ml-1 underline cursor-pointer'
																						>
																							Reset?
																						</span>
																					</Label>
																				</div>
																			) : (
																				<Input
																					type='file'
																					ref={fileInputRef}
																					accept={
																						field.value.format === 'IMAGE'
																							? 'image/*'
																							: field.value.format === 'VIDEO'
																							? 'video/*'
																							: field.value.format === 'DOCUMENT'
																							? 'application/pdf'
																							: ''
																					}
																					onChange={(e) =>
																						handleFileInput(index, e.target.files?.[0] ?? null)
																					}
																				/>
																			)}
																		</FormControl>
																	</FormItem>
																</>
															)}
														/>
														<FormField
															control={form.control}
															name={`cards.${index}.body`}
															render={({ field }) => (
																<FormItem className='space-y-0 flex-1'>
																	<FormControl>
																		<BodyWithVariables
																			label='Body Text'
																			limit='160'
																			placeholder='enter body text'
																			text={field.value.text}
																			text_variables={field.value.example}
																			headerTextChange={(text, example) => {
																				form.setValue(`cards.${index}.body.text`, text);
																				form.setValue(`cards.${index}.body.example`, example);
																			}}
																		/>
																	</FormControl>
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`cards.${index}.buttons`}
															render={({ field }) => (
																<div className='flex flex-col gap-3'>
																	<FormLabel className='text-primary'>Buttons</FormLabel>
																	<FormDescription className='text-xs pb-2'>
																		Insert buttons so your customers can take action and engage with
																		your message!
																	</FormDescription>

																	<div
																		className={cn(
																			' gap-3 border border-dashed p-3',
																			(field.value ?? []).length > 0 ? 'inline-flex' : 'hidden'
																		)}
																	>
																		<Each
																			items={field.value ?? []}
																			render={(button: { type: string }, buttonIndex) => (
																				<Badge>
																					<span className='text-sm font-medium'>
																						{button.type.replaceAll('_', ' ')}
																					</span>
																					<CircleMinus
																						className='w-3 h-3 ml-2 cursor-pointer'
																						onClick={() =>
																							removeButtonComponent(index, buttonIndex)
																						}
																					/>
																				</Badge>
																			)}
																		/>
																	</div>
																	<div className='flex justify-between'>
																		<div className='flex flex-col md:flex-row gap-3'>
																			<AddQuickReply
																				disabled={(field.value ?? []).length >= 3}
																				onSubmit={(text) => addQuickReply(index, text)}
																			/>
																			<URLButton
																				disabled={(field.value ?? []).length >= 3}
																				onSubmit={(payload) => addURLButton(index, payload)}
																			/>
																		</div>
																		<Button
																			onClick={() => handleDeleteCard(index)}
																			type='button'
																			variant={'destructive'}
																			size={'icon'}
																		>
																			<Trash />
																		</Button>
																	</div>
																</div>
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
					</form>
					<Button
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							handleSave(form.watch(), e);
						}}
						disabled={!form.formState.errors}
					>
						Submit
					</Button>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
