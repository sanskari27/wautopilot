import { CloseIcon } from '@chakra-ui/icons';
import {
	AbsoluteCenter,
	Box,
	Button,
	CloseButton,
	Divider,
	Input,
	InputGroup,
	InputRightElement,
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
import Each from '../../../../components/utils/Each';

export type ButtonMessageHandle = {
	open: () => void;
};

export type ButtonMessageProps = {
	onButtonMessageAdded: (text: string, buttons: string[]) => void;
};

const ButtonMessage = forwardRef<ButtonMessageHandle, ButtonMessageProps>(
	({ onButtonMessageAdded }: ButtonMessageProps, ref) => {
		const [isOpen, setOpen] = useBoolean(false);
		const [text, setText] = useState('');
		const [buttons, setButtons] = useState<string[]>([]);
		const [buttonText, setButtonText] = useState('');

		useImperativeHandle(ref, () => ({
			open: () => {
				setText('');
				setButtons([]);
				setOpen.on();
			},
		}));

		const onClose = () => {
			setOpen.off();
		};

		const handleSave = () => {
			onButtonMessageAdded(text, buttons);
			onClose();
		};

		function RenderButtons() {
			return (
				<Each
					items={buttons}
					render={(button) => (
						<Box
							bgColor={'gray.50'}
							my={'0.25rem'}
							py={'0.25rem'}
							px={'0.5rem'}
							rounded={'lg'}
							position={'relative'}
							border={'1px solid gray'}
						>
							{button}
							<CloseIcon
								fontSize={'1.25rem'}
								bgColor={'red'}
								p={'1'}
								color='white'
								rounded={'full'}
								position={'absolute'}
								right={'0.5rem'}
								top={'0.40rem'}
								cursor={'pointer'}
								onClick={() => setButtons(buttons.filter((el) => el !== button))}
							/>
						</Box>
					)}
				/>
			);
		}

		return (
			<Modal isOpen={isOpen} onClose={onClose} size={'xl'} isCentered>
				<ModalOverlay />
				<CloseButton />
				<ModalContent rounded={'2xl'}>
					<ModalHeader
						bgColor={'orange.400'}
						textAlign={'center'}
						color={'white'}
						roundedTop={'2xl'}
					>
						Audio Message
					</ModalHeader>
					<ModalBody>
						<Text fontSize={'0.85rem'} marginTop={'0.5rem'}>
							Enter Text.
						</Text>
						<Textarea
							height={'100px'}
							resize={'none'}
							placeholder={'Enter your message here. \nex. Hello, how can I help you?'}
							value={text}
							onChange={(e) => setText(e.target.value)}
						/>
						<Box position={'relative'} my={'1rem'}>
							<Divider />
							<AbsoluteCenter py='1' px={'4'} color='gray.600' bg={'white'}>
								Reply Back Buttons
							</AbsoluteCenter>
						</Box>
						<RenderButtons />

						<InputGroup>
							<Input
								placeholder={'Enter button text here. \nex. Click here to know more.'}
								value={buttonText}
								onChange={(e) => setButtonText(e.target.value)}
							/>
							<InputRightElement width='4.5rem'>
								<Button
									h='1.75rem'
									size='sm'
									onClick={() => {
										if (!buttonText) return;
										setButtons([...buttons, buttonText]);
										setButtonText('');
									}}
								>
									+ Add
								</Button>
							</InputRightElement>
						</InputGroup>
					</ModalBody>
					<ModalFooter marginTop={'0'}>
						<Button
							colorScheme='orange'
							width={'full'}
							onClick={handleSave}
							disabled={buttons.length === 0}
						>
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	}
);

export default ButtonMessage;
