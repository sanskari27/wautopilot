import { AddIcon } from '@chakra-ui/icons';
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Box,
	Button,
	Input,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPhoneNumberButton } from '../../../../store/reducers/TemplateReducer';

export default function PhoneNumberButton({ disabled }: { disabled: boolean }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef(null);
	const [text, setText] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const dispatch = useDispatch();

	const onSave = () => {
		dispatch(addPhoneNumberButton({ text, phoneNumber }));
		onClose();
	};

	return (
		<>
			<Button
				colorScheme='blue'
				size={'sm'}
				leftIcon={<AddIcon />}
				isDisabled={disabled}
				onClick={onOpen}
			>
				Phone Number
			</Button>

			<AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize='lg' fontWeight='bold'>
							Phone Number Details
						</AlertDialogHeader>

						<AlertDialogBody>
							<Box width={'full'}>
								<Text fontSize={'0.75rem'}>Text to be displayed</Text>
								<Input
									size={'sm'}
									placeholder='Enter phone number text'
									onChange={(e) => setText(e.target.value)}
									value={text}
								/>
							</Box>
							<Box width={'full'} mt={'1rem'}>
								<Text fontSize={'0.75rem'}>Phone Number (with country code)</Text>
								<Input
									size={'sm'}
									placeholder='Enter phone number with country code'
									onChange={(e) => setPhoneNumber(e.target.value)}
									value={phoneNumber}
								/>
							</Box>
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={onClose}>
								Cancel
							</Button>
							<Button colorScheme='green' onClick={onSave} ml={3}>
								Save
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
}
