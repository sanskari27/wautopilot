'use client';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function NumberInputDialog({
	children,
	onSubmit,
	defaultValue,
}: {
	children: React.ReactNode;
	onSubmit: (numbers: string[]) => void;
	defaultValue?: string[];
}) {
	const [numberInput, setNumberInput] = useState(defaultValue?.join('\n') || '');
	const [numbers, setNumbers] = useState<string[]>(defaultValue || []);
	const [isChanged, setChanged] = useState(false);

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

	const handleSave = () => {
		onSubmit(numbers);
		setNumberInput('');
		setNumbers([]);
	};
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent className='sm:max-w-[425px] md:max-w-xl lg:max-w-3xl'>
				<AlertDialogHeader>
					<AlertDialogTitle>Enter Phone Numbers</AlertDialogTitle>
				</AlertDialogHeader>
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
				<AlertDialogFooter>
					<AlertDialogAction onClick={handleSave} disabled={isChanged}>
						Save changes
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
