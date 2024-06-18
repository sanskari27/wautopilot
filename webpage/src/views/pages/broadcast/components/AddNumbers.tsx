import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Box,
	Button,
	Center,
	Text,
	Textarea,
	useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';

export default function AddNumbers({
	hidden,
	onComplete,
}: {
	hidden: boolean;
	onComplete: (numbers: string[]) => void;
}) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef(null);

	const [numberInput, setNumberInput] = useState('');
	const [numbers, setNumbers] = useState<string[]>([]);
	const [isChanged, setChanged] = useState(false);

	const handleTextChange = (text: string) => {
		if (text.length === 0) {
			setChanged(true);
			return setNumberInput('');
		}
		setNumberInput(text);
		setChanged(true);
	};

	const handleFormatClicked = () => {
		const lines = numberInput.split('\n');
		const res_lines = [];
		const res_numbers: string[] = [];
		for (const line of lines) {
			if (!line) continue;
			const _numbers = line
				.split(/[ ,]+/)
				.map((number) => number.trim())
				.filter((number) => number && !isNaN(Number(number)));
			res_numbers.push(..._numbers);
			res_lines.push(_numbers.join(', '));
		}

		setNumberInput(res_lines.join('\n'));
		setNumbers(res_numbers);
		setChanged(false);
	};

	const handleClose = () => {
		onComplete(numbers);
		onClose();
	};

	return (
		<>
			<Button rounded={'full'} colorScheme='blue' hidden={hidden} onClick={onOpen}>
				Add Numbers ({numbers.length})
			</Button>

			<AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} size={'3xl'}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize='lg' fontWeight='bold'>
							Enter Recipient Numbers
						</AlertDialogHeader>

						<AlertDialogBody>
							<Box width={'full'}>
								<Textarea
									width={'full'}
									minHeight={'200px'}
									size={'sm'}
									rounded={'md'}
									placeholder={
										'Enter recipients numbers separated by commas\nE.g. 91xxxxxxxxx8, 91xxxxxxxxx8'
									}
									// border={'none'}
									_placeholder={{
										opacity: 0.4,
										color: 'inherit',
									}}
									_focus={{ border: 'none', outline: 'none' }}
									value={numberInput}
									onChange={(e) => handleTextChange(e.target.value)}
									resize={'vertical'}
								/>
							</Box>
							<Center>
								{isChanged ? (
									<Text
										alignSelf={'center'}
										cursor={'pointer'}
										textDecoration={'underline'}
										textUnderlineOffset={'3px'}
										onClick={handleFormatClicked}
									>
										Format Numbers
									</Text>
								) : (
									<Text
										alignSelf={'center'}
										cursor={'pointer'}
										textDecoration={'underline'}
										textUnderlineOffset={'3px'}
									>
										{numbers.length} numbers provided.
									</Text>
								)}
							</Center>
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button
								colorScheme='green'
								variant='solid'
								width='full'
								onClick={handleClose}
								isDisabled={isChanged}
							>
								Done
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
}
