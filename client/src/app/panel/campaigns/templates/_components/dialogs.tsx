'use client';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {} from '@radix-ui/react-alert-dialog';
import { Link, MessageCircleReply, PhoneCall } from 'lucide-react';
import { useState } from 'react';

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
							onChange={(e) => setText(e.target.value)}
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
