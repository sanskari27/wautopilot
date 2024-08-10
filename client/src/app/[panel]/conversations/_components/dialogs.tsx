'use client';
import Each from '@/components/containers/each';
import TagsSelector from '@/components/elements/popover/tags';
import PreviewFile from '@/components/elements/preview-file';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MessagesService from '@/services/messages.service';
import UploadService from '@/services/upload.service';
import { Recipient } from '@/types/recipient';
import { ListFilter } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';

export default function AssignLabelDialog({
	children,
	recipient,
}: {
	children: React.ReactNode;
	recipient: Recipient;
}) {
	const buttonRef = React.useRef<HTMLButtonElement>(null);
	const router = useRouter();
	const params = useParams();

	const [selectedLabels, setSelectedLabels] = React.useState<string[]>(recipient.labels);
	const [newLabel, setNewLabel] = React.useState('');

	const onClose = () => {
		setSelectedLabels(recipient.labels);
		setNewLabel('');
		router.push(`/${params.panel}/conversations/`);
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
					toast.success('Labels assigned successfully');
					onClose();
					return;
				}
				toast.error('Failed to assign labels');
			})
			.catch(() => {
				toast.error('Failed to assign labels');
			});
	};
	return (
		<Dialog>
			<DialogTrigger ref={buttonRef} asChild>
				{children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Assign Labels</DialogTitle>
					<DialogDescription className='w-full'>
						<div className='flex flex-wrap justify-start mt-2 gap-1'>
							<Each
								items={selectedLabels}
								render={(label) => (
									<Badge className='min-w-max bg-gray-200 text-gray-700 font-normal'>
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
								<Input
									placeholder='Add new labels'
									value={newLabel}
									onChange={handleNewLabelInput}
								/>
							</div>
							<TagsSelector onChange={handleLabelChange}>
								<Button variant='secondary' size={'icon'}>
									<ListFilter className='w-4 h-4' strokeWidth={3} />
								</Button>
							</TagsSelector>
						</div>
					</DialogDescription>
				</DialogHeader>
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
