'use client'

import ConversationScreen from './_components/conversation-screen';
import RecipientsList from './_components/recipientsList';

export default function ConversationsPage() {
	return (
		<div className='h-full'>
			<div className='flex w-full h-[calc(100vh-60px)]'>
				<RecipientsList />
				<ConversationScreen />
			</div>
		</div>
	);
}
