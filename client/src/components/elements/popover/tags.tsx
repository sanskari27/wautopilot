'use client';
import Each from '@/components/containers/each';
import { useTags } from '@/components/context/tags';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function TagsSelector({
	children,
	selected = [],
	onChange = () => {},
	onClose = () => {},
}: {
	children: React.ReactNode;
	selected?: string[];
	onChange?: (selected: string[]) => void;
	onClose?: (selected: string[]) => void;
}) {
	const [selectedTags, setSelectedTags] = useState<string[]>(selected);
	const labels = useTags();

	return (
		<Popover
			onOpenChange={(open) => {
				if (!open) {
					onClose(selectedTags);
				}
			}}
		>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
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
						<h4 className='font-medium leading-none'>Select Tags</h4>
						<PopoverClose asChild>
							<X className='w-6 h-6 cursor-pointer' />
						</PopoverClose>
					</div>

					<Each
						items={labels}
						render={(label) => (
							<div key={label} className='flex items-center space-x-2'>
								<Checkbox
									id={label}
									checked={selectedTags.includes(label)}
									onCheckedChange={(e) => {
										const _tags = Boolean(e)
											? [...selectedTags, label]
											: selectedTags.filter((tag) => tag !== label);
										setSelectedTags(_tags);
										onChange(_tags);
									}}
								/>
								<label htmlFor={label} className='text-sm font-medium leading-none'>
									{label}
								</label>
							</div>
						)}
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}
