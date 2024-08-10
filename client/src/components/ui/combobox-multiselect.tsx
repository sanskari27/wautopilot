'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function ComboboxMultiselect({
	placeholder,
	items,
	value,
	disabled,
	onChange,
	buttonVariant = 'outline',
}: {
	placeholder: string;
	items: { value: string; label: string }[];
	value: string[];
	onChange: (value: string[]) => void;
	disabled?: boolean;
	buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={buttonVariant}
					role='combobox'
					disabled={disabled}
					aria-expanded={open}
					className='w-full justify-between'
				>
					{value.length > 0
						? value
								.map(
									(v) =>
										items
											.find((e) => e.value === v)
											?.label.split('_')
											.join(' ') ?? ''
								)
								.join(', ')
						: placeholder}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='min-w-max p-0' align='start'>
				<Command>
					<CommandInput placeholder={placeholder} />
					<CommandEmpty>No entries found.</CommandEmpty>
					<CommandList>
						<CommandGroup>
							{items.map((framework) => (
								<CommandItem
									key={framework.value}
									value={framework.value}
									onSelect={(currentValue) => {
										if (value.includes(currentValue)) {
											onChange(value.filter((v) => v !== currentValue));
										} else {
											onChange([...value, currentValue]);
										}
									}}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4 ',
											value.includes(framework.value) ? 'text-primary' : 'text-gray-300'
										)}
									/>
									{framework.label.split('_').join(' ')}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
