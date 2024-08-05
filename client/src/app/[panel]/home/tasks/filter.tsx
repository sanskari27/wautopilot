'use client';
import Each from '@/components/containers/each';
import { useAgents } from '@/components/context/agents';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, getInitials } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, MoveRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function FilterAgent() {
	const router = useRouter();
	const agents = useAgents();
	const [selectedAgent, setSelected] = useState<string>('me');

	useEffect(() => {
		const url = new URL((window as any).location);
		setSelected(url.searchParams.get('agent') || 'me');
	}, []);

	function setSelectedAgent(text: string) {
		setSelected(text);
		const url = new URL((window as any).location);
		url.searchParams.set('agent', text);
		router.push(url.toString());
	}

	return (
		<div className='border border-dashed border-gray-700 p-2 rounded-full'>
			<div className='gap-4 flex-wrap flex'>
				<Badge
					className={cn(
						'rounded-full cursor-pointer',
						selectedAgent === 'me' ? 'bg-green-500' : 'bg-gray-300',
						selectedAgent === 'me' ? 'text-white' : 'text-black'
					)}
					onClick={() => setSelectedAgent('me')}
				>
					<Avatar className='h-6 w-6 -ml-1 mr-2'>
						<AvatarFallback className={'text-black'}>Me</AvatarFallback>
					</Avatar>
					<span className='font-bold'>Me</span>
				</Badge>
				<Each
					items={agents}
					render={(item) => (
						<Badge
							className={cn(
								'rounded-full cursor-pointer',
								selectedAgent === item.id ? 'bg-green-500' : 'bg-gray-300',
								selectedAgent === item.id ? 'text-white' : 'text-black'
							)}
							onClick={() => setSelectedAgent(item.id)}
						>
							<Avatar className='h-6 w-6 -ml-1 mr-2'>
								<AvatarFallback className={'text-black '}>
									{getInitials(item.name) || 'NA'}
								</AvatarFallback>
							</Avatar>
							<span className='font-bold'>{item.name}</span>
						</Badge>
					)}
				/>
			</div>
		</div>
	);
}

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
