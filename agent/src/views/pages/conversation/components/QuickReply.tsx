import { AddIcon, EditIcon } from '@chakra-ui/icons';
import {
	Button,
	HStack,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Textarea,
	useToast,
} from '@chakra-ui/react';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MessagesService from '../../../../services/messages.service';
import { StoreNames, StoreState } from '../../../../store';
import {
	addQuickReply,
	deleteQuickReply,
	selectQuickReply,
	updateQuickReply,
} from '../../../../store/reducers/MessagesReducers';
import Each from '../../../components/utils/Each';

export default function QuickReply({
	hidden,
	handleChangeMessage,
}: {
	hidden: boolean;
	handleChangeMessage: (message: string) => void;
}) {
	const toast = useToast();
	const dispatch = useDispatch();
	const addQuickReplyRef = useRef<AddQuickReplyHandle>(null);
	const { quickReplyList, quickReplyDetails } = useSelector(
		(state: StoreState) => state[StoreNames.MESSAGES]
	);

	const handleSelectQuickReply = (e: React.ChangeEvent<HTMLSelectElement>) => {
		dispatch(selectQuickReply(e.target.value));
		handleChangeMessage(quickReplyList.find((item) => item.id === e.target.value)?.message || '');
	};

	function formatMessage(text: string) {
		const firstLine = text.split('\n')?.[0].trim() ?? '';
		return firstLine.length > 70 ? firstLine.slice(0, 70) + '...' : firstLine;
	}

	const handleConfirm = ({ id, message }: { id: string; message: string }) => {
		if (!message) {
			toast({
				title: 'Message cannot be empty',
				status: 'error',
			});
			return;
		}
		const promise = id
			? MessagesService.editQuickReply({ id, message })
			: MessagesService.addQuickReply(message);

		toast.promise(promise, {
			loading: { title: 'Saving Quick Reply' },
			error: { title: 'Failed to save Quick Reply' },
			success: (data) => {
				const action = id ? updateQuickReply({ id, message }) : addQuickReply(data);
				dispatch(action);
				return {
					title: 'Quick Reply Saved',
				};
			},
		});
	};

	const handleDelete = (id: string) => {
		const promise = MessagesService.deleteQuickReply(id);
		toast.promise(promise, {
			loading: { title: 'Deleting Quick Reply' },
			error: { title: 'Failed to delete Quick Reply' },
			success: () => {
				dispatch(deleteQuickReply(id));
				return {
					title: 'Quick Reply Deleted',
				};
			},
		});
	};

	return (
		<HStack
			hidden={!hidden}
			w={'full'}
			bgColor={'white'}
			p={'1rem'}
			borderBottom={'1px solid'}
			borderColor={'gray.200'}
		>
			<Select
				placeholder='Select Quick Reply'
				value={quickReplyDetails.id}
				onChange={handleSelectQuickReply}
			>
				<Each
					items={quickReplyList}
					render={(item) => (
						<option key={item.id} value={item.id} className='w-[100px]'>
							{formatMessage(item.message)}
						</option>
					)}
				/>
			</Select>
			{!quickReplyDetails.id ? (
				<IconButton
					aria-label='edit quick reply'
					icon={<AddIcon />}
					colorScheme='green'
					onClick={() => addQuickReplyRef.current?.open({ id: '', message: '' })}
				/>
			) : (
				<IconButton
					aria-label='add quick reply'
					icon={<EditIcon />}
					colorScheme='green'
					onClick={() => addQuickReplyRef.current?.open(quickReplyDetails)}
				/>
			)}
			<AddQuickReplyDialog
				ref={addQuickReplyRef}
				onConfirm={handleConfirm}
				onDelete={handleDelete}
			/>
		</HStack>
	);
}

type AddQuickReplyHandle = {
	open: ({ id, message }: { id: string; message: string }) => void;
	close: () => void;
};

const AddQuickReplyDialog = forwardRef<
	AddQuickReplyHandle,
	{
		onConfirm: ({ id, message }: { id: string; message: string }) => void;
		onDelete: (id: string) => void;
	}
>(
	(
		{
			onConfirm,
			onDelete,
		}: {
			onConfirm: ({ id, message }: { id: string; message: string }) => void;
			onDelete: (id: string) => void;
		},
		ref
	) => {
		const toast = useToast();
		const [isOpen, setIsOpen] = useState(false);

		const [details, setDetails] = useState({ id: '', message: '' });

		useImperativeHandle(ref, () => ({
			open: ({ id, message }: { id: string; message: string }) => {
				setDetails({ id, message });
				setIsOpen(true);
			},
			close: () => setIsOpen(false),
		}));

		const handleConfirm = () => {
			if (!details.message) {
				return toast({
					title: 'Message cannot be empty',
					status: 'error',
				});
			}
			onConfirm(details);
			setIsOpen(false);
		};

		const handleDelete = () => {
			onDelete(details.id);
			setIsOpen(false);
		};

		const handleClose = () => {
			setIsOpen(false);
			setDetails({ id: '', message: '' });
		};

		return (
			<Modal isCentered variant={'outline'} isOpen={isOpen} onClose={handleClose} size={'3xl'}>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalHeader>
						{details.id ? 'Edit ' : 'Add '}
						Quick Reply
					</ModalHeader>
					<ModalBody>
						<HStack>
							<Textarea
								minHeight={'400px'}
								value={details.message}
								onChange={(e) => setDetails((prev) => ({ ...prev, message: e.target.value }))}
							/>
						</HStack>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme='red' mr={'auto'} variant={'outline'} onClick={handleDelete}>
							Delete
						</Button>
						<Button colorScheme='green' onClick={handleConfirm}>
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	}
);
