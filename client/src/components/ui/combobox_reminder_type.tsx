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
import Each from '../containers/each';

export default function ComboboxReminder({
	placeholder,
	value,
	onChange,
	items,
}: {
	items: string[];
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
}) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='w-full justify-between'
				>
					{value ? value : placeholder}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0'>
				<Command>
					<CommandInput placeholder='Search Employee...' />
					<CommandEmpty>No employee found.</CommandEmpty>
					<CommandList>
						<CommandGroup>
							<Each
								items={items}
								render={(item) => (
									<CommandItem
										value={item}
										onSelect={(currentValue) => {
											if (currentValue === value) {
												onChange('');
												return;
											}
											onChange(currentValue);
										}}
										className={cn('cursor-pointer z-10')}
									>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												value.includes(item) ? 'opacity-100' : 'opacity-0'
											)}
										/>
										{item}
									</CommandItem>
								)}
							/>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
