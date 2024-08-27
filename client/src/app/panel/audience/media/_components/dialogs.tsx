'use client';
import PreviewFile from '@/components/elements/preview-file';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MediaService from '@/services/media.service';
import { FileUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

export function UploadMedia() {
	const router = useRouter();
	const [name, setName] = useState('');
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
		const filename = name || selectedFile.file.name;

		toast.promise(MediaService.uploadMedia(selectedFile.file, filename), {
			success: () => {
				router.refresh();
				return 'File uploaded successfully.';
			},
			error: 'Failed to upload file.',
			loading: 'Uploading file...',
		});
	}

	const removeSelectedFile = () => {
		setFile(null);
	};

	return (
		<Dialog
			onOpenChange={(open) => {
				if (open) {
					setName('');
					setFile(null);
				}
			}}
		>
			<DialogTrigger asChild>
				<Button size={'sm'} variant={'outline'} className='border-primary text-primary'>
					<FileUp className='w-4 h-4 mr-2' />
					Upload Media
				</Button>
			</DialogTrigger>
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
								<>
									Drag and drop file here, or click to select file
									<span className='ml-[0.2rem] text-red-800'>*</span>
								</>
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
					<div className='grid gap-2'>
						<Label className='text-primary' htmlFor='name'>
							Filename<span className='ml-[0.2rem] text-red-800'>*</span>
						</Label>
						<Input
							id='name'
							value={name}
							placeholder='enter preferred filename'
							onChange={(e) => setName(e.target.value)}
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
