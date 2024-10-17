'use client';
import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { useQuickReplies } from '@/components/context/quick-replies';
import { useFields } from '@/components/context/tags';
import { useTemplates } from '@/components/context/templates';
import { useUserDetails } from '@/components/context/user-details';
import DeleteDialog from '@/components/elements/dialogs/delete';
import MediaSelectorDialog from '@/components/elements/dialogs/media-selector';
import TagsSelector from '@/components/elements/popover/tags';
import PreviewFile from '@/components/elements/preview-file';
import TemplatePreview from '@/components/elements/template-preview';
import TemplateSelector from '@/components/elements/templetes-selector';
import WhatsappFlowSelector from '@/components/elements/wa-flow-selector';
import AbsoluteCenter from '@/components/ui/absolute-center';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { countOccurrences } from '@/lib/utils';
import { Carousel } from '@/schema/template';
import MessagesService from '@/services/messages.service';
import UploadService from '@/services/upload.service';
import { Recipient } from '@/types/recipient';
import { EllipsisVertical, ListFilter, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';
import { AddButton, ListButtons } from './add-ons';

export default function AssignLabelDialog({
	children,
	recipient,
}: {
	children: React.ReactNode;
	recipient: Recipient;
}) {
	const buttonRef = React.useRef<HTMLButtonElement>(null);
	const router = useRouter();

	const [selectedLabels, setSelectedLabels] = React.useState<string[]>(recipient.labels);
	const [newLabel, setNewLabel] = React.useState('');

	const onClose = () => {
		setSelectedLabels(recipient.labels);
		setNewLabel('');
		router.push(`/panel/conversations/`);
		router.refresh();
	};

	const handleLabelChange = (label: string[]) => {
		setSelectedLabels((prev) => {
			const newLabels = label.filter((item) => !prev.includes(item));
			return [...prev, ...newLabels];
		});
	};

	const removeLabel = (label: string) => {
		setSelectedLabels((prev) => prev.filter((item) => item !== label));
	};

	const handleNewLabelInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewLabel(e.target.value);
		const new_label = e.target.value;
		if (new_label.includes(' ')) {
			const label = new_label.split(' ')[0];
			if (!selectedLabels.includes(label) && label.trim().length !== 0) {
				setSelectedLabels((prev) => {
					return [...prev, label];
				});
			}
			setNewLabel('');
		}
	};

	const handleSave = () => {
		MessagesService.ConversationLabels(
			recipient.recipient,
			newLabel.trim().length !== 0 ? [...selectedLabels, newLabel.trim()] : selectedLabels
		)
			.then((res) => {
				if (res) {
					toast.success('Tags assigned successfully');
					onClose();
					return;
				}
				toast.error('Failed to assign tags');
			})
			.catch(() => {
				toast.error('Failed to assign tags');
			});
	};
	return (
		<Dialog>
			<DialogTrigger ref={buttonRef} asChild>
				{children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Assign Tags</DialogTitle>{' '}
				</DialogHeader>

				<div className='flex flex-wrap justify-start mt-2 gap-1'>
					<Each
						items={selectedLabels}
						render={(label) => (
							<Badge className='min-w-max bg-gray-200 text-gray-700 font-normal hover:text-white'>
								{label}
								<IoClose
									onClick={() => removeLabel(label)}
									className='w-4 h-4 cursor-pointer'
									strokeWidth={3}
								/>
							</Badge>
						)}
					/>
				</div>
				<div className='flex w-full mt-4 items-center'>
					<div className='flex-1'>
						<Input placeholder='Add new labels' value={newLabel} onChange={handleNewLabelInput} />
					</div>
					<TagsSelector onChange={handleLabelChange}>
						<Button variant='secondary' size={'icon'}>
							<ListFilter className='w-4 h-4' strokeWidth={3} />
						</Button>
					</TagsSelector>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button type='submit' onClick={handleSave}>
							Save
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function UploadMediaDialog({
	onConfirm,
	children,
}: {
	onConfirm: (media_id: string) => void;
	children: React.ReactNode;
}) {
	const [selectedFile, setFile] = useState<{
		file: File;
		type: string;
		size: string;
		url: string;
	} | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		const file = files[0];
		const fileSizeBytes = file.size;
		if (fileSizeBytes > 62914560) {
			return;
		}

		const url = window.URL.createObjectURL(file);

		const fileSizeKB = fileSizeBytes / 1024; // Convert bytes to kilobytes
		const fileSizeMB = fileSizeKB / 1024;

		let type = '';

		if (file.type.includes('image')) {
			type = 'image';
		} else if (file.type.includes('video')) {
			type = 'video';
		} else if (file.type.includes('pdf')) {
			type = 'PDF';
		} else if (file.type.includes('audio')) {
			type = file.type;
		}

		setFile({
			file,
			type,
			size: fileSizeMB > 1 ? `${fileSizeMB.toFixed(2)} MB` : `${fileSizeKB.toFixed(2)} KB`,
			url,
		});
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}

	async function submit() {
		if (!selectedFile) return;
		UploadService.generateMetaMediaId(selectedFile.file)
			.then((res) => {
				onConfirm(res);
			})
			.catch(() => {
				toast.error('Failed to upload media');
			});
	}

	const removeSelectedFile = () => {
		setFile(null);
	};

	return (
		<Dialog
			onOpenChange={(open) => {
				if (open) {
					setFile(null);
				}
			}}
		>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-xl'>
				<DialogHeader>
					<DialogTitle>Upload Media</DialogTitle>
				</DialogHeader>
				<div className='grid gap-4'>
					<div className='grid gap-2'>
						{selectedFile ? (
							<div className='w-full gap-2'>
								<p>Selected file : {selectedFile.file.name}</p>
								<div className='flex justify-between items-center'>
									<p>Selected file size : {selectedFile.size}</p>
									<p
										onClick={removeSelectedFile}
										className='cursor-pointer font-normal text-red-400'
									>
										Remove
									</p>
								</div>
								<PreviewFile data={selectedFile} />
							</div>
						) : (
							<Label
								htmlFor='logo'
								className={
									'!cursor-pointer text-center border border-gray-400 border-dashed py-12 rounded-lg text-normal text-primary'
								}
							>
								<>Drag and drop file here, or click to select file</>
							</Label>
						)}
						<Input
							id='logo'
							className='hidden'
							type='file'
							ref={fileInputRef}
							onChange={handleFileChange}
						/>
					</div>
				</div>
				<DialogFooter className='mt-2'>
					<DialogClose asChild>
						<Button variant='secondary'>Cancel</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button onClick={submit}>Save</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function ConversationNoteDialog({
	isOpen,
	onClose,
	id,
}: {
	id: string;
	isOpen: boolean;
	onClose: () => void;
}) {
	const [notes, setNotes] = useState('');

	const handleClose = () => {
		onClose();
	};

	const handleSave = () => {
		toast.promise(MessagesService.setNote(id, notes), {
			loading: 'Saving note...',
			success: () => {
				handleClose();
				return 'Note saved successfully';
			},
			error: 'Failed to save note',
		});
	};

	useEffect(() => {
		if (!isOpen) return;
		MessagesService.getNote(id)
			.then((res) => {
				setNotes(res ?? '');
			})
			.catch(() => {
				toast.error('Failed to get note');
			});
	}, [id, isOpen]);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(value) => {
				if (!value) {
					handleClose();
				}
			}}
		>
			<DialogContent className='max-w-sm md:max-w-lg lg:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Conversation Note</DialogTitle>
				</DialogHeader>
				<Textarea className='h-[300px]' value={notes} onChange={(e) => setNotes(e.target.value)} />
				<DialogFooter>
					<Button onClick={handleSave}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function QuickButtonTemplateMessage({
	onConfirm,
	children,
}: {
	children: React.ReactNode;
	onConfirm: (id: string) => void;
}) {
	const { isAdmin } = useUserDetails();

	const { buttonTemplates, addQuickReply, removeQuickReply, updateQuickReply } = useQuickReplies();

	const [selectedReply, setSelectedReply] = useState<string>('');

	const handleSave = (id: string) => {
		onConfirm(id);
	};

	const handleRemoveQuickReply = (id: string) => {
		toast.promise(MessagesService.deleteQuickReply(id), {
			loading: 'Removing quick button message...',
			success: () => {
				removeQuickReply(id);
				return 'Quick button message removed successfully';
			},
			error: 'Failed to remove quick button message',
		});
		removeQuickReply(id);
	};

	const handleAddQuickReply = (body: string, buttons: string[], id?: string) => {
		const promise = id
			? MessagesService.editQuickReply({
					id,
					type: 'button',
					body,
					buttons,
			  })
			: MessagesService.addQuickReply({
					type: 'button',
					body,
					buttons,
			  });
		toast.promise(promise, {
			loading: 'Adding quick button message...',
			success: (res) => {
				if (id) {
					updateQuickReply(res.id, res);
				} else {
					addQuickReply({
						type: 'button',
						id: res.id,
						data: res.data,
					});
				}
				return 'Quick button message added successfully';
			},
			error: (err) => {
				return 'Failed to add quick button message';
			},
		});
		setSelectedReply('');
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='max-w-sm md:max-w-lg lg:max-w-2xl max-h-full'>
				<DialogHeader>
					<DialogTitle>Button Message</DialogTitle>
				</DialogHeader>
				<ScrollArea className='max-h-[400px]'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Sl. No.</TableHead>
								<TableHead>Name</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<Each
								items={buttonTemplates}
								render={(template) => (
									<TableRow key={template.id}>
										<TableCell>
											<Checkbox
												checked={selectedReply === template.id}
												onCheckedChange={(checked) => {
													if (checked) {
														setSelectedReply(template.id);
													} else {
														setSelectedReply('');
													}
												}}
											/>
										</TableCell>
										<TableCell>
											<p>{template.data.body}</p>
											<p>{template.data.buttons.join(', ')}</p>
										</TableCell>
										<Show.ShowIf condition={!isAdmin}>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger>
														<Button variant='ghost' size={'icon'}>
															<EllipsisVertical className='w-4 h-4' />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent>
														<DropdownMenuItem asChild>
															<AddQuickButtonMessage
																id={template.id}
																body={template.data.body}
																buttons={template.data.buttons}
																onConfirm={handleAddQuickReply}
															>
																<Button size={'sm'} className='w-full' variant='secondary'>
																	<span className='mr-auto'>Edit</span>
																</Button>
															</AddQuickButtonMessage>
														</DropdownMenuItem>
														<DeleteDialog onDelete={() => handleRemoveQuickReply(template.id)}>
															<Button
																variant={'destructive'}
																className='w-full p-2 font-normal'
																size={'sm'}
															>
																<span className='mr-auto'>Delete</span>
															</Button>
														</DeleteDialog>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</Show.ShowIf>
									</TableRow>
								)}
							/>
						</TableBody>
					</Table>
				</ScrollArea>
				<DialogFooter>
					<Show.ShowIf condition={!isAdmin}>
						<AddQuickButtonMessage onConfirm={handleAddQuickReply}>
							<Button variant='secondary'>Add</Button>
						</AddQuickButtonMessage>
					</Show.ShowIf>
					<DialogClose asChild>
						<Button onClick={() => handleSave(selectedReply)}>Send</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function AddQuickButtonMessage({
	children,
	onConfirm,
	body,
	id,
	buttons: _buttons,
}: {
	children: React.ReactNode;
	onConfirm: (body: string, buttons: string[], id?: string) => void;
	id?: string;
	body?: string;
	buttons?: string[];
}) {
	const buttonRef = React.useRef<HTMLButtonElement>(null);

	const [bodyText, setBodyText] = useState(body ?? '');
	const [button, setButton] = useState<string[]>(_buttons ?? []);
	const [buttonText, setButtonText] = useState('');

	const handleAddButton = () => {
		if (buttonText.trim().length === 0) return;
		if (buttonText.trim().length < 3) {
			return toast.error('Button text should be at least 3 characters');
		}
		setButton((prev) => [...prev, buttonText]);
		setButtonText('');
	};

	const onRemove = (index: number) => {
		setButton((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSave = () => {
		if (!bodyText.trim().length) {
			return toast.error('Message body is required');
		}
		if (button.length < 1) {
			return toast.error('At least 2 buttons are required');
		}
		const unique = new Set(button);
		if (unique.size !== button.length) {
			return toast.error('Button text should be unique');
		}

		onConfirm(bodyText, button, id);
		buttonRef.current?.click();
		setBodyText('');
		setButton([]);
	};
	return (
		<Dialog>
			<DialogTrigger ref={buttonRef} asChild>
				{children}
			</DialogTrigger>
			<DialogContent className='max-w-sm md:max-w-lg lg:max-w-2xl max-h-full'>
				<DialogHeader>
					<DialogTitle>Add Quick Button Message</DialogTitle>
				</DialogHeader>
				<Label>Message body</Label>
				<Textarea
					placeholder='eg. choose an option'
					value={bodyText}
					onChange={(e) => setBodyText(e.target.value)}
				/>
				<div className='flex w-full items-center'>
					<Separator className='flex-1' />
					<div>Reply back buttons</div>
					<Separator className='flex-1' />
				</div>
				<div className='flex flex-col gap-2'>
					<Each
						items={button}
						render={(button, index) => (
							<div className='bg-gray-50 py-1 px-2 rounded-lg relative border border-gray-300'>
								{button}
								<X
									className='w-5 h-5 bg-red-500 p-1 text-white rounded-full absolute right-1 top-[50%] -translate-y-[50%]  cursor-pointer'
									onClick={() => onRemove(index)}
								/>
							</div>
						)}
					/>
				</div>
				<div className='flex gap-4'>
					<div className='flex-1'>
						<Input
							value={buttonText}
							onChange={(e) => setButtonText(e.target.value)}
							placeholder='Enter button text here, ex. Click to know more'
						/>
					</div>
					<Button size={'icon'} className='w-max px-4' onClick={handleAddButton}>
						<Plus className='w-4 h-4' />
						Add
					</Button>
				</div>
				<DialogFooter>
					<Button onClick={handleSave}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function QuickListTemplateMessage({
	onConfirm,
	children,
}: {
	children: React.ReactNode;
	onConfirm: (id: string) => void;
}) {
	const { isAdmin } = useUserDetails();

	const { listTemplates, addQuickReply, removeQuickReply, updateQuickReply } = useQuickReplies();

	const [selectedReply, setSelectedReply] = useState<string>('');

	const handleSave = (id: string) => {
		onConfirm(id);
	};

	const handleRemoveQuickReply = (id: string) => {
		toast.promise(MessagesService.deleteQuickReply(id), {
			loading: 'Removing quick button message...',
			success: () => {
				removeQuickReply(id);
				return 'Quick button message removed successfully';
			},
			error: 'Failed to remove quick button message',
		});
		removeQuickReply(id);
	};

	const handleAddQuickReply = (
		header: string,
		body: string,
		footer: string,
		section: {
			title: string;
			buttons: string[];
		}[],
		id?: string
	) => {
		const promise = id
			? MessagesService.editQuickReply({
					id,
					type: 'list',
					header,
					body,
					footer,
					sections: section,
			  })
			: MessagesService.addQuickReply({
					type: 'list',
					body,
					footer,
					sections: section,
					header,
			  });
		toast.promise(promise, {
			loading: 'Adding quick button message...',
			success: (res) => {
				if (id) {
					updateQuickReply(res.id, res);
				} else {
					addQuickReply({
						type: 'button',
						id: res.id,
						data: res.data,
					});
				}
				return 'Quick button message added successfully';
			},
			error: (err) => {
				return 'Failed to add quick button message';
			},
		});
		setSelectedReply('');
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='max-w-sm md:max-w-lg lg:max-w-2xl max-h-full'>
				<DialogHeader>
					<DialogTitle>List Message</DialogTitle>
				</DialogHeader>
				<ScrollArea className='max-h-[400px]'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Sl. No.</TableHead>
								<TableHead className='w-[75%]'>Name</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<Each
								items={listTemplates}
								render={(template) => (
									<TableRow key={template.id}>
										<TableCell>
											<Checkbox
												checked={selectedReply === template.id}
												onCheckedChange={(checked) => {
													if (checked) {
														setSelectedReply(template.id);
													} else {
														setSelectedReply('');
													}
												}}
											/>
										</TableCell>
										<TableCell>
											{template.data.body}
											{template.data.sections.map((section, index) => (
												<Badge key={index} className='ml-2'>
													{section.title}
												</Badge>
											))}
										</TableCell>
										<Show.ShowIf condition={!isAdmin}>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger>
														<Button variant='ghost' size={'icon'}>
															<EllipsisVertical className='w-4 h-4' />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent>
														<DropdownMenuItem asChild>
															<AddQuickListMessage
																id={template.id}
																body={template.data.body}
																sections={template.data.sections}
																header={template.data.header}
																footer={template.data.footer}
																onConfirm={handleAddQuickReply}
															>
																<Button size={'sm'} className='w-full' variant='secondary'>
																	<span className='mr-auto'>Edit</span>
																</Button>
															</AddQuickListMessage>
														</DropdownMenuItem>
														<DeleteDialog onDelete={() => handleRemoveQuickReply(template.id)}>
															<Button
																variant={'destructive'}
																className='w-full p-2 font-normal'
																size={'sm'}
															>
																<span className='mr-auto'>Delete</span>
															</Button>
														</DeleteDialog>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</Show.ShowIf>
									</TableRow>
								)}
							/>
						</TableBody>
					</Table>
				</ScrollArea>
				<DialogFooter>
					<Show.ShowIf condition={!isAdmin}>
						<AddQuickListMessage onConfirm={handleAddQuickReply}>
							<Button variant='secondary'>Add</Button>
						</AddQuickListMessage>
					</Show.ShowIf>
					<DialogClose asChild>
						<Button onClick={() => handleSave(selectedReply)}>Send</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function AddQuickListMessage({
	children,
	onConfirm,
	body: _body,
	id,
	sections: _sections,
	header: _header,
	footer: _footer,
}: {
	children: React.ReactNode;
	onConfirm: (
		header: string,
		body: string,
		footer: string,
		section: {
			title: string;
			buttons: string[];
		}[]
	) => void;
	id?: string;
	body?: string;
	header?: string;
	footer?: string;
	sections?: {
		title: string;
		buttons: string[];
	}[];
}) {
	const buttonRef = React.useRef<HTMLButtonElement>(null);

	const [header, setHeader] = useState(_header ?? '');
	const [body, setBody] = useState(_body ?? '');
	const [footer, setFooter] = useState(_footer ?? '');
	const [sections, setSections] = useState<
		{
			title: string;
			buttons: string[];
		}[]
	>(_sections ?? []); // [header, body, footer

	const handleSave = () => {
		if (!body || !sections.length) return;
		if (!header || !footer) return toast.error('Header and Footer are required');
		sections.forEach((section) => {
			const unique = new Set(section.buttons.map((button) => button));
			if (unique.size !== section.buttons.length) {
				return toast.error('Button text should be unique');
			}
		});
		const hasAtLeast2Buttons = sections.every((section) => section.buttons.length >= 2);
		if (!hasAtLeast2Buttons) {
			return toast.error('Each section should have at least 2 buttons');
		}
		onConfirm(header, body, footer, sections);
		buttonRef.current?.click();
		setHeader('');
		setBody('');
		setFooter('');
		setSections([]);
	};

	const removeButton = (sectionIndex: number, text: string) => {
		const newSections = [...sections];
		newSections[sectionIndex].buttons = newSections[sectionIndex].buttons.filter(
			(button) => button !== text
		);
		setSections(newSections);
	};

	function addButtonToSection(sectionIndex: number, buttonText: string): void {
		if (!buttonText) return;
		const newSections = [...sections];
		if (!newSections[sectionIndex].buttons) {
			newSections[sectionIndex].buttons = [];
		}
		newSections[sectionIndex].buttons.push(buttonText);
		setSections(newSections);
	}

	function RenderButtons({ sectionIndex, buttons }: { sectionIndex: number; buttons: string[] }) {
		return (
			<>
				<ListButtons buttons={buttons} onRemove={(text) => removeButton(sectionIndex, text)} />
				<AddButton
					isDisabled={buttons.length >= 3}
					onSubmit={(data) => {
						addButtonToSection(sectionIndex, data.text);
					}}
				/>
			</>
		);
	}

	function RenderSections() {
		return (
			<Each
				items={sections}
				render={(section, sectionIndex) => (
					<>
						<AbsoluteCenter>Section : {section.title}</AbsoluteCenter>

						<RenderButtons sectionIndex={sectionIndex} buttons={section.buttons} />
					</>
				)}
			/>
		);
	}

	return (
		<Dialog>
			<DialogTrigger ref={buttonRef} asChild>
				{children}
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>List Message</DialogTitle>
				</DialogHeader>
				<div className='max-h-[70vh] grid gap-2 overflow-y-auto px-0'>
					<div>
						<p className='text-sm mt-2'>Enter Header Text</p>
						<Input
							placeholder={'Enter your header text here.'}
							value={header}
							onChange={(e) => setHeader(e.target.value)}
						/>
					</div>
					<div>
						<p className='text-sm mt-2'>Enter Body Text</p>
						<Textarea
							className='w-full h-[100px] resize-none !ring-0'
							placeholder={'Enter your body text here.'}
							value={body}
							onChange={(e) => setBody(e.target.value)}
						/>
					</div>
					<div>
						<p className='text-sm mt-2'>Enter Footer Text</p>
						<Input
							placeholder={'Enter your footer text here.'}
							value={footer}
							onChange={(e) => setFooter(e.target.value)}
						/>
					</div>
					<AbsoluteCenter>Menu Sections</AbsoluteCenter>
					<RenderSections />

					<Separator className='bg-gray-400' />

					<AddButton
						placeholder={'Create a new section. \nex. Menu 1'}
						onSubmit={(data) => {
							setSections([...sections, { title: data.text, buttons: [] }]);
						}}
					/>
				</div>

				<Separator />
				<DialogFooter>
					<Button type='submit' disabled={sections.length === 0} onClick={handleSave}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function QuickFlowTemplateMessage({
	children,
	onConfirm,
}: {
	children: React.ReactNode;
	onConfirm: (id: string) => void;
}) {
	const { isAdmin } = useUserDetails();

	const { flowTemplates, addQuickReply, updateQuickReply, removeQuickReply } = useQuickReplies();

	const [selectedReply, setSelectedReply] = useState<string>('');

	const handleSave = (id: string) => {
		onConfirm(id);
	};

	const handleRemoveQuickReply = (id: string) => {
		toast.promise(MessagesService.deleteQuickReply(id), {
			loading: 'Removing quick button message...',
			success: () => {
				removeQuickReply(id);
				return 'Quick button message removed successfully';
			},
			error: 'Failed to remove quick button message',
		});
		removeQuickReply(id);
	};

	const handleAddQuickReply = (
		header: string,
		body: string,
		footer: string,
		flow_id: string,
		button_text: string,
		id?: string
	) => {
		const promise = id
			? MessagesService.editQuickReply({
					id,
					type: 'flow',
					header,
					body,
					footer,
					button_text,
					flow_id,
			  })
			: MessagesService.addQuickReply({
					type: 'flow',
					body,
					footer,
					header,
					button_text,
					flow_id,
			  });
		toast.promise(promise, {
			loading: 'Adding quick button message...',
			success: (res) => {
				if (id) {
					updateQuickReply(res.id, res);
				} else {
					addQuickReply({
						type: 'flow',
						id: res.id,
						data: res.data,
					});
				}
				return 'Quick button message added successfully';
			},
			error: (err) => {
				return 'Failed to add quick button message';
			},
		});
		setSelectedReply('');
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='max-w-sm md:max-w-lg lg:max-w-2xl max-h-full'>
				<DialogHeader>
					<DialogTitle>Flow Message</DialogTitle>
				</DialogHeader>
				<ScrollArea className='max-h-[400px]'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Sl. No.</TableHead>
								<TableHead className='w-[75%]'>Name</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<Each
								items={flowTemplates}
								render={(template) => (
									<TableRow key={template.id}>
										<TableCell>
											<Checkbox
												checked={selectedReply === template.id}
												onCheckedChange={(checked) => {
													if (checked) {
														setSelectedReply(template.id);
													} else {
														setSelectedReply('');
													}
												}}
											/>
										</TableCell>
										<TableCell>{template.data.body}</TableCell>
										<Show.ShowIf condition={!isAdmin}>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger>
														<Button variant='ghost' size={'icon'}>
															<EllipsisVertical className='w-4 h-4' />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent>
														<DropdownMenuItem asChild>
															<AddQuickFlowTemplateMessage
																id={template.id}
																body={template.data.body}
																header={template.data.header}
																footer={template.data.footer}
																button_text={template.data.button_text}
																flow_id={template.data.flow_id}
																onConfirm={handleAddQuickReply}
															>
																<Button size={'sm'} className='w-full' variant='secondary'>
																	<span className='mr-auto'>Edit</span>
																</Button>
															</AddQuickFlowTemplateMessage>
														</DropdownMenuItem>
														<DeleteDialog onDelete={() => handleRemoveQuickReply(template.id)}>
															<Button
																variant={'destructive'}
																className='w-full p-2 font-normal'
																size={'sm'}
															>
																<span className='mr-auto'>Delete</span>
															</Button>
														</DeleteDialog>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</Show.ShowIf>
									</TableRow>
								)}
							/>
						</TableBody>
					</Table>
				</ScrollArea>
				<DialogFooter>
					<Show.ShowIf condition={!isAdmin}>
						<AddQuickFlowTemplateMessage onConfirm={handleAddQuickReply}>
							<Button variant='secondary'>Add</Button>
						</AddQuickFlowTemplateMessage>
					</Show.ShowIf>
					<DialogClose asChild>
						<Button onClick={() => handleSave(selectedReply)}>Send</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function AddQuickFlowTemplateMessage({
	children,
	onConfirm,
	body: _body,
	id,
	header: _header,
	footer: _footer,
	button_text: _button_text,
	flow_id: _flow_id,
}: {
	id?: string;
	children: React.ReactNode;
	onConfirm: (
		header: string,
		body: string,
		footer: string,
		button_text: string,
		flow_id: string,
		id?: string
	) => void;
	header?: string;
	body?: string;
	footer?: string;
	button_text?: string;
	flow_id?: string;
}) {
	const buttonRef = React.useRef<HTMLButtonElement>(null);

	const [header, setHeader] = useState(_header ?? '');
	const [body, setBody] = useState(_body ?? '');
	const [footer, setFooter] = useState(_footer ?? '');
	const [flow_id, setFlowId] = useState(_flow_id ?? '');
	const [button_text, setButtonText] = useState(_button_text ?? '');

	const handleSave = () => {
		if (!header || !body || !footer || !button_text || !flow_id)
			return toast.error('All fields are required');
		onConfirm(header, body, footer, flow_id, button_text, id);
		setHeader('');
		setBody('');
		setFooter('');
		setButtonText('');
		setFlowId('');
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Whatsapp Flow Message</DialogTitle>
				</DialogHeader>
				<div className='max-h-[70vh] grid gap-2 overflow-y-auto px-0'>
					<div>
						<p className='text-sm mt-2'>Enter Header Text</p>
						<Input
							placeholder={'Enter your header text here.'}
							value={header}
							onChange={(e) => setHeader(e.target.value)}
						/>
					</div>
					<div>
						<p className='text-sm mt-2'>Enter Body Text</p>
						<Textarea
							className='w-full h-[100px] resize-none !ring-0'
							placeholder={'Enter your body text here.'}
							value={body}
							onChange={(e) => setBody(e.target.value)}
						/>
					</div>
					<div>
						<p className='text-sm mt-2'>Enter Footer Text</p>
						<Input
							placeholder={'Enter your footer text here.'}
							value={footer}
							onChange={(e) => setFooter(e.target.value)}
						/>
					</div>

					<Separator className='bg-gray-400' />

					<div>
						<p className='text-sm mt-2'>Select Whatsapp Flow</p>
						<WhatsappFlowSelector
							onChange={({ id }) => setFlowId(id)}
							value={flow_id}
							placeholder='Select flow...'
						/>
					</div>
					<div>
						<p className='text-sm mt-2'>Enter Button Text</p>
						<Input
							placeholder={'Enter your cta button text here.'}
							value={button_text}
							onChange={(e) => setButtonText(e.target.value)}
						/>
					</div>
				</div>
				<Separator />
				<DialogFooter>
					<DialogClose asChild>
						<Button type='submit' disabled={!body || !flow_id || !button_text} onClick={handleSave}>
							Save
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function QuickLocationTemplateMessage({
	children,
	onConfirm,
}: {
	children: React.ReactNode;
	onConfirm: (id: string) => void;
}) {
	const { isAdmin } = useUserDetails();

	const { locationTemplates, addQuickReply, updateQuickReply, removeQuickReply } =
		useQuickReplies();

	const [selectedReply, setSelectedReply] = useState<string>('');

	const handleSave = (id: string) => {
		onConfirm(id);
	};

	const handleRemoveQuickReply = (id: string) => {
		toast.promise(MessagesService.deleteQuickReply(id), {
			loading: 'Removing quick button message...',
			success: () => {
				removeQuickReply(id);
				return 'Quick button message removed successfully';
			},
			error: 'Failed to remove quick button message',
		});
		removeQuickReply(id);
	};

	const handleAddQuickReply = (body: string, id?: string) => {
		const promise = id
			? MessagesService.editQuickReply({
					id,
					type: 'location',
					body,
			  })
			: MessagesService.addQuickReply({
					type: 'location',
					body,
			  });
		toast.promise(promise, {
			loading: 'Adding quick location message...',
			success: (res) => {
				if (id) {
					updateQuickReply(res.id, res);
				} else {
					addQuickReply({
						type: 'location',
						id: res.id,
						data: res.data,
					});
				}
				return 'Quick location message added successfully';
			},
			error: (err) => {
				return 'Failed to add quick location message';
			},
		});
		setSelectedReply('');
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='max-w-sm md:max-w-lg lg:max-w-2xl max-h-full'>
				<DialogHeader>
					<DialogTitle>Location Message</DialogTitle>
				</DialogHeader>
				<ScrollArea className='max-h-[400px]'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Sl. No.</TableHead>
								<TableHead className='w-[75%]'>Name</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<Each
								items={locationTemplates}
								render={(template) => (
									<TableRow key={template.id}>
										<TableCell>
											<Checkbox
												checked={selectedReply === template.id}
												onCheckedChange={(checked) => {
													if (checked) {
														setSelectedReply(template.id);
													} else {
														setSelectedReply('');
													}
												}}
											/>
										</TableCell>
										<TableCell>{template.data.body}</TableCell>
										<Show.ShowIf condition={!isAdmin}>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger>
														<Button variant='ghost' size={'icon'}>
															<EllipsisVertical className='w-4 h-4' />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent>
														<DropdownMenuItem asChild>
															<AddQuickLocationTemplateMessage
																id={template.id}
																body={template.data.body}
																onConfirm={handleAddQuickReply}
															>
																<Button size={'sm'} className='w-full' variant='secondary'>
																	<span className='mr-auto'>Edit</span>
																</Button>
															</AddQuickLocationTemplateMessage>
														</DropdownMenuItem>
														<DeleteDialog onDelete={() => handleRemoveQuickReply(template.id)}>
															<Button
																variant={'destructive'}
																className='w-full p-2 font-normal'
																size={'sm'}
															>
																<span className='mr-auto'>Delete</span>
															</Button>
														</DeleteDialog>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</Show.ShowIf>
									</TableRow>
								)}
							/>
						</TableBody>
					</Table>
				</ScrollArea>
				<DialogFooter>
					<Show.ShowIf condition={!isAdmin}>
						<AddQuickLocationTemplateMessage onConfirm={handleAddQuickReply}>
							<Button variant='secondary'>Add</Button>
						</AddQuickLocationTemplateMessage>
					</Show.ShowIf>
					<DialogClose asChild>
						<Button onClick={() => handleSave(selectedReply)}>Send</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function AddQuickLocationTemplateMessage({
	children,
	onConfirm,
	body: _body,
	id,
}: {
	id?: string;
	children: React.ReactNode;
	onConfirm: (body: string, id?: string) => void;
	body?: string;
}) {
	const buttonRef = React.useRef<HTMLButtonElement>(null);

	const [body, setBody] = useState(_body ?? '');

	const handleSave = () => {
		if (!body) return toast.error('All fields are required');
		onConfirm(body, id);
		setBody('');
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Location Message</DialogTitle>
				</DialogHeader>
				<div className='max-h-[70vh] grid gap-2 overflow-y-auto px-0'>
					<Label>Body Text</Label>
					<Textarea
						placeholder='eg. Share your location'
						value={body}
						onChange={(e) => setBody(e.target.value)}
					/>
				</div>
				<Separator />
				<DialogFooter>
					<DialogClose asChild>
						<Button type='submit' disabled={!body} onClick={handleSave}>
							Save
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
