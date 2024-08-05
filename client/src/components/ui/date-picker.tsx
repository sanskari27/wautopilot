'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function DatePicker({
	value,
	onChange,
	disablePreviousDates = false,
}: {
	value?: Date;
	onChange: (date?: Date) => void;
	disablePreviousDates?: boolean;
}) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'w-full justify-start text-left font-normal',
						!value && 'text-muted-foreground'
					)}
				>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{value ? format(value, 'PPP') : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0'>
				<Calendar
					mode='single'
					selected={value}
					onSelect={onChange}
					disabled={(date) =>
						disablePreviousDates ? date.getTime() < new Date().getTime() : false
					}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
