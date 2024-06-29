import {
	Button,
	Checkbox,
	Flex,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useSelector } from 'react-redux';
import useFilteredList from '../../../hooks/useFilteredList';
import MessagesService from '../../../services/messages.service';
import { StoreNames, StoreState } from '../../../store';
import { getFileSize } from '../../../utils/file-utils';
import SearchBar from '../searchBar';
import Each from '../utils/Each';

export type AttachmentDialogHandle = {
	open: ({ ids, type }: { ids: string[]; type: 'DOCUMENT' | 'PHOTOS' | 'VIDEO' | 'AUDIO' }) => void;
	close: () => void;
};

type Props = {
	onConfirm: (type: string, ids: string[]) => void;
	isSelect?: boolean;
	returnMediaId?: boolean;
};

const AttachmentSelectorDialog = forwardRef<AttachmentDialogHandle, Props>(
	({ onConfirm, isSelect = false, returnMediaId = true }: Props, ref) => {
		const [selected, setSelected] = useState<string[]>([]);
		const { list } = useSelector((state: StoreState) => state[StoreNames.MEDIA]);
		const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);
		const [isOpen, setOpen] = useState(false);
		const [type, setType] = useState<'DOCUMENT' | 'PHOTOS' | 'VIDEO' | 'AUDIO'>('DOCUMENT');
		const onClose = () => {
			setSelected([]);
			setOpen(false);
		};

		const handleAdd = () => {
			onConfirm(type, selected);
			onClose();
		};

		useImperativeHandle(ref, () => ({
			open: ({ ids, type }: { ids: string[]; type: 'DOCUMENT' | 'PHOTOS' | 'VIDEO' | 'AUDIO' }) => {
				setSelected(ids);
				setType(type);
				setOpen(true);
			},
			close: () => {
				setOpen(false);
			},
		}));

		const filteredResult = useFilteredList(list, {
			filename: 1,
		});
		const setSearchText = filteredResult.setSearchText;
		let filtered = filteredResult.filtered;
		filtered = filtered.filter((el) => {
			if (type === 'DOCUMENT') {
				return true;
			} else if (type === 'PHOTOS') {
				return el.mime_type.includes('image');
			} else if (type === 'VIDEO') {
				return el.mime_type.includes('video');
			} else if (type === 'AUDIO') {
				return el.mime_type.includes('audio');
			}
			return false;
		});
		return (
			<Modal isOpen={isOpen} onClose={onClose} size={'5xl'}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						<Flex
							alignItems={'center'}
							justifyContent={'space-between'}
							className='flex-col md:flex-row'
							gap={4}
						>
							<Text>Attachments</Text>
							<SearchBar onSearchTextChanged={setSearchText} />
						</Flex>
					</ModalHeader>
					<ModalBody>
						<TableContainer>
							<Table>
								<Thead>
									<Tr>
										<Th width={'10%'}>
											<Checkbox
												isChecked={filtered.length === selected.length && selected.length > 0}
												isIndeterminate={selected.length > 0 && selected.length !== filtered.length}
												onChange={(e) => {
													if (!e.target.checked) {
														setSelected([]);
													} else {
														setSelected(
															filtered.map((el) => (returnMediaId ? el.media_id : el.id))
														);
													}
												}}
											/>{' '}
											Sl no
										</Th>
										<Th width={'40%'}>filename</Th>
										<Th width={'40%'}>File Size</Th>
										<Th>File type</Th>
										<Th>Preview</Th>
									</Tr>
								</Thead>
								<Tbody>
									<Each
										items={filtered}
										render={(item, index) => (
											<Tr>
												<Td>
													<Checkbox
														isChecked={selected.includes(returnMediaId ? item.media_id : item.id)}
														mr={4}
														onChange={(e) => {
															if (e.target.checked) {
																setSelected((prev) => returnMediaId ? [...prev, item.media_id] : [...prev, item.id]);
															} else {
																setSelected((prev) => prev.filter((i) => i !== (returnMediaId ? item.media_id : item.id)));
															}
														}}
													/>
													{index + 1}
												</Td>
												<Td>{item.filename}</Td>
												<Td>{getFileSize(item.file_length)}</Td>
												<Td>{item.mime_type}</Td>
												<Td>
													<Button
														variant={'link'}
														onClick={() => {
															MessagesService.getMedia(selected_device_id, item.media_id).then(
																(res) => {
																	window.open(res.url);
																}
															);
														}}
													>
														Open
													</Button>
												</Td>
											</Tr>
										)}
									/>
								</Tbody>
							</Table>
						</TableContainer>
					</ModalBody>

					<ModalFooter>
						<Flex>
							<Button colorScheme='red' mr={3} onClick={onClose}>
								Cancel
							</Button>
							<Button
								isDisabled={!isSelect && selected.length === 0}
								colorScheme='green'
								onClick={handleAdd}
							>
								{isSelect ? 'Select' : 'Send'}
							</Button>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	}
);

export default AttachmentSelectorDialog;
