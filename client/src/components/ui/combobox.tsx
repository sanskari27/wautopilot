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

export default function Combobox({
	placeholder,
	items,
	value,
	disabled,
	onChange,
}: {
	placeholder: string;
	items: { value: string; label: string }[];
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					disabled={disabled}
					aria-expanded={open}
					className='w-full justify-between'
				>
					{value ? items.find((e) => e.value === value)?.label ?? placeholder : placeholder}
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
										onChange(currentValue === value ? '' : currentValue);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4 ',
											value === framework.value ? 'opacity-100' : 'opacity-0'
										)}
									/>
									{framework.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
