import Each from '@/components/containers/each';
import TagsSelector from '@/components/elements/popover/tags';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import MessagesService from '@/services/messages.service';
import { Recipient } from '@/types/recipient';
import { ListFilter } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';

export default function AssignLabelDialog({
	children,
	recipient,
}: {
	children: React.ReactNode;
	recipient: Recipient;
}) {
	const buttonRef = React.useRef<HTMLButtonElement>(null);
	const router = useRouter();
	const params = useParams();

	const [selectedLabels, setSelectedLabels] = React.useState<string[]>(recipient.labels);
	const [newLabel, setNewLabel] = React.useState('');

	const onClose = () => {
		setSelectedLabels(recipient.labels);
		setNewLabel('');
		router.push(`/${params.panel}/conversations/`);
		router.refresh();
	};

	const handleLabelChange = (label: string[]) => {
		setSelectedLabels((prev) => {
			const newLabels = label.filter((item) => !prev.includes(item));
			return [...prev, ...newLabels];
		});
	};

	const removeLabel = (label: string) => {
		setSelectedLabels((prev) => prev.filter((item) => item !== label));
	};

	const handleNewLabelInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewLabel(e.target.value);
		const new_label = e.target.value;
		if (new_label.includes(' ')) {
			const label = new_label.split(' ')[0];
			if (!selectedLabels.includes(label) && label.trim().length !== 0) {
				setSelectedLabels((prev) => {
					return [...prev, label];
				});
			}
			setNewLabel('');
		}
	};

	const handleSave = () => {
		console.log(
			newLabel.trim().length !== 0 ? [...selectedLabels, newLabel.trim()] : selectedLabels
		);

		MessagesService.ConversationLabels(
			recipient.recipient,
			newLabel.trim().length !== 0 ? [...selectedLabels, newLabel.trim()] : selectedLabels
		)
			.then((res) => {
				if (res) {
					toast.success('Labels assigned successfully');
					onClose();
					return;
				}
				toast.error('Failed to assign labels');
			})
			.catch(() => {
				toast.error('Failed to assign labels');
			});
	};
	return (
		<Dialog>
			<DialogTrigger ref={buttonRef} asChild>
				{children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Assign Labels</DialogTitle>
					<DialogDescription className='w-full'>
						<div className='flex flex-wrap justify-start mt-2 gap-1'>
							<Each
								items={selectedLabels}
								render={(label) => (
									<Badge className='min-w-max bg-gray-200 text-gray-700 font-normal'>
										{label}
										<IoClose
											onClick={() => removeLabel(label)}
											className='w-4 h-4 cursor-pointer'
											strokeWidth={3}
										/>
									</Badge>
								)}
							/>
						</div>
						<div className='flex w-full mt-4 items-center'>
							<div className='flex-1'>
								<Input
									placeholder='Add new labels'
									value={newLabel}
									onChange={handleNewLabelInput}
								/>
							</div>
							<TagsSelector onChange={handleLabelChange}>
								<Button variant='secondary' size={'icon'}>
									<ListFilter className='w-4 h-4' strokeWidth={3} />
								</Button>
							</TagsSelector>
						</div>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button type='submit' onClick={handleSave}>
							Save
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
