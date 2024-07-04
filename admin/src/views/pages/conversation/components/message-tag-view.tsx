import {
	Flex,
	FormControl,
	FormLabel,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Tag,
	useBoolean,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';
import Each from '../../../components/utils/Each';
import { Message } from './message-template';

export type MessageTagsViewHandle = {
	close: () => void;
	open: () => void;
};

const MessageTagsView = forwardRef<MessageTagsViewHandle>((_, ref) => {
	const [isOpen, setOpen] = useBoolean();
	const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
	const { messageList: messages, messageLabels: labels } = useSelector(
		(state: StoreState) => state[StoreNames.MESSAGES]
	);

	const onClose = () => {
		setSelectedLabels([]);
		setOpen.off();
	};

	useImperativeHandle(ref, () => ({
		close: () => {
			onClose();
		},
		open: () => {
			setOpen.on();
		},
	}));

	const handleLabelsChange = (labels: string[]) => {
		setSelectedLabels(labels);
	};

	const filteredMessages = messages.filter((message) => {
		return message.labels.some((tag) => selectedLabels.includes(tag));
	});

	return (
		<Modal isOpen={isOpen} onClose={onClose} size={'2xl'} scrollBehavior='inside'>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Tagged Messages</ModalHeader>
				<ModalBody pb={6}>
					<FormControl pt={'1rem'}>
						<FormLabel>Tags</FormLabel>
						<Flex flexWrap={'wrap'} pb={'1rem'} gap={'1rem'}>
							{labels.map((label, index) => (
								<Tag
									cursor={'pointer'}
									key={index}
									onClick={() => {
										if (selectedLabels.includes(label)) {
											handleLabelsChange(selectedLabels.filter((l) => l !== label));
										} else {
											handleLabelsChange([...selectedLabels, label]);
										}
									}}
									bgColor={selectedLabels.includes(label) ? 'green.200' : 'gray.300'}
								>
									{label}
								</Tag>
							))}
						</Flex>
						<Flex
							height={'500px'}
							width={'full'}
							backgroundColor={'#ece5dd'}
							alignItems={'end'}
							direction={'column'}
						>
							<Flex
								className='flex-col-reverse'
								width={'full'}
								overflowY={'auto'}
								padding={'1rem'}
								height={'full'}
							>
								<Each
									items={filteredMessages}
									render={(item) => (
										<Flex width={'full'}>
											<Message message={item} />
										</Flex>
									)}
								/>
							</Flex>
						</Flex>
					</FormControl>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default MessageTagsView;
