'use client';

import { useRecipient } from '@/components/context/recipients';
import { socket } from '@/socket';
import { useMessagesStore } from '@/stores/message-store';
import { ReactNode, useEffect } from 'react';
interface MessagesProviderProps {
	children: ReactNode;
}

export const MessagesProvider = ({ children }: MessagesProviderProps) => {
	const { markRead, selected_recipient } = useRecipient();
	const { fetchMessages, addMessage, updateMessage, replyMessageId, setReplyMessageId } =
		useMessagesStore();

	useEffect(() => {
		socket.emit('join_conversation', selected_recipient?.id);

		socket.on('message_new', (msg) => {
			addMessage(msg);
			setTimeout(() => {
				markRead(selected_recipient?.id ?? '');
			}, 1000);
		});

		socket.on('message_updated', (msg) => {
			updateMessage(msg);
			setTimeout(() => {
				markRead(selected_recipient?.id ?? '');
			}, 1000);
		});

		return () => {
			socket.emit('leave_conversation', selected_recipient?.id);
			socket.off('message_new');
			socket.off('message_updated');
		};
	}, [selected_recipient?.id, addMessage, updateMessage, markRead]);

	useEffect(() => {
		fetchMessages(selected_recipient?.id ?? '');
	}, [selected_recipient?.id, fetchMessages]);

	return <>{children}</>;
};

export const useMessages = () => {
	const {
		messages,
		loading,
		expiry,
		messageLabels,
		fetchMessages,
		loadMoreMessages,
		replyMessageId,
		setReplyMessageId,
	} = useMessagesStore();

	return {
		messages,
		loading,
		expiry,
		messageLabels,
		fetchMessages,
		loadMoreMessages,
		setReplyMessageId,
		replyMessageId,
	};
};
