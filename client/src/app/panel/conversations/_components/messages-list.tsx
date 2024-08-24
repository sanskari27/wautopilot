'use client';
import Each from '@/components/containers/each';
import { Message as IMessage } from '@/types/recipient';
import { memo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Message } from './message-template';

const MessagesList = memo(
	({ list, onLastReached }: { list: IMessage[]; onLastReached: () => void }) => {
		const { ref: inViewRef, inView } = useInView({ triggerOnce: true });

		useEffect(() => {
			let id: NodeJS.Timeout;
			if (inView) {
				id = setTimeout(() => {
					onLastReached();
				}, 1000);
			}
			return () => {
				clearTimeout(id);
			};
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

MessagesList.displayName = 'MessagesList';
export default MessagesList;
