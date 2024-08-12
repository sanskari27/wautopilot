import Each from '@/components/containers/each';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import ChatBotService from '@/services/chatbot.service';
import Link from 'next/link';
import ChatbotContextMenu from './_component/chatbot-context-menu';

export default async function ChatbotPage({ params: { panel } }: { params: { panel: string } }) {
	const chatbotList = await ChatBotService.listChatBots();

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Chatbot</h2>
				<div className='flex gap-x-2 gap-y-1 flex-wrap '>
					<Link href={`/${panel}/campaigns/chatbot/create`}>
						<Button variant={'outline'} size={'sm'}>
							Create New
						</Button>
					</Link>
				</div>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Trigger</TableHead>
						<TableHead>Message</TableHead>
						<TableHead>Recipients</TableHead>
						<TableHead>Condition</TableHead>
						<TableHead>Delay</TableHead>
						<TableHead className='text-center'>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<Each
						items={chatbotList}
						render={(chatbot) => (
							<TableRow>
								<TableCell className=''>{chatbot.trigger}</TableCell>
								<TableCell className='whitespace-break-spaces'>{chatbot.message}</TableCell>
								<TableCell>{chatbot.respond_to.split('_').join(' ')}</TableCell>
								<TableCell>{chatbot.options.split('_').join(' ')}</TableCell>
								<TableCell>
									{chatbot.trigger_gap_seconds < 60
										? `${chatbot.trigger_gap_seconds} s`
										: chatbot.trigger_gap_seconds < 3600
										? `${Math.floor(chatbot.trigger_gap_seconds / 60)} m`
										: chatbot.trigger_gap_seconds < 86400
										? `${Math.floor(chatbot.trigger_gap_seconds / 3600)} h`
										: `${Math.floor(chatbot.trigger_gap_seconds / 86400)} day`}
								</TableCell>
								<TableCell className='text-center'>
									<ChatbotContextMenu panel={panel} chatbot={chatbot}>
										<Button size={'sm'} variant={'outline'}>Action</Button>
									</ChatbotContextMenu>
								</TableCell>
							</TableRow>
						)}
					/>
				</TableBody>
			</Table>
		</div>
	);
}
