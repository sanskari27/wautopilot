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
import { randomString } from '../../../../../utils/templateHelper';
import Each from '../../../../components/utils/Each';

export type ListMessageHandle = {
	open: () => void;
};

export type ListMessageProps = {
	onListMessageAdded: (details: {
		header: string;
		body: string;
		footer: string;
		sections: {
			title: string;
			buttons: {
				id: string;
				text: string;
			}[];
		}[];
	}) => void;
};

const ListMessage = forwardRef<ListMessageHandle, ListMessageProps>(
	({ onListMessageAdded }: ListMessageProps, ref) => {
		const [isOpen, setOpen] = useBoolean(false);
		const [sectionText, setSectionText] = useState('');
		const [header, setHeader] = useState('');
		const [body, setBody] = useState('');
		const [footer, setFooter] = useState('');
		const [sections, setSections] = useState<
			{
				title: string;
				buttons: {
					id: string;
					text: string;
				}[];
			}[]
		>([]); // [header, body, footer

		useImperativeHandle(ref, () => ({
			open: () => {
				setHeader('');
				setBody('');
				setFooter('');
				setSectionText('');
				setSections([]);
				setOpen.on();
			},
		}));

		const onClose = () => {
			setOpen.off();
		};

		const handleSave = () => {
			if (!body || !sections.length) return;
			onListMessageAdded({ header, body, footer, sections });
			onClose();
		};

		const removeButton = (sectionIndex: number, buttonIndex: number) => {
			const newSections = [...sections];
			newSections[sectionIndex].buttons.splice(buttonIndex, 1);
			setSections(newSections);
		};

		function addButtonToSection(sectionIndex: number, buttonText: string): void {
			if (!buttonText) return;
			const newSections = [...sections];
			if (!newSections[sectionIndex].buttons) {
				newSections[sectionIndex].buttons = [];
			}
			newSections[sectionIndex].buttons.push({
				id: randomString(),
				text: buttonText,
			});
			setSections(newSections);
		}

		function RenderButtons({
			sectionIndex,
			buttons,
		}: {
			sectionIndex: number;
			buttons: {
				id: string;
				text: string;
			}[];
		}) {
			const [buttonText, setButtonText] = useState('');

			return (
				<>
					<Each
						items={buttons}
						render={(button, buttonIndex) => (
							<>
								<Box
									bgColor={'gray.50'}
									my={'0.25rem'}
									py={'0.25rem'}
									px={'0.5rem'}
									rounded={'lg'}
									position={'relative'}
									border={'1px solid gray'}
								>
									{button.text}
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
										onClick={() => removeButton(sectionIndex, buttonIndex)}
									/>
								</Box>
							</>
						)}
					/>
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
								onClick={() => addButtonToSection(sectionIndex, buttonText)}
							>
								+ Add
							</Button>
						</InputRightElement>
					</InputGroup>
				</>
			);
		}

		function RenderSections() {
			return (
				<Each
					items={sections}
					render={(section, sectionIndex) => (
						<>
							<Box position={'relative'} my={'2rem'}>
								<Divider />
								<AbsoluteCenter py='1' px={'4'} color='gray.600' bg={'white'}>
									Section : {section.title}
								</AbsoluteCenter>
							</Box>

							<RenderButtons sectionIndex={sectionIndex} buttons={section.buttons} />
						</>
					)}
				/>
			);
		}

		return (
			<Modal isOpen={isOpen} onClose={onClose} size={'xl'} isCentered>
				<ModalOverlay />
				<CloseButton />
				<ModalContent rounded={'2xl'}>
					<ModalHeader bgColor={'gray.400'} textAlign={'center'} color={'white'} roundedTop={'2xl'}>
						Audio Message
					</ModalHeader>
					<ModalBody>
						<Text fontSize={'0.85rem'} marginTop={'0.5rem'}>
							Enter Header Text
						</Text>
						<Input
							placeholder={'Enter your header text here.'}
							value={header}
							onChange={(e) => setHeader(e.target.value)}
						/>
						<Text fontSize={'0.85rem'} marginTop={'0.5rem'}>
							Enter Body Text
						</Text>
						<Textarea
							height={'100px'}
							resize={'none'}
							placeholder={'Enter your body text here.'}
							value={body}
							onChange={(e) => setBody(e.target.value)}
						/>
						<Text fontSize={'0.85rem'} marginTop={'0.5rem'}>
							Enter Footer Text
						</Text>
						<Input
							placeholder={'Enter your footer text here.'}
							value={footer}
							onChange={(e) => setFooter(e.target.value)}
						/>
						<Box position={'relative'} my={'1rem'}>
							<Divider />
							<AbsoluteCenter py='1' px={'4'} color='gray.600' bg={'white'}>
								Menu Sections
							</AbsoluteCenter>
						</Box>
						<RenderSections />

						<Divider my={'1rem'} />

						<InputGroup marginTop={'0.5rem'}>
							<Input
								placeholder={'Create a new section. \nex. Menu 1'}
								value={sectionText}
								onChange={(e) => setSectionText(e.target.value)}
							/>
							<InputRightElement width='4.5rem'>
								<Button
									h='1.75rem'
									size='sm'
									onClick={() => {
										if (!sectionText) return;
										setSections([...sections, { title: sectionText, buttons: [] }]);
										setSectionText('');
									}}
								>
									+ Add
								</Button>
							</InputRightElement>
						</InputGroup>
					</ModalBody>
					<ModalFooter marginTop={'0'}>
						<Button
							colorScheme='gray'
							width={'full'}
							onClick={handleSave}
							disabled={sections.length === 0}
						>
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	}
);

export default ListMessage;
