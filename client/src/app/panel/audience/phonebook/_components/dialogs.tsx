'use client';
import Each from '@/components/containers/each';
import TagsSelector from '@/components/elements/popover/tags';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import PhoneBookService from '@/services/phonebook.service';
import { CircleX, Library, ListFilter, Tags } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';

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
							Field Name<span className='ml-[0.2rem] text-red-800'>*</span>
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
							Field Name<span className='ml-[0.2rem] text-red-800'>*</span>
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

	const [numberInput, setNumberInput] = useState('');
	const [numbers, setNumbers] = useState<string[]>([]);
	const [isChanged, setChanged] = useState(false);
	const [labels, setLabels] = useState<string[]>([]);
	const [newTags, setNewTags] = useState<string>('');

	const handleTextChange = (text: string) => {
		if (text.length === 0) {
			setChanged(true);
			return setNumberInput('');
		}
		setNumberInput(text);
		setChanged(true);
	};

	const handleFormatClicked = () => {
		const lines = numberInput.split('\n');
		const res_lines = [];
		const res_numbers: string[] = [];
		for (const line of lines) {
			if (!line) continue;
			const _numbers = line
				.split(/[ ,]+/)
				.map((number) => number.trim())
				.filter((number) => number && !isNaN(Number(number)));
			res_numbers.push(..._numbers);
			res_lines.push(_numbers.join(', '));
		}

		setNumberInput(res_lines.join('\n'));
		setNumbers(res_numbers);
		setChanged(false);
	};

	const handleNewLabelInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewTags(e.target.value);
		const new_label = e.target.value;
		if (new_label.includes(' ')) {
			const label = new_label.split(' ')[0];
			if (!labels.includes(label) && label.trim().length !== 0) {
				setLabels((prev) => {
					return [...prev, label];
				});
			}
			setNewTags('');
		}
	};

	const handleAssignTagsToNumbers = () => {
		const promise = PhoneBookService.assignTagsToNumbers(
			numbers,
			newTags.trim().length === 0 ? labels : [...labels, newTags.trim()]
		);

		toast.promise(promise, {
			success: 'Tags assigned successfully.',
			error: 'Failed to assign tags.',
			loading: 'Assigning tags...',
		});
	};

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
					Bulk Action
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-xl'>
				<DialogHeader>
					<DialogTitle>Upload CSV</DialogTitle>
				</DialogHeader>
				<Tabs defaultValue='CSV' className='w-full'>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='CSV'>Upload CSV</TabsTrigger>
						<TabsTrigger value='TAGS'>Assign Tags</TabsTrigger>
					</TabsList>
					<TabsContent value='CSV'>
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
									accept='.csv'
								/>
							</div>
							<div className='grid gap-2'>
								<Label className='text-primary' htmlFor='tags'>
									Tags (comma separated)<span className='ml-[0.2rem] text-red-800'>*</span>
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
					</TabsContent>
					<TabsContent value='TAGS'>
						<div>
							<Textarea
								value={numberInput}
								onChange={(e) => handleTextChange(e.target.value)}
								className='resize-none w-full h-[350px]'
							/>
							<div className='flex justify-center '>
								{isChanged ? (
									<p
										className='cursor-pointer underline underline-offset-2'
										onClick={handleFormatClicked}
									>
										Format Numbers
									</p>
								) : (
									<p className='cursor-pointer underline underline-offset-2'>
										{numbers.length} numbers provided.
									</p>
								)}
							</div>
						</div>
						<div className='flex flex-wrap gap-4 p-2 w-full'>
							<Each
								items={labels}
								render={(label, index) => (
									<Badge>
										{label}
										<IoClose
											className='w-4 h-4 ml-1 cursor-pointer'
											onClick={() => setLabels(labels.filter((_, i) => i !== index))}
										/>
									</Badge>
								)}
							/>
						</div>
						<div className='flex gap-2 items-center'>
							<div className='flex-1'>
								<Input value={newTags} onChange={handleNewLabelInput} placeholder='enter tags' />
							</div>
							<TagsSelector onChange={setLabels} selected={labels}>
								<Button variant='secondary' size={'icon'}>
									<ListFilter className='w-4 h-4' strokeWidth={3} />
								</Button>
							</TagsSelector>
						</div>
						<DialogFooter className='mt-2'>
							<DialogClose asChild>
								<Button variant='secondary'>Cancel</Button>
							</DialogClose>
							<DialogClose asChild>
								<Button disabled={isChanged} onClick={handleAssignTagsToNumbers}>
									Save
								</Button>
							</DialogClose>
						</DialogFooter>
					</TabsContent>
				</Tabs>
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
							Tags (comma separated)<span className='ml-[0.2rem] text-red-800'>*</span>
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
