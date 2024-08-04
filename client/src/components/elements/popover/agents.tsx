'use client';
import Each from '@/components/containers/each';
import { useAgents } from '@/components/context/agents';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function AgentSelector({
	children,
	selected = [],
	onSubmit = () => {},
	isMultiSelect = true,
}: {
	children: React.ReactNode;
	selected?: string[];
	onSubmit?: (selected: string[]) => void;
	isMultiSelect?: boolean;
}) {
	const [selectedTags, setSelectedTags] = useState<string[]>(selected);
	const agents = useAgents();

	return (
		<Popover>
			<PopoverTrigger asChild>
				<div>{children}</div>
			</PopoverTrigger>
			<PopoverContent className='w-80'>
				<div className='grid gap-4'>
					<div className='flex justify-between items-center'>
						<p className='underline cursor-pointer' onClick={() => setSelectedTags([])}>
							Clear
						</p>
						<h4 className='font-medium leading-none'>Select Agent</h4>
						<PopoverClose asChild>
							<X className='w-6 h-6 cursor-pointer' />
						</PopoverClose>
					</div>

					<Each
						items={agents}
						render={({ id, name }) => (
							<div key={id} className='flex items-center space-x-2'>
								<Checkbox
									id={id}
									checked={selectedTags.includes(id)}
									onCheckedChange={(e) => {
										if (!isMultiSelect) {
											setSelectedTags(Boolean(e) ? [id] : []);
											return;
										}

										const _tags = Boolean(e)
											? [...selectedTags, id]
											: selectedTags.filter((tag) => tag !== id);
										setSelectedTags(_tags);
									}}
								/>
								<label htmlFor={id} className='text-sm font-medium leading-none'>
									{name}
								</label>
							</div>
						)}
					/>
				</div>
				<PopoverClose asChild>
					<Button
						className='w-full mt-3'
						onClick={() => {
							onSubmit(selectedTags);
							setSelectedTags([]);
						}}
						size={'sm'}
						disabled={selectedTags.length === 0 || (selectedTags.length > 1 && !isMultiSelect)}
					>
						Submit
					</Button>
				</PopoverClose>
			</PopoverContent>
		</Popover>
	);
}
