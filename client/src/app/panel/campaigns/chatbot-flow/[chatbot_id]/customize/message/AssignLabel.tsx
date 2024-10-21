'use client';
import Each from '@/components/containers/each';
import TagsSelector from '@/components/elements/popover/tags';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ListFilter } from 'lucide-react';
import { useState } from 'react';
import { IoClose } from 'react-icons/io5';

export type AssignLabelProps = {
	onAssignLabelAdded: (labels: string[]) => void;
	children: React.ReactNode;
};

const AssignLabel = ({ onAssignLabelAdded, children }: AssignLabelProps) => {
	const [labels, setLabels] = useState<string[]>([]);

	const handleSave = () => {
		onAssignLabelAdded(labels);
	};

	return (
		<Dialog modal>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-2xl'>
				<DialogTitle>
					<DialogTitle>Assign Label</DialogTitle>
				</DialogTitle>
				<div className='max-h-[70vh] grid gap-2 overflow-y-auto px-0'>
					<div>
						<div className='flex items-center justify-between'>
							<p className='text-sm mt-2'>Use assign label to categorize the user.</p>
						</div>
						<div className='gap-2 flex items-center'>
							<div className='flex flex-wrap gap-2 border-dashed border-2 rounded-lg p-2 flex-1 min-h-11'>
								<Each
									items={labels}
									render={(label) => (
										<Badge className=''>
											{label}
											<IoClose
												onClick={() => setLabels((prev) => prev.filter((l) => l !== label))}
												className='w-4 h-4 cursor-pointer'
												strokeWidth={3}
											/>
										</Badge>
									)}
								/>
							</div>
							<TagsSelector onChange={setLabels}>
								<Button variant='secondary' size={'icon'}>
									<ListFilter className='w-4 h-4' strokeWidth={3} />
								</Button>
							</TagsSelector>
						</div>
					</div>
				</div>
				<Separator />
				<DialogFooter>
					<DialogClose asChild>
						<Button type='submit' disabled={labels.length === 0} onClick={handleSave}>
							Save
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

AssignLabel.displayName = 'TextMessage';

export default AssignLabel;
