import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { useRecipient } from '@/components/context/recipients';
import TagsSelector from '@/components/elements/popover/tags';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import MessagesService from '@/services/messages.service';
import { ListFilter } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
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
		if (!recipient?._id) {
			return;
		}
		setLoading(true);
		MessagesService.fetchConversationMessages(recipient?._id, {
			page: 1,
			limit: 1,
		})
			.then((data) => {
				setMessageLabels(data.messageLabels);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [recipient?._id]);

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
				loading: 'Assigning labels...',
				success: () => {
					onConfirm(selectedTags);
					onClose();
					return 'Labels assigned successfully';
				},
				error: 'Failed to assign labels',
			}
		);
	};

	return (
		<Dialog>
			<DialogTrigger ref={buttonRef} asChild>
				{children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>Assign Tags</DialogHeader>
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
						<Input
							value={newTags}
							onChange={(e) => setNewTags(e.target.value)}
							placeholder='eg. Customer'
						/>
					</div>
					<TagsSelector labels={messageLabels} onChange={handleAddTags}>
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
					</TagsSelector>
				</div>
				<DialogFooter>
					<Button onClick={handleSave}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
