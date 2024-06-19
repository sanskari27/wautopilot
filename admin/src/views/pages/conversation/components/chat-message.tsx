import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Message } from '../../../../store/types/MessageState';
import {
	ContactMessage,
	LocationMessage,
	MediaMessage,
	TextMessage,
	UnknownMessage,
} from './message-template';

export type ChatMessageHandle = {
	scrollTo: () => void;
};

type ChatMessageProps = {
	message: Message;
};

const ChatMessage = forwardRef<ChatMessageHandle, ChatMessageProps>(
	({ message }: ChatMessageProps, ref) => {
		const messageRef = useRef<HTMLDivElement>(null);

		useImperativeHandle(ref, () => ({
			scrollTo: () => {
				messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			},
		}));

		if (message.body?.body_type === 'TEXT') {
			return <TextMessage ref={messageRef} id={message._id} message={message} />;
		}

		if (message.body?.body_type === 'LOCATION') {
			return <LocationMessage ref={messageRef} id={message._id} message={message} />;
		}

		if (message.body?.body_type === 'MEDIA') {
			return <MediaMessage ref={messageRef} id={message._id} message={message} />;
		}

		if (message.body?.body_type === 'CONTACT') {
			return <ContactMessage ref={messageRef} id={message._id} message={message} />;
		}

		if (message.body?.body_type === 'UNKNOWN') {
			return <UnknownMessage ref={messageRef} id={message._id} message={message} />;
		}
		return <></>;
	}
);

export default ChatMessage;
