import Each from '@/components/containers/each';
import { useRecipient } from '@/components/context/recipients';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ComboboxMultiselect from '@/components/ui/combobox-multiselect';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import MessagesService from '@/services/messages.service';
import UserService from '@/services/users.service';
import { Plus } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';

export default function AssignMessageLabelDialog({
	id,
	children,
	onConfirm,
	selected,
}: {
	id: string;
	children: React.ReactNode;
	selected: string[];
	onConfirm: (labels: string[]) => void;
}) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const { selected_recipient: recipient } = useRecipient();

	const [selectedTags, setSelectedTags] = React.useState<string[]>(selected);
	const [messageLabels, setMessageLabels] = React.useState<string[]>([]);
	const [newTags, setNewTags] = React.useState<string>('');
	const [loading, setLoading] = React.useState<boolean>(false);

	useEffect(() => {
		setSelectedTags(selected);
	}, [selected]);

	useEffect(() => {
		if (!recipient?.id) {
			return;
		}
		setLoading(true);
		UserService.listMessageTags()
			.then((data) => {
				setMessageLabels(data);
			})
			.catch(() => {
				toast.error('Failed to fetch message labels');
			})
			.finally(() => {
				setLoading(false);
			});
	}, [recipient?.id]);

	const handleAddRemoveTags = (tags: string[]) => {
		const _tags = tags.filter((tag) => {
			if (selectedTags.includes(tag)) {
				return false;
			}
			return true;
		});
		setSelectedTags([...selectedTags, ..._tags]);
	};

	const handleAddTags = (tags: string[]) => {
		const _tags = tags.filter((tag) => {
			if (selectedTags.includes(tag)) {
				return false;
			}
			return true;
		});
		setSelectedTags([...selectedTags, ..._tags]);
	};

	const removeTags = (tag: string) => {
		setSelectedTags((prev) => {
			return prev.filter((t) => t !== tag);
		});
	};

	const onClose = () => {
		setSelectedTags([]);
		buttonRef.current?.click();
	};

	const handleSave = () => {
		toast.promise(
			MessagesService.assignMessageLabels(
				id,
				newTags.trim().length !== 0 ? [...selectedTags, newTags.trim()] : selectedTags
			),
			{
				loading: 'Assigning tags...',
				success: () => {
					onConfirm(selectedTags);
					onClose();
					return 'Tags assigned successfully';
				},
				error: 'Failed to assign tags',
			}
		);
	};

	const handleAddNewTags = () => {
		const newMessageTags = newTags.split(',').map((tag) => tag.trim());
		toast.promise(UserService.createMessageTags([...selectedTags, ...newMessageTags]), {
			loading: 'Adding new tags...',
			success: (data) => {
				setMessageLabels(data);
				setNewTags('');
				return 'Tags added successfully';
			},
			error: 'Failed to add tags',
		});
	};

	return (
		<Dialog>
			<DialogTrigger ref={buttonRef} asChild>
				{children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Assign Message Tags</DialogTitle>
				</DialogHeader>
				<div className='flex flex-wrap border-2 p-2 rounded-lg'>
					<Each
						items={selectedTags}
						render={(tag) => (
							<Badge key={tag} className='mr-2'>
								{tag}
								<IoClose onClick={() => removeTags(tag)} className='w-4 h-4 cursor-pointer' />
							</Badge>
						)}
					/>
				</div>
				<div className='flex gap-2'>
					<div className='flex-1'>
						<ComboboxMultiselect
							items={messageLabels.map((tag) => {
								return {
									value: tag,
									label: tag,
								};
							})}
							onChange={(tags) => handleAddRemoveTags(tags as string[])}
							value={selectedTags}
							placeholder='Select message tags'
						>
							<div className='flex gap-2'>
								<div className='flex-1'>
									<Input
										value={newTags}
										onChange={(e) => setNewTags(e.target.value)}
										placeholder='Add new tags'
									/>
								</div>
								<Button onClick={handleAddNewTags}>
									<Plus />
								</Button>
							</div>
						</ComboboxMultiselect>
					</div>
					{/* <TagsSelector labels={messageLabels} onChange={handleAddTags}>
						<Button variant='secondary' size={'icon'} disabled={loading}>
							<Show>
								<Show.When condition={loading}>
									<FaSpinner />
								</Show.When>
								<Show.Else>
									<ListFilter className='w-4 h-4' strokeWidth={3} />
								</Show.Else>
							</Show>
						</Button>
					</TagsSelector> */}
				</div>
				<DialogFooter>
					<Button onClick={handleSave}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
