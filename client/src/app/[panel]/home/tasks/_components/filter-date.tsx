'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, MoveRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function FilterDate() {
	const router = useRouter();
	const [startDate, setStartDate] = useState<Date | undefined>(
		new Date(new Date().setFullYear(new Date().getFullYear() - 1))
	);
	const [endDate, setEndDate] = useState<Date | undefined>(new Date());

	const [showHidden, setShowHidden] = useState(false);

	useEffect(() => {
		const url = new URL((window as any).location);
		const startDate = url.searchParams.get('start');
		const endDate = url.searchParams.get('end');

		setStartDate(
			startDate
				? new Date(startDate)
				: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
		);
		setEndDate(endDate ? new Date(endDate) : new Date());
		setShowHidden(url.searchParams.get('hidden') === 'true' || false);
	}, []);

	useEffect(() => {
		const url = new URL((window as any).location);
		if (startDate) {
			url.searchParams.set('start', startDate.toISOString());
		} else {
			url.searchParams.delete('start');
		}
		if (endDate) {
			url.searchParams.set('end', endDate.toISOString());
		} else {
			url.searchParams.delete('end');
		}
		url.searchParams.set('hidden', showHidden ? 'true' : 'false');
		router.push(url.toString());
	}, [startDate, endDate, showHidden, router]);

	return (
		<div className='flex justify-between items-center'>
			<p
				className='text-right font-medium text-sm underline cursor-pointer select-none'
				onClick={() => setShowHidden((prev) => !prev)}
			>
				{showHidden ? 'Hide Completed' : 'Show Completed'}
			</p>
			<div className='flex items-center gap-3'>
				<div className='flex justify-center gap-3 mt-3 items-center'>
					<div>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={'outline'}
									className={cn(
										'w-[240px] justify-start text-left font-normal',
										!startDate && 'text-muted-foreground'
									)}
								>
									<CalendarIcon className='mr-2 h-4 w-4' />
									{startDate ? format(startDate, 'PPP') : <span>Pick start date</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-auto p-0' align='start'>
								<Calendar mode='single' selected={startDate} onSelect={setStartDate} initialFocus />
							</PopoverContent>
						</Popover>
					</div>
					<span>
						<MoveRight />
					</span>
					<div>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={'outline'}
									className={cn(
										'w-[240px] justify-start text-left font-normal',
										!endDate && 'text-muted-foreground'
									)}
								>
									<CalendarIcon className='mr-2 h-4 w-4' />
									{endDate ? format(endDate, 'PPP') : <span>Pick end date</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-auto p-0' align='start'>
								<Calendar mode='single' selected={endDate} onSelect={setEndDate} initialFocus />
							</PopoverContent>
						</Popover>
					</div>
				</div>
			</div>
		</div>
	);
}
