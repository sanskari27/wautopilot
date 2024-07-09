import { memo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Message as IMessage } from '../../../../store/types/MessageState';
import Each from '../../../components/utils/Each';
import { Message } from './message-template';

const MessagesList = memo(
	({ list, onLastReached }: { list: IMessage[]; onLastReached: () => void }) => {
		const { ref: inViewRef, inView } = useInView({ triggerOnce: true });

		useEffect(() => {
			if (inView) {
				onLastReached();
			}
		}, [inView, onLastReached]);

		return (
			<Each
				items={list}
				render={(item, index) =>
					index === list.length - 1 ? (
						<div
							ref={inViewRef}
							style={{
								display: 'flex',
								justifyContent: item.received_at ? 'flex-start' : 'flex-end',
							}}
						>
							<Message message={item} />
						</div>
					) : (
						<Message message={item} />
					)
				}
			/>
		);
	}
);
export default MessagesList;
