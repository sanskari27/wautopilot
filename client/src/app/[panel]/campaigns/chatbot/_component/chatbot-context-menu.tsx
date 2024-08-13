'use client';

import Show from '@/components/containers/show';
import DeleteDialog from '@/components/elements/dialogs/delete';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChatBot } from '@/schema/chatbot';
import ChatBotService from '@/services/chatbot.service';
import { Delete, Download, Edit, LucidePieChart, ToggleLeft, ToggleRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { deleteChatbot, toggleChatbot } from '../action';
import { FaChartPie } from 'react-icons/fa';

export default function ChatbotContextMenu({
	children,
	chatbot,
	panel,
}: {
	panel: string;
	children: React.ReactNode;
	chatbot: ChatBot;
}) {
	const toggleBot = () => {
		toast.promise(toggleChatbot(chatbot.id), {
			loading: 'Toggling chatbot...',
			success: 'Chatbot toggled successfully',
			error: 'Failed to toggle chatbot',
		});
	};

	const downloadChatBot = () => {
		toast.promise(ChatBotService.downloadChatBot(chatbot.id), {
			loading: 'Downloading chatbot...',
			success: 'Chatbot downloaded successfully',
			error: 'Failed to download chatbot',
		});
	};

	const deleteBot = () => {
		toast.promise(deleteChatbot(chatbot.id), {
			loading: 'Deleting chatbot...',
			success: 'Chatbot deleted successfully',
			error: 'Failed to delete chatbot',
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem>
					<Link
						className='w-full flex items-center'
						href={`/${panel}/campaigns/chatbot/${chatbot.id}?data=${JSON.stringify(chatbot)}`}
					>
						<Edit className='mr-2 h-4 w-4' />
						<span>Edit</span>
					</Link>
				</DropdownMenuItem>
				<DeleteDialog
					actionButtonText={chatbot.isActive ? 'Stop' : 'Play'}
					onDelete={toggleBot}
					message='Are you sure you want to change running status?'
				>
					<Button size={'sm'} variant={'ghost'} className='w-full p-2'>
						<Show>
							<Show.When condition={chatbot.isActive}>
								<ToggleLeft className='mr-2 h-4 w-4' />
								<span className='mr-auto'>Stop</span>
							</Show.When>
							<Show.Else>
								<ToggleRight className='mr-2 h-4 w-4' />
								<span className='mr-auto'>Play</span>
							</Show.Else>
						</Show>
					</Button>
				</DeleteDialog>
				<DropdownMenuItem onClick={downloadChatBot}>
					<Download className='mr-2 h-4 w-4' />
					<span>Download Report</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Link
						className='flex items-center'
						href={`/${panel}/campaigns/button-report/${chatbot.id}`}
					>
						<LucidePieChart className='mr-2 h-4 w-4' />
						<span>Button Click Report</span>
					</Link>
				</DropdownMenuItem>
				<DeleteDialog onDelete={deleteBot}>
					<Button size={'sm'} className='w-full bg-destructive hover:bg-destructive/50'>
						<Delete className='mr-2 h-4 w-4' />
						<span className='mr-auto'>Delete</span>
					</Button>
				</DeleteDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
