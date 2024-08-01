'use client';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { ListFilter, MoveRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Each from '../containers/each';
import Show from '../containers/show';
import { useEmployees } from '../context/employees';
import { useOrganizationDetails } from '../context/organization-details';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button, buttonVariants } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { SearchBar } from '../ui/searchbar';

export default function SearchAndFilters({
	show_assigned_to = true,
	show_assigned_by = true,
}: {
	show_assigned_to?: boolean;
	show_assigned_by?: boolean;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [selectedFilter, setSelectedFilter] = useState('Category');
	const [searchText, setSearchText] = useState(searchParams.get('search') || '');
	const [frequency, setFrequency] = useState(searchParams.get('frequency') || '');
	const [priority, setPriority] = useState(searchParams.get('priority') || '');
	const [categories, setCategories] = useState(searchParams.get('categories')?.split(',') || []);
	const [createdBy, setCreatedBy] = useState(searchParams.get('created_by')?.split(',') || []);
	const [assigned_to, setAssignedTo] = useState(searchParams.get('assigned_to')?.split(',') || []);

	useEffect(() => {
		const url = new URL((window as any).location);
		setSearchText(url.searchParams.get('search') || '');
		setCategories(url.searchParams.get('categories')?.split(',') || []);
	}, []);

	function handleSearch(text: string) {
		setSearchText(text);
		const url = new URL((window as any).location);
		if (text !== '') {
			url.searchParams.set('search', text);
		} else {
			url.searchParams.delete('search');
		}
		if (frequency !== '') {
			url.searchParams.set('frequency', frequency);
		} else {
			url.searchParams.delete('frequency');
		}
		if (priority !== '') {
			url.searchParams.set('priority', priority);
		} else {
			url.searchParams.delete('priority');
		}
		if (categories.length > 0) {
			url.searchParams.set('categories', categories.join(','));
		} else {
			url.searchParams.delete('categories');
		}
		if (createdBy.length > 0) {
			url.searchParams.set('created_by', createdBy.join(','));
		} else {
			url.searchParams.delete('created_by');
		}
		if (assigned_to.length > 0) {
			url.searchParams.set('assigned_to', assigned_to.join(','));
		} else {
			url.searchParams.delete('assigned_to');
		}
		router.push(url.toString());
	}

	function applyFilters() {
		const url = new URL((window as any).location);
		if (searchText !== '') {
			url.searchParams.set('search', searchText);
		} else {
			url.searchParams.delete('search');
		}
		if (frequency !== '') {
			url.searchParams.set('frequency', frequency);
		} else {
			url.searchParams.delete('frequency');
		}
		if (priority !== '') {
			url.searchParams.set('priority', priority);
		} else {
			url.searchParams.delete('priority');
		}
		if (categories.length > 0) {
			url.searchParams.set('categories', categories.join(','));
		} else {
			url.searchParams.delete('categories');
		}
		if (createdBy.length > 0) {
			url.searchParams.set('created_by', createdBy.join(','));
		} else {
			url.searchParams.delete('created_by');
		}
		if (assigned_to.length > 0) {
			url.searchParams.set('assigned_to', assigned_to.join(','));
		} else {
			url.searchParams.delete('assigned_to');
		}

		router.push(url.toString());
		buttonRef.current?.click();
	}

	function resetFilters() {
		setSearchText('');
		setFrequency('');
		setPriority('');
		setCategories([]);
		setCreatedBy([]);
		setAssignedTo([]);
		const url = new URL((window as any).location);
		url.searchParams.delete('search');
		url.searchParams.delete('frequency');
		url.searchParams.delete('priority');
		url.searchParams.delete('categories');
		url.searchParams.delete('created_by');
		url.searchParams.delete('assigned_to');
		router.push(url.toString());
		buttonRef.current?.click();
	}

	function addCategoryFilter(category: string) {
		setCategories((prev) => [...prev, category]);
	}
	function removeCategoryFilter(category: string) {
		setCategories((prev) => prev.filter((c) => c !== category));
	}

	function addAssignedByFilter(employeeId: string) {
		setCreatedBy((prev) => [...prev, employeeId]);
	}
	function removeAssignedByFilter(employeeId: string) {
		setCreatedBy((prev) => prev.filter((e) => e !== employeeId));
	}

	function addAssignedToFilter(employeeId: string) {
		setAssignedTo((prev) => [...prev, employeeId]);
	}
	function removeAssignedToFilter(employeeId: string) {
		setAssignedTo((prev) => prev.filter((e) => e !== employeeId));
	}

	return (
		<div className='flex justify-end items-center gap-3'>
			<div className='min-w-[300px] md:min-w-[450px] '>
				<SearchBar
					placeholders={['Search by task name', 'Search by task description']}
					onSubmit={handleSearch}
				/>
			</div>
			<Dialog>
				<DialogTrigger
					className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'h-12 w-12 ')}
					ref={buttonRef}
				>
					<ListFilter size={'1rem'} />
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Select Filters</DialogTitle>
					</DialogHeader>
					<div className='flex  gap-3 border border-gray-700 rounded-2xl overflow-hidden'>
						<div className='w-[250px] border-r border-gray-700'>
							<FilterType
								text='Category'
								isActive={selectedFilter === 'Category'}
								setSelectedFilter={setSelectedFilter}
							/>
							<Show>
								<Show.When condition={show_assigned_by}>
									<FilterType
										text='Assigned By'
										isActive={selectedFilter === 'Assigned By'}
										setSelectedFilter={setSelectedFilter}
									/>
								</Show.When>
							</Show>
							<Show>
								<Show.When condition={show_assigned_to}>
									<FilterType
										text='Assigned To'
										isActive={selectedFilter === 'Assigned To'}
										setSelectedFilter={setSelectedFilter}
									/>
								</Show.When>
							</Show>
							<FilterType
								text='Frequency'
								isActive={selectedFilter === 'Frequency'}
								setSelectedFilter={setSelectedFilter}
							/>
							<FilterType
								text='Priority'
								isActive={selectedFilter === 'Priority'}
								setSelectedFilter={setSelectedFilter}
							/>
						</div>
						<div className='w-full h-[500px] overflow-y-hidden py-2'>
							{selectedFilter === 'Category' && (
								<CategoryFilter
									selected={categories}
									onSelected={addCategoryFilter}
									onUnselected={removeCategoryFilter}
								/>
							)}
							{selectedFilter === 'Assigned By' && (
								<EmployeeFilter
									selected={createdBy}
									onSelected={addAssignedByFilter}
									onUnselected={removeAssignedByFilter}
								/>
							)}
							{selectedFilter === 'Assigned To' && (
								<EmployeeFilter
									selected={assigned_to}
									onSelected={addAssignedToFilter}
									onUnselected={removeAssignedToFilter}
								/>
							)}
							{selectedFilter === 'Frequency' && (
								<FrequencyFilter selected={frequency} onSelected={setFrequency} />
							)}
							{selectedFilter === 'Priority' && (
								<PriorityFilter selected={priority} onSelected={setPriority} />
							)}
						</div>
					</div>

					<DialogFooter>
						<Button variant={'outline'} className=' mt-6 w-[96%] mx-[2%]' onClick={resetFilters}>
							Clear
						</Button>
						<Button className=' mt-6 w-[96%] mx-[2%]' onClick={applyFilters}>
							Apply
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export function DateFilters() {
	const router = useRouter();
	const [selectedTag, setTag] = useState('Today');

	const [startDate, setStartDate] = useState<Date>();
	const [endDate, setEndDate] = useState<Date>();

	function applyFilters(start_date: string, end_date: string) {
		const url = new URL((window as any).location);

		if (start_date === '' && end_date === '') {
			url.searchParams.delete('start_date');
			url.searchParams.delete('end_date');
		} else {
			url.searchParams.set('start_date', start_date);
			url.searchParams.set('end_date', end_date);
		}

		router.push(url.toString());
	}

	function setSelectedTag(tag: string) {
		setTag(tag);
		const now = new Date();
		let start_date = new Date(now);
		let end_date = new Date(now);

		switch (tag) {
			case 'All Time':
				applyFilters('', '');
				return;
			case 'Today':
				start_date.setHours(0, 0, 0, 0);
				end_date.setHours(23, 59, 59, 999);
				break;
			case 'Tomorrow':
				start_date.setDate(start_date.getDate() + 1);
				start_date.setHours(0, 0, 0, 0);
				end_date = new Date(start_date);
				end_date.setHours(23, 59, 59, 999);
				break;
			case 'Yesterday':
				start_date.setDate(start_date.getDate() - 1);
				start_date.setHours(0, 0, 0, 0);
				end_date = new Date(start_date);
				end_date.setHours(23, 59, 59, 999);
				break;
			case 'This Week':
				start_date.setDate(start_date.getDate() - start_date.getDay());
				start_date.setHours(0, 0, 0, 0);
				end_date = new Date(start_date);
				end_date.setDate(end_date.getDate() + 6);
				end_date.setHours(23, 59, 59, 999);
				break;
			case 'Last Week':
				start_date.setDate(start_date.getDate() - start_date.getDay() - 7);
				start_date.setHours(0, 0, 0, 0);
				end_date = new Date(start_date);
				end_date.setDate(end_date.getDate() + 6);
				end_date.setHours(23, 59, 59, 999);
				break;
			case 'Next Week':
				start_date.setDate(start_date.getDate() - start_date.getDay() + 7);
				start_date.setHours(0, 0, 0, 0);
				end_date = new Date(start_date);
				end_date.setDate(end_date.getDate() + 6);
				end_date.setHours(23, 59, 59, 999);
				break;
			case 'This Month':
				start_date.setDate(1);
				start_date.setHours(0, 0, 0, 0);
				end_date = new Date(
					start_date.getFullYear(),
					start_date.getMonth() + 1,
					0,
					23,
					59,
					59,
					999
				);
				break;
			case 'Last Month':
				start_date = new Date(start_date.getFullYear(), start_date.getMonth() - 1, 1, 0, 0, 0, 0);
				end_date = new Date(
					start_date.getFullYear(),
					start_date.getMonth() + 1,
					0,
					23,
					59,
					59,
					999
				);
				break;
			case 'Next Month':
				start_date = new Date(start_date.getFullYear(), start_date.getMonth() + 1, 1, 0, 0, 0, 0);
				end_date = new Date(
					start_date.getFullYear(),
					start_date.getMonth() + 1,
					0,
					23,
					59,
					59,
					999
				);
				break;
			default:
				return;
		}
		setStartDate(start_date);
		setEndDate(end_date);
		applyFilters(start_date.toISOString(), end_date.toISOString());
	}

	function Chip({
		text,
		isActive,
		setSelectedTag,
	}: {
		text: string;
		isActive: boolean;
		setSelectedTag: (text: string) => void;
	}) {
		return (
			<Badge
				variant='outline'
				className={cn(
					'px-4 py-2 cursor-pointer select-none',
					isActive && 'bg-primary text-primary-foreground'
				)}
				onClick={() => setSelectedTag(text)}
			>
				{text}
			</Badge>
		);
	}

	return (
		<div className='max-w-sm  md:max-w-lg lg:max-w-screen-2xl mx-auto'>
			<div className='flex flex-wrap justify-center gap-3'>
				<Chip text='Today' isActive={selectedTag === 'Today'} setSelectedTag={setSelectedTag} />
				<Chip
					text='Tomorrow'
					isActive={selectedTag === 'Tomorrow'}
					setSelectedTag={setSelectedTag}
				/>
				<Chip
					text='Yesterday'
					isActive={selectedTag === 'Yesterday'}
					setSelectedTag={setSelectedTag}
				/>
				<Chip
					text='This Week'
					isActive={selectedTag === 'This Week'}
					setSelectedTag={setSelectedTag}
				/>
				<Chip
					text='Last Week'
					isActive={selectedTag === 'Last Week'}
					setSelectedTag={setSelectedTag}
				/>
				<Chip
					text='Next Week'
					isActive={selectedTag === 'Next Week'}
					setSelectedTag={setSelectedTag}
				/>
				<Chip
					text='This Month'
					isActive={selectedTag === 'This Month'}
					setSelectedTag={setSelectedTag}
				/>
				<Chip
					text='Last Month'
					isActive={selectedTag === 'Last Month'}
					setSelectedTag={setSelectedTag}
				/>
				<Chip
					text='Next Month'
					isActive={selectedTag === 'Next Month'}
					setSelectedTag={setSelectedTag}
				/>
				<Chip
					text='All Time'
					isActive={selectedTag === 'All Time'}
					setSelectedTag={setSelectedTag}
				/>
				<Chip text='Custom' isActive={selectedTag === 'Custom'} setSelectedTag={setSelectedTag} />
			</div>
			<Show>
				<Show.When condition={selectedTag === 'Custom'}>
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
									<Calendar
										mode='single'
										selected={startDate}
										onSelect={setStartDate}
										initialFocus
									/>
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
						<div>
							<Button
								variant={'default'}
								className={cn(
									' justify-start text-left font-normal',
									(!startDate || !endDate) && 'text-muted-foreground'
								)}
								onClick={() =>
									applyFilters(startDate?.toISOString() || '', endDate?.toISOString() || '')
								}
							>
								Apply
							</Button>
						</div>
					</div>
				</Show.When>
			</Show>
		</div>
	);
}

function FilterType({
	text,
	isActive,
	setSelectedFilter,
}: {
	text: string;
	isActive: boolean;
	setSelectedFilter: (text: string) => void;
}) {
	return (
		<div
			className={cn(
				'flex items-center pl-4 py-3 font-medium cursor-pointer',
				isActive && 'border-l-4 border-primary'
			)}
			onClick={() => setSelectedFilter(text)}
		>
			<span>{text}</span>
		</div>
	);
}

function CategoryFilter({
	selected,
	onSelected,
	onUnselected,
}: {
	selected: string[];
	onSelected: (category: string) => void;
	onUnselected: (category: string) => void;
}) {
	const { categories: list } = useOrganizationDetails();
	const [searchText, setSearchText] = useState('');

	const filteredList = list.filter((category) =>
		category.toLowerCase().includes(searchText.toLowerCase())
	);

	return (
		<>
			<Input
				type='text'
				placeholder='Search categories'
				className='w-[95%]'
				value={searchText}
				onChange={(e) => setSearchText(e.target.value)}
			/>
			<div className='flex flex-col gap-2  h-[430px] overflow-y-scroll mt-3'>
				<Each
					items={filteredList}
					render={(category) => (
						<div className='flex items-center gap-3'>
							<input
								type='checkbox'
								checked={selected.includes(category)}
								onChange={(e) => {
									if (e.target.checked) {
										onSelected(category);
									} else {
										onUnselected(category);
									}
								}}
							/>
							<span>{category}</span>
						</div>
					)}
				/>
			</div>
		</>
	);
}

function EmployeeFilter({
	selected,
	onSelected,
	onUnselected,
}: {
	selected: string[];
	onSelected: (category: string) => void;
	onUnselected: (category: string) => void;
}) {
	const list = useEmployees();
	const [searchText, setSearchText] = useState('');

	const filteredList = list.filter((e) => e.name.toLowerCase().includes(searchText.toLowerCase()));

	return (
		<>
			<Input
				type='text'
				placeholder='Search peoples...'
				className='w-[95%]'
				value={searchText}
				onChange={(e) => setSearchText(e.target.value)}
			/>
			<div className='flex flex-col gap-2  h-[430px] overflow-y-scroll mt-3'>
				<Each
					items={filteredList}
					render={(item) => (
						<div className='flex items-center gap-3'>
							<div className='flex items-center gap-2'>
								<div
									className='cursor-pointer'
									onClick={() => {
										if (selected.includes(item.id)) {
											onUnselected(item.id);
										} else {
											onSelected(item.id);
										}
									}}
								>
									<Show>
										<Show.When condition={!selected.includes(item.id)}>
											<Avatar>
												<AvatarFallback>
													{item.name
														.toUpperCase()
														.split(' ')
														.map((n) => n[0])
														.join('')}
												</AvatarFallback>
											</Avatar>
										</Show.When>
										<Show.Else>
											<div className='flex items-center justify-center dark:bg-gray-200 dark:text-black bg-gray-600 text-white rounded-full w-10 h-10'>
												{item.name
													.toUpperCase()
													.split(' ')
													.map((n) => n[0])
													.join('')}
											</div>
										</Show.Else>
									</Show>
								</div>
								<span>{item.name}</span>
							</div>
						</div>
					)}
				/>
			</div>
		</>
	);
}

function FrequencyFilter({
	selected,
	onSelected,
}: {
	selected: string;
	onSelected: (frequency: string) => void;
}) {
	return (
		<>
			<div className='flex flex-col gap-2  h-[430px] overflow-y-scroll mt-3'>
				<p>Select Frequency</p>
				<Each
					items={[
						{ name: 'Once', value: '' },
						{ name: 'Daily', value: 'daily' },
						{ name: 'Weekly', value: 'weekly' },
						{ name: 'Monthly', value: 'monthly' },
					]}
					render={(item) => (
						<div className='flex items-center gap-3' onClick={() => onSelected(item.value)}>
							<input
								type='radio'
								checked={selected === item.value}
								onChange={() => onSelected(item.value)}
							/>
							<span>{item.name}</span>
						</div>
					)}
				/>
			</div>
		</>
	);
}

function PriorityFilter({
	selected,
	onSelected,
}: {
	selected: string;
	onSelected: (priority: string) => void;
}) {
	return (
		<>
			<div className='flex flex-col gap-2  h-[430px] overflow-y-scroll mt-3'>
				<p>Select Frequency</p>
				<Each
					items={[
						{ name: 'High', value: 'high' },
						{ name: 'Medium', value: 'medium' },
						{ name: 'Low', value: 'low' },
					]}
					render={(item) => (
						<div className='flex items-center gap-3' onClick={() => onSelected(item.value)}>
							<input
								type='radio'
								checked={selected === item.value}
								onChange={() => onSelected(item.value)}
							/>
							<span>{item.name}</span>
						</div>
					)}
				/>
			</div>
		</>
	);
}
