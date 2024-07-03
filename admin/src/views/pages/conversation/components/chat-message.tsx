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

const ChatMessage = ({ message }: ChatMessageProps) => {
	if (message.body?.body_type === 'TEXT') {
		return <TextMessage message={message} />;
	}

	if (message.body?.body_type === 'LOCATION') {
		return <LocationMessage message={message} />;
	}

	if (message.body?.body_type === 'MEDIA') {
		return <MediaMessage message={message} />;
	}

	if (message.body?.body_type === 'CONTACT') {
		return <ContactMessage message={message} />;
	}

	if (message.body?.body_type === 'UNKNOWN') {
		return <UnknownMessage message={message} />;
	}
	return <></>;
};

export default ChatMessage;
