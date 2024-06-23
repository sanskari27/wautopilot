import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';

export type MarkUpDialogHandle = {
	open: (name: string, rate: number) => void;
	close: () => void;
};

type MarkupDialogProps = {
	onConfirm: (rate: number) => void;
};

const MarkUpDialog = forwardRef<MarkUpDialogHandle, MarkupDialogProps>(
	({ onConfirm }: MarkupDialogProps, ref) => {
		const { isOpen, onOpen, onClose } = useDisclosure();

		const [markupPrice, setMarkupPrice] = useState<string>('');

		const [error, setError] = useState<string>('');

		const [name, setName] = useState<string>('');

		useImperativeHandle(ref, () => ({
			open: (name: string, rate: number) => {
				setName(name);
				setMarkupPrice(rate.toString());
				onOpen();
			},
			close: handleClose,
		}));

		const handleClose = () => {
			setMarkupPrice('');
			setError('');
			setName('');
			onClose();
		};

		const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
			setError('');
			const re = /^[0-9\b.]+$/;
			if (e.target.value === '' || re.test(e.target.value)) {
				setMarkupPrice(e.target.value);
				return;
			}
		};

		const handleSave = () => {
			if (markupPrice === '') {
				setError('Please enter a valid markup price');
				return;
			}
			onConfirm(Number(markupPrice));
			handleClose();
		};

		return (
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Set Markup Price</ModalHeader>
					<ModalBody>
						<FormControl isInvalid={!!error}>
							<FormLabel>Set markup price for {name}</FormLabel>
							<Input
								placeholder='Enter Markup Price'
								value={markupPrice}
								type='number'
								onChange={handlePriceInput}
							/>
							<FormErrorMessage>{error}</FormErrorMessage>
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<Button variant='outline' colorScheme='red' mr={'1rem'} onClick={handleClose}>
							Cancel
						</Button>
						<Button colorScheme='green' mr={3} onClick={handleSave}>
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	}
);

export default MarkUpDialog;
