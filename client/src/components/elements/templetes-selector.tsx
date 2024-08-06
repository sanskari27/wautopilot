'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useTemplates } from '../context/templates';

export default function TemplatesSelector({
	placeholder,
	value,
	onChange,
}: {
	placeholder: string;
	value: string;
	onChange: (details: { id: string; name: string } | null) => void;
}) {
	const [open, setOpen] = React.useState(false);
	const items = useTemplates();
	const [search, setSearch] = React.useState('');

	const filteredItems = React.useMemo(() => {
		if (!search) return items;
		return items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
	}, [items, search]);

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
					<CommandInput
						placeholder='Search templates...'
						onValueChange={setSearch}
						value={search}
					/>
					<CommandEmpty>No templates found.</CommandEmpty>
					<CommandList>
						{filteredItems.map((item) => (
							<CommandItem
								key={item.name}
								value={item.name}
								onSelect={(currentValue) => {
									if (currentValue === value) {
										onChange(null);
										return;
									}
									onChange({
										id: item.id,
										name: item.name,
									});
								}}
								className={cn('cursor-pointer z-10')}
							>
								<Check
									className={cn('mr-2 h-4 w-4', value === item.name ? 'opacity-100' : 'opacity-0')}
								/>
								{item.name}
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
