'use client';
import { usePermissions } from '@/components/context/user-details';
import DeleteDialog from '@/components/elements/dialogs/delete';
import AgentSelector from '@/components/elements/popover/agents';
import TagsSelector from '@/components/elements/popover/tags';
import { Button } from '@/components/ui/button';
import AgentService from '@/services/agent.service';
import MessagesService from '@/services/messages.service';
import PhoneBookService from '@/services/phonebook.service';
import { Database, FolderDown, Headset, ListFilter, Trash } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export function CreateButton() {
	const { create: createPermission } = usePermissions().recurring;

	if (!createPermission) return null;
	return (
		<Link href={`/panel/campaigns/recurring/create`}>
			<Button variant={'outline'} size={'sm'}>
				Create New
			</Button>
		</Link>
	);
}

export function ExportButton({ labels }: { labels: string[] }) {
	function handleExport() {
		toast.promise(PhoneBookService.export(labels), {
			success: 'Exported successfully',
			error: 'Failed to export',
			loading: 'Exporting...',
		});
	}

	return (
		<Button size={'sm'} className='bg-teal-600 hover:bg-teal-700' onClick={handleExport}>
			<FolderDown className='w-4 h-4 mr-2' />
			Export
		</Button>
	);
}

export function ExportChatButton({ ids }: { ids: string[] }) {
	function handleExport() {
		toast.promise(MessagesService.exportConversations(ids), {
			success: 'Exported successfully',
			error: 'Failed to export',
			loading: 'Exporting...',
		});
	}

	return (
		<Button size={'sm'} className='bg-teal-600 hover:bg-teal-700' onClick={handleExport}>
			<FolderDown className='w-4 h-4 mr-2' />
			Export
		</Button>
	);
}

export function DeleteButton({ ids }: { ids: string[] }) {
	const router = useRouter();
	function handleDelete() {
		toast.promise(PhoneBookService.deleteRecords(ids), {
			success: () => {
				router.refresh();
				return 'Deleted successfully';
			},
			error: 'Failed to delete',
			loading: 'Deleting...',
		});
	}

	return (
		<DeleteDialog onDelete={handleDelete}>
			<Button size={'sm'} className='bg-red-600 hover:bg-red-700'>
				<Trash className='w-4 h-4 mr-2' />
				Delete
			</Button>
		</DeleteDialog>
	);
}

export function AssignAgent({ ids }: { ids: string[] }) {
	function handleAssign(agent_id: string) {
		toast.promise(
			AgentService.assignConversationsToAgent(agent_id, {
				phonebook_ids: ids,
			}),
			{
				success: 'Assigned successfully',
				error: 'Failed to assign',
				loading: 'Assigning...',
			}
		);
	}

	return (
		<AgentSelector onSubmit={([id]) => handleAssign(id)}>
			<Button size={'sm'} className='bg-purple-600 hover:bg-purple-700'>
				<Headset className='w-4 h-4 mr-2' />
				Assign Agent
			</Button>
		</AgentSelector>
	);
}

export function TagsFilter() {
	const router = useRouter();
	const [tags, setSelectedTags] = useState<string[]>([]);

	useEffect(() => {
		const url = new URL((window as any).location);
		setSelectedTags(url.searchParams.getAll('tags') ?? []);
	}, []);

	const setSelected = (selected: string[]) => {
		setSelectedTags(selected);
		const url = new URL((window as any).location);
		url.searchParams.delete('tags');
		selected.forEach((tag) => {
			url.searchParams.append('tags', tag);
		});
		router.replace(url.toString());
	};

	return (
		<TagsSelector onChange={setSelected} selected={tags}>
			<Button variant='secondary' size={'icon'}>
				<ListFilter className='w-4 h-4' strokeWidth={3} />
			</Button>
		</TagsSelector>
	);
}

export function AddRecord() {
	return (
		<Link href='?add-phonebook=true'>
			<Button className='bg-indigo-600 hover:bg-indigo-700' size={'sm'}>
				<Database className='w-4 h-4 mr-2' />
				Add Record
			</Button>
		</Link>
	);
}
