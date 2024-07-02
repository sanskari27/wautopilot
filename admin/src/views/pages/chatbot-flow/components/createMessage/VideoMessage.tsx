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
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import AttachmentSelectorDialog, {
	AttachmentDialogHandle,
} from '../../../../components/selector-dialog/AttachmentSelectorDialog';
import Each from '../../../../components/utils/Each';

export type VideoMessageHandle = {
	open: () => void;
};

export type VideoMessageProps = {
	onVideoMessageAdded: (id: string, caption: string, buttons: string[]) => void;
};

const VideoMessage = forwardRef<VideoMessageHandle, VideoMessageProps>(
	({ onVideoMessageAdded }: VideoMessageProps, ref) => {
		const [isOpen, setOpen] = useBoolean(false);
		const [attachment, setAttachment] = useState('');
		const [caption, setCaption] = useState('');
		const attachmentSelectorHandle = useRef<AttachmentDialogHandle>(null);
		const [buttons, setButtons] = useState<string[]>([]);
		const [buttonText, setButtonText] = useState('');

		useImperativeHandle(ref, () => ({
			open: () => {
				setAttachment('');
				setCaption('');
				setButtons([]);
				setButtonText('');
				setOpen.on();
			},
		}));

		const onClose = () => {
			setOpen.off();
		};

		const handleSave = () => {
			onVideoMessageAdded(attachment, caption, buttons);
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
						bgColor={'purple.400'}
						textAlign={'center'}
						color={'white'}
						roundedTop={'2xl'}
					>
						Video Message
					</ModalHeader>
					<ModalBody>
						<Button
							colorScheme='gray'
							width={'full'}
							onClick={() =>
								attachmentSelectorHandle.current?.open({ type: 'VIDEO', ids: [attachment] })
							}
						>
							Select Video
						</Button>
						<Text fontSize={'0.85rem'} marginTop={'0.5rem'}>
							Enter Caption.
						</Text>
						<Textarea
							height={'100px'}
							resize={'none'}
							placeholder={'Enter caption here. \nex. This is a FHD Video.'}
							value={caption}
							onChange={(e) => setCaption(e.target.value)}
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
						<Button colorScheme='green' width={'full'} onClick={handleSave} disabled={!attachment}>
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
				<AttachmentSelectorDialog
					ref={attachmentSelectorHandle}
					onConfirm={(_, ids) => setAttachment(ids[0])}
					returnType='id'
				/>
			</Modal>
		);
	}
);

export default VideoMessage;
