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
	useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addQuickReply } from '../../../../store/reducers/TemplateReducer';

export default function AddQuickReply({ disabled }: { disabled: boolean }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef(null);
	const [text, setText] = useState('');
	const dispatch = useDispatch();

	const onSave = () => {
		dispatch(addQuickReply(text));
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
				Quick Reply
			</Button>

			<AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize='lg' fontWeight='bold'>
							Quick reply details
						</AlertDialogHeader>

						<AlertDialogBody>
							<Box width={'full'}>
								<Input
									placeholder='Enter quick reply text'
									onChange={(e) => setText(e.target.value)}
									value={text}
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
