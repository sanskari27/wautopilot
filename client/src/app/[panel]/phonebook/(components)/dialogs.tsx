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
import { Library, Tags } from 'lucide-react';
import { useState } from 'react';
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
						<Button onClick={submit}>Save changes</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
