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
import { addURLButton } from '../../../../store/reducers/TemplateReducer';

export default function URLButton({ disabled }: { disabled: boolean }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef(null);
	const [text, setText] = useState('');
	const [url, setURL] = useState('');
	const dispatch = useDispatch();

	const onSave = () => {
		dispatch(addURLButton({ text, url }));
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
				URL
			</Button>

			<AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize='lg' fontWeight='bold'>
							URL Details
						</AlertDialogHeader>

						<AlertDialogBody>
							<Box width={'full'}>
								<Text fontSize={'0.75rem'}>Text to be displayed</Text>
								<Input
									size={'sm'}
									placeholder='Enter url text'
									onChange={(e) => setText(e.target.value)}
									value={text}
								/>
							</Box>
							<Box width={'full'} mt={'1rem'}>
								<Text fontSize={'0.75rem'}>Link</Text>
								<Input
									size={'sm'}
									placeholder='Enter url'
									onChange={(e) => setURL(e.target.value)}
									value={url}
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
