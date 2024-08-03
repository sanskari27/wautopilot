'use client';
import Each from '@/components/containers/each';
import { useAgents } from '@/components/context/agents';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AgentSelector({
	children,
	selected = [],
	onChange = () => {},
	onClose = () => {},
	isMultiSelect = true,
}: {
	children: React.ReactNode;
	selected?: string[];
	onChange?: (selected: string[]) => void;
	onClose?: (selected: string[]) => void;
	isMultiSelect?: boolean;
}) {
	const [selectedTags, setSelectedTags] = useState<string[]>(selected);
	const agents = useAgents();

	useEffect(() => {
		setSelectedTags(selected);
	}, [selected]);

	return (
		<Popover
			onOpenChange={(open) => {
				if (!open) {
					onClose(selectedTags);
				}
			}}
		>
			<PopoverTrigger asChild>
				<div>{children}</div>
			</PopoverTrigger>
			<PopoverContent className='w-80'>
				<div className='grid gap-4'>
					<div className='flex justify-between items-center'>
						<p
							className='underline cursor-pointer'
							onClick={() => {
								setSelectedTags([]);
								onChange([]);
							}}
						>
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
											onChange([id]);
											return;
										}

										const _tags = Boolean(e)
											? [...selectedTags, id]
											: selectedTags.filter((tag) => tag !== id);
										setSelectedTags(_tags);
										onChange(_tags);
									}}
								/>
								<label htmlFor={id} className='text-sm font-medium leading-none'>
									{name}
								</label>
							</div>
						)}
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}
