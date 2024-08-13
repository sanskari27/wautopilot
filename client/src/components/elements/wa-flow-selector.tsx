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
import { useWhatsappFlows } from '../context/whatsappFlows';

export default function WhatsappFlowSelector({
	placeholder,
	value,
	onChange,
	publishedOnly = true,
}: {
	placeholder: string;
	value: string;
	onChange: (details: { id: string; name: string }) => void;
	publishedOnly?: boolean;
}) {
	const [open, setOpen] = React.useState(false);
	let items = useWhatsappFlows();

	if (publishedOnly) {
		items = items.filter((item) => item.status === 'PUBLISHED');
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='w-full justify-between'
				>
					{value ? items.find((item) => item.id === value)?.name ?? placeholder : placeholder}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0'>
				<Command>
					<CommandInput placeholder={placeholder} />
					<CommandEmpty>No Whatsapp Flow found.</CommandEmpty>
					<CommandList>
						<CommandGroup>
							<Each
								items={items}
								render={(item) => (
									<CommandItem
										key={item.id}
										value={item.id}
										onSelect={() => {
											onChange({
												id: item.id,
												name: item.name,
											});
										}}
										className={cn('cursor-pointer z-10')}
									>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												value === item.id ? 'opacity-100' : 'opacity-0'
											)}
										/>
										{item.name}
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
