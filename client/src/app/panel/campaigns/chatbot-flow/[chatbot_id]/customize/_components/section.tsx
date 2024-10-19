'use client';
import Each from '@/components/containers/each';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { randomString } from '@/lib/utils';
import { X } from 'lucide-react';
import { useState } from 'react';

export function ListButtons({
	buttons,
	onRemove,
}: {
	buttons: { id: string; text: string }[];
	onRemove: (id: string, index: number) => void;
}) {
	return (
		<div className='flex flex-col gap-2'>
			<Each
				items={buttons}
				render={(button, index) => (
					<div className='bg-gray-50 py-1 px-2 rounded-lg relative border border-gray-300'>
						{button.text}
						<X
							className='w-5 h-5 bg-red-500 p-1 text-white rounded-full absolute right-1 top-[50%] -translate-y-[50%]  cursor-pointer'
							onClick={() => onRemove(button.id, index)}
						/>
					</div>
				)}
			/>
		</div>
	);
}

export function AddSection({
	isDisabled,
	onSubmit,
	placeholder = 'Enter section text here. \nex. Cart action.',
}: {
	isDisabled?: boolean;
	onSubmit: (data: { id: string; text: string }) => void;
	placeholder?: string;
}) {
	const [sectionText, setButtonText] = useState('');

	return (
		<div className='flex gap-3 items-end'>
			<div className='flex-1'>
				<Label>Section text ({sectionText.length}/20)</Label>
				<div className='flex-1'>
					<Input
						placeholder={placeholder}
						value={sectionText}
						onChange={(e) => setButtonText(e.target.value.substring(0, 20))}
					/>
				</div>
			</div>
			<div>
				<Button
					disabled={isDisabled || sectionText.length > 20}
					onClick={() => {
						if (!sectionText || sectionText.length > 20) return;
						onSubmit({ id: randomString(), text: sectionText });
						setButtonText('');
					}}
				>
					+ Add
				</Button>
			</div>
		</div>
	);
}
