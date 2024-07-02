import { Button, FormControl, Tag, Text, Textarea, Wrap } from '@chakra-ui/react';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';
import {
	setAudios,
	setContacts,
	setDocuments,
	setImages,
	setMessage,
	setVideos,
} from '../../../../store/reducers/ChatBotReducer';
import AttachmentSelectorDialog, {
	AttachmentDialogHandle,
} from '../../../components/selector-dialog/AttachmentSelectorDialog';
import ContactIdSelectorDialog, {
	ContactIdSelectorHandle,
} from '../../../components/selector-dialog/ContactIdSelector';
import Each from '../../../components/utils/Each';

const tagsVariable = [
	'{{first_name}}',
	'{{last_name}}',
	'{{middle_name}}',
	'{{phone_number}}',
	'{{email}}',
	'{{birthday}}',
	'{{anniversary}}',
];

export default function StaticMessageInput() {
	const dispatch = useDispatch();

	const messageRef = useRef(0);

	const contactIdSelectorRef = useRef<ContactIdSelectorHandle>(null);

	const attachmentSelector = useRef<AttachmentDialogHandle>(null);

	const {
		details: { message, images, videos, audios, documents, contacts },
	} = useSelector((state: StoreState) => state[StoreNames.CHATBOT]);

	const insertVariablesToMessage = (variable: string) => {
		dispatch(
			setMessage(
				message.substring(0, messageRef.current) +
					' ' +
					variable +
					' ' +
					message.substring(messageRef.current ?? 0, message.length)
			)
		);
	};

	const handleAddMedias = ({ type, ids }: { type: string; ids: string[] }) => {
		if (type === 'DOCUMENT') {
			dispatch(setDocuments(ids));
		} else if (type === 'AUDIO') {
			dispatch(setAudios(ids));
		} else if (type === 'PHOTOS') {
			dispatch(setImages(ids));
		} else if (type === 'VIDEO') {
			dispatch(setVideos(ids));
		}
	};

	return (
		<>
			<Text>Medias</Text>

			<Wrap justifyContent={'stretch'} my={'1rem'}>
				<Button
					minWidth={'200px'}
					flex={1}
					colorScheme='green'
					variant={'outline'}
					onClick={() => contactIdSelectorRef.current?.open(contacts)}
				>
					Contact Card ({contacts.length})
				</Button>
				<Button
					minWidth={'200px'}
					flex={1}
					colorScheme='green'
					variant={'outline'}
					onClick={() => attachmentSelector.current?.open({ type: 'AUDIO', ids: audios })}
				>
					Audio ({audios.length})
				</Button>
				<Button
					minWidth={'200px'}
					flex={1}
					colorScheme='green'
					variant={'outline'}
					onClick={() => attachmentSelector.current?.open({ type: 'PHOTOS', ids: images })}
				>
					Images ({images.length})
				</Button>
				<Button
					minWidth={'200px'}
					flex={1}
					colorScheme='green'
					variant={'outline'}
					onClick={() => attachmentSelector.current?.open({ type: 'VIDEO', ids: videos })}
				>
					Videos ({videos.length})
				</Button>
				<Button
					minWidth={'200px'}
					flex={1}
					colorScheme='green'
					variant={'outline'}
					onClick={() => attachmentSelector.current?.open({ type: 'DOCUMENT', ids: documents })}
				>
					Documents ({documents.length})
				</Button>

				<ContactIdSelectorDialog
					onConfirm={(contact) => dispatch(setContacts(contact))}
					ref={contactIdSelectorRef}
				/>

				<AttachmentSelectorDialog
					ref={attachmentSelector}
					onConfirm={(type, ids) => handleAddMedias({ type, ids })}
					selectButtonText='Select'
					returnType='id'
					isMultiSelect
				/>
			</Wrap>
			<FormControl>
				<Textarea
					value={message ?? ''}
					minHeight={'80px'}
					onMouseUp={(e: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {
						if (e.target instanceof HTMLTextAreaElement) {
							messageRef.current = e.target.selectionStart;
						}
					}}
					onChange={(e) => {
						messageRef.current = e.target.selectionStart;
						dispatch(setMessage(e.target.value));
					}}
					placeholder={'Type your message here. \nex. You are invited to join fanfest'}
					width={'full'}
				/>
			</FormControl>
			<Wrap>
				<Each
					items={tagsVariable}
					render={(tag) => (
						<Tag
							size={'sm'}
							m={'0.25rem'}
							p={'0.5rem'}
							width={'fit-content'}
							borderRadius='md'
							variant='solid'
							colorScheme='gray'
							_hover={{ cursor: 'pointer' }}
							onClick={() => insertVariablesToMessage(tag)}
						>
							{tag}
						</Tag>
					)}
				/>
			</Wrap>
		</>
	);
}
