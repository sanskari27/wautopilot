import { memo } from 'react';
import { Message as IMessage } from '../../../../store/types/MessageState';
import Each from '../../../components/utils/Each';
import { Message } from './message-template';

const MessagesList = memo(({ list }: { list: IMessage[] }) => {
	return <Each items={list} render={(item) => <Message message={item} />} />;
});
export default MessagesList;
