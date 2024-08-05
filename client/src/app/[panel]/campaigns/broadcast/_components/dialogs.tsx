'use client';
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
import { Textarea } from '@/components/ui/textarea';
import PhoneBookService from '@/services/phonebook.service';
import { CircleX, Library, Tags } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

export function AddFields() {
	const [field, setField] = useState('');
	const [defaultValue, setDefaultValue] = useState('');

	async function submit() {
		if (!field) return;

		toast.promise(PhoneBookService.addFields({ name: field, defaultValue }), {
			success: 'Field added successfully.',
			error: 'Failed to add field.',
			loading: 'Adding field...',
		});
	}

	return (
		<Dialog
			onOpenChange={(open) => {
				if (open) {
					setField('');
					setDefaultValue('');
				}
			}}
		>
			<DialogTrigger asChild>
				<Button className='bg-purple-600 hover:bg-purple-700' size={'sm'}>
					<Library className='w-4 h-4 mr-2' />
					Add Field
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] '>
				<DialogHeader>
					<DialogTitle>Add Fields to Records</DialogTitle>
				</DialogHeader>
				<div className='grid gap-4'>
					<div className='grid gap-2'>
						<Label className='text-primary' htmlFor='first-name'>
							Field Name
						</Label>
						<Input
							id='field-name'
							placeholder='Field Name'
							value={field}
							onChange={(e) => setField(e.target.value)}
						/>
					</div>

					<div className='grid gap-2'>
						<Label className='text-primary' htmlFor='first-name'>
							Field Name
						</Label>
						<Input
							id='field-value'
							placeholder='Default Value'
							value={defaultValue}
							onChange={(e) => setDefaultValue(e.target.value)}
						/>
					</div>
				</div>
				<DialogFooter className='mt-2'>
					<DialogClose asChild>
						<Button variant='secondary'>Cancel</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button onClick={submit}>Save changes</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function UploadCSV() {
	const [tags, setTags] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			setFile(file);
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}

	async function submit() {
		if (!file) return;
		const _tags = tags.split(',').map((t) => t.trim());
		toast.promise(PhoneBookService.bulkUpload(file, _tags), {
			success: 'Field added successfully.',
			error: 'Failed to add field.',
			loading: 'Adding field...',
		});
	}

	return (
		<Dialog
			onOpenChange={(open) => {
				if (open) {
					setTags('');
					setFile(null);
				}
			}}
		>
			<DialogTrigger asChild>
				<Button className='bg-lime-600 hover:bg-lime-700' size={'sm'}>
					<Tags className='w-4 h-4 mr-2' />
					Upload CSV
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-xl'>
				<DialogHeader>
					<DialogTitle>Upload CSV</DialogTitle>
				</DialogHeader>
				<div className='grid gap-4'>
					<div className='grid gap-2'>
						{file ? (
							<div className='flex items-center justify-between border-b border-dashed'>
								<span>
									File Selected : <span className='font-medium'>{file.name}</span>
								</span>
								<CircleX
									className='w-4 h-4 text-red-500 cursor-pointer'
									onClick={() => setFile(null)}
								/>
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
							accept='.csv'
						/>
					</div>
					<div className='grid gap-2'>
						<Label className='text-primary' htmlFor='tags'>
							Tags (comma separated)
						</Label>
						<Textarea
							id='tags'
							value={tags}
							placeholder='should only contain letters, numbers, and underscores.'
							onChange={(e) =>
								setTags(
									e.target.value
										.split(',')
										.map((t) => t.trim())
										.join(', ')
								)
							}
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

export function AssignTags({ ids }: { ids: string[] }) {
	const [tags, setTags] = useState('');

	async function submit() {
		if (!tags) return;

		toast.promise(
			PhoneBookService.assignLabels(
				ids,
				tags.split(',').map((t) => t.trim())
			),
			{
				success: 'Field added successfully.',
				error: 'Failed to add field.',
				loading: 'Adding field...',
			}
		);
	}

	return (
		<Dialog
			onOpenChange={(open) => {
				if (open) {
					setTags('');
				}
			}}
		>
			<DialogTrigger asChild>
				<Button className='bg-lime-600 hover:bg-lime-700' size={'sm'}>
					<Tags className='w-4 h-4 mr-2' />
					Assign Tags
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] '>
				<DialogHeader>
					<DialogTitle>Bulk Assign Tags</DialogTitle>
				</DialogHeader>
				<div className='grid gap-4'>
					<div className='grid gap-2'>
						<Label className='text-primary' htmlFor='first-name'>
							Tags (comma separated)
						</Label>
						<Textarea
							id='field-value'
							value={tags}
							placeholder='should only contain letters, numbers, and underscores.'
							onChange={(e) =>
								setTags(
									e.target.value
										.split(',')
										.map((t) => t.trim())
										.join(', ')
								)
							}
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
