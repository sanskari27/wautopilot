import {
	Button,
	CloseButton,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Textarea,
	useBoolean,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';

export type TextMessageHandle = {
	open: () => void;
};

export type TextMessageProps = {
	onTextMessageAdded: (text: string) => void;
};

const TextMessage = forwardRef<TextMessageHandle, TextMessageProps>(
	({ onTextMessageAdded }: TextMessageProps, ref) => {
		const [isOpen, setOpen] = useBoolean(false);
		const [message, setMessage] = useState('');

		useImperativeHandle(ref, () => ({
			open: () => {
				setMessage('');
				setOpen.on();
			},
		}));

		const onClose = () => {
			setOpen.off();
		};

		const handleSave = () => {
			onTextMessageAdded(message);
			onClose();
		};

		return (
			<Modal isOpen={isOpen} onClose={onClose} size={'xl'} isCentered>
				<ModalOverlay />
				<CloseButton />
				<ModalContent rounded={'2xl'}>
					<ModalHeader bgColor={'red.400'} textAlign={'center'} color={'white'} roundedTop={'2xl'}>
						Text Message
					</ModalHeader>
					<ModalBody>
						<Text fontSize={'0.85rem'}>Use text message to show final output of the flow.</Text>
						<Textarea
							height={'200px'}
							resize={'none'}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
					</ModalBody>
					<ModalFooter marginTop={'0'}>
						<Button colorScheme='red' width={'full'} onClick={handleSave}>
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	}
);

export default TextMessage;
