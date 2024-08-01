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

const items = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function ComboboxWeekdays({
	placeholder,
	value,
	onChange,
}: {
	placeholder: string;
	value: string[];
	onChange: (value: string[]) => void;
}) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='w-full justify-between capitalize'
				>
					{value.length > 0 ? value.join(', ') : placeholder}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0'>
				<Command>
					<CommandInput placeholder='Search days...' />
					<CommandEmpty>No Days found.</CommandEmpty>
					<CommandList>
						<CommandGroup>
							<Each
								items={items}
								render={(item, index) => (
									<CommandItem
										key={index}
										value={item}
										onSelect={(currentValue) => {
											if (value.includes(currentValue)) {
												onChange(value.filter((v) => v !== currentValue));
											} else {
												onChange([...value, item]);
											}
										}}
										className={cn('cursor-pointer z-10')}
									>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												value.includes(item) ? 'opacity-100' : 'opacity-0'
											)}
										/>
										{item.charAt(0).toUpperCase() + item.slice(1)}
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
