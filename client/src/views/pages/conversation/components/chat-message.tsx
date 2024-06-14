import { Message } from '../../../../store/types/MessageState.s';
import {
	ContactMessage,
	LocationMessage,
	MediaMessage,
	TextMessage,
	UnknownMessage,
} from './message-template';

const ChatMessage = ({ message }: { message: Message }) => {
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
};

export default ChatMessage;
