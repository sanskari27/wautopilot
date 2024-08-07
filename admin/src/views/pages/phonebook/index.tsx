import {
	Box,
	Button,
	Checkbox,
	Flex,
	IconButton,
	Skeleton,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useToast,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { BiLabel, BiLeftArrow, BiPlus, BiRightArrow, BiSupport } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import APIInstance from '../../../config/APIInstance';
import { StoreNames, StoreState } from '../../../store';

import { DeleteIcon } from '@chakra-ui/icons';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { HiUpload } from 'react-icons/hi';
import { MdOutlineTextFields } from 'react-icons/md';
import { useFetchLabels } from '../../../hooks/useFetchLabels';
import useFilterLabels from '../../../hooks/useFilterLabels';
import AgentService from '../../../services/agent.service';
import MessagesService from '../../../services/messages.service';
import PhoneBookService from '../../../services/phonebook.service';
import {
	addSelected,
	addSelectedList,
	clearSelection,
	nextPage,
	prevPage,
	removeSelected,
	removeSelectedList,
	selectPhonebook,
	setFetching,
	setLabels,
	setMaxPage,
	setPhonebookList,
	setSelected,
} from '../../../store/reducers/PhonebookReducer';
import { PhonebookRecord } from '../../../store/types/PhonebookState';
import AgentFilter from '../../components/agentFilter';
import DeleteAlert, { DeleteAlertHandle } from '../../components/delete-alert';
import LabelFilter from '../../components/labelFilter';
import SearchBar from '../../components/searchBar';
import Each from '../../components/utils/Each';
import AddFieldDialog, { AddFieldDialogHandle } from './components/addField';
import AssignLabelDialog, { AssignLabelDialogHandle } from './components/assign-label';
import ContactInputDialog, { ContactInputDialogHandle } from './components/contact-input-dialog';
import UploadPhonebookDialog, { UploadPhonebookDialogHandle } from './components/upload-csv';

export default function Phonebook() {
	const dispatch = useDispatch();
	const toast = useToast();
	const drawerRef = useRef<ContactInputDialogHandle>(null);
	const uploadCSVDialog = useRef<UploadPhonebookDialogHandle>(null);
	const addFieldDialog = useRef<AddFieldDialogHandle>(null);
	const assignLabelDialog = useRef<AssignLabelDialogHandle>(null);
	const deleteDialog = useRef<DeleteAlertHandle>(null);
	const [searchText, setSearchText] = useState('');

	const { selectedLabels, onAddLabel, onClear, onRemoveLabel } = useFilterLabels();

	const { all_labels } = useFetchLabels();

	const {
		list,
		pagination,
		labels,
		selected,
		uiDetails: { isFetching },
	} = useSelector((state: StoreState) => state[StoreNames.PHONEBOOK]);
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);

	useEffect(() => {
		const cancelToken = new AbortController();
		dispatch(setFetching(true));
		APIInstance.get(`/phonebook`, {
			params: {
				page: pagination.page,
				limit: 20,
				search: searchText,
				labels: labels.join(','),
			},
			signal: cancelToken.signal,
		})
			.then(({ data }) => {
				dispatch(setPhonebookList(data.records as PhonebookRecord[]));
				dispatch(setMaxPage(Math.ceil(data.totalRecords / 20)));
			})
			.finally(() => dispatch(setFetching(false)));

		return () => {
			cancelToken.abort();
		};
	}, [pagination.page, labels, dispatch, searchText]);

	useEffect(() => {
		dispatch(clearSelection());
	}, [labels, dispatch]);

	const handleExport = () => {
		toast.promise(PhoneBookService.export(labels), {
			success: {
				title: 'Exported successfully',
			},
			error: {
				title: 'Failed to export',
			},
			loading: {
				title: 'Exporting...',
			},
		});
	};

	function openRecord(record: PhonebookRecord): void {
		dispatch(selectPhonebook(record.id));
		drawerRef.current?.open();
	}

	const handleAddLabel = (label: string) => {
		onAddLabel(label);
		dispatch(setLabels([...labels, label]));
	};

	const handleRemoveLabel = (label: string) => {
		onRemoveLabel(label);
		dispatch(setLabels(labels.filter((item) => item !== label)));
	};

	const handleClear = () => {
		onClear();
		dispatch(setLabels([]));
	};

	const refresh = () => {
		dispatch(setFetching(true));
		APIInstance.get(`/phonebook`, {
			params: {
				page: pagination.page,
				limit: 20,
				search: searchText,
				labels: labels.join(','),
			},
		})
			.then(({ data }) => {
				dispatch(setPhonebookList(data.records as PhonebookRecord[]));
				dispatch(setMaxPage(Math.ceil(data.totalRecords / 20)));
			})
			.finally(() => dispatch(setFetching(false)));
	};

	const handleDelete = () => {
		toast.promise(PhoneBookService.deleteRecords(selected), {
			success: () => {
				refresh();

				return {
					title: 'Deleted successfully',
				};
			},
			error: {
				title: 'Failed to delete',
			},
			loading: {
				title: 'Deleting...',
			},
		});
	};

	const toggleAllSelected = (allSelected: boolean) => {
		if (allSelected) {
			dispatch(addSelectedList(list.map((el) => el.id)));
		} else {
			dispatch(removeSelectedList(list.map((el) => el.id)));
		}
	};

	const handleAllSelected = () => {
		toast.promise(
			APIInstance.get(`/phonebook`, {
				params: {
					page: 1,
					limit: 99999999,
					labels: labels.join(','),
				},
			}),
			{
				success: ({ data }) => {
					const res = data.records as PhonebookRecord[];
					dispatch(setSelected(res.map((item) => item.id)));
					return {
						title: `Selected ${data.totalRecords} records`,
					};
				},
				error: {
					title: 'Failed to select all records',
				},
				loading: {
					title: 'loading...',
				},
			}
		);
	};

	const assignAgent = (agent_id: string) => {
		toast.promise(
			AgentService.assignConversationsToAgent(selected_device_id, agent_id, {
				phonebook_ids: selected,
			}),
			{
				success: () => {
					return {
						title: 'Assigned successfully',
					};
				},
				error: {
					title: 'Failed to assign',
				},
				loading: {
					title: 'Assigning...',
				},
			}
		);
	};

	const exportChats = () => {
		const promise = MessagesService.exportConversations(selected_device_id, selected);

		toast.promise(promise, {
			success: () => {
				return {
					title: 'Files exported successfully',
				};
			},
			error: {
				title: 'Failed to export files',
			},
			loading: {
				title: 'Exporting...',
			},
		});
	};

	const allChecked = list.every((item) => selected.includes(item.id));
	const allIntermediate = list.some((item) => selected.includes(item.id));

	return (
		<Box padding={'1rem'}>
			<Flex justifyContent={'space-between'}>
				<Text fontSize={'2xl'} fontWeight={'bold'}>
					Phonebook
				</Text>
				<Flex gap={3}>
					{selected.length !== 0 ? (
						<>
							<Button
								size={'sm'}
								colorScheme='red'
								leftIcon={<DeleteIcon color='white' fontSize={'1rem'} />}
								onClick={() => {
									deleteDialog.current?.open();
								}}
							>
								Delete
							</Button>
							<Button
								size={'sm'}
								colorScheme='orange'
								leftIcon={<FaCloudDownloadAlt color='white' fontSize={'1.2rem'} />}
								onClick={exportChats}
							>
								Export Chat
							</Button>
							<Button
								size={'sm'}
								colorScheme='teal'
								leftIcon={<BiLabel color='white' fontSize={'1.2rem'} />}
								onClick={() => {
									assignLabelDialog.current?.open();
								}}
							>
								Assign Tags
							</Button>
							<AgentFilter
								onConfirm={(ids) => assignAgent(ids[0])}
								buttonComponent={
									<Button size='sm' colorScheme='purple' leftIcon={<BiSupport />}>
										Assign Agent
									</Button>
								}
							/>
						</>
					) : (
						<>
							<Button
								size={'sm'}
								colorScheme='purple'
								leftIcon={<MdOutlineTextFields color='white' fontSize={'1.2rem'} />}
								onClick={() => {
									addFieldDialog.current?.open();
								}}
							>
								Add Fields
							</Button>
							<Button
								size={'sm'}
								colorScheme='teal'
								leftIcon={<FaCloudDownloadAlt color='white' fontSize={'1.2rem'} />}
								onClick={handleExport}
							>
								Export
							</Button>
						</>
					)}
					<Button
						size={'sm'}
						colorScheme='blue'
						leftIcon={<HiUpload color='white' fontSize={'1.2rem'} />}
						onClick={() => {
							uploadCSVDialog.current?.open();
						}}
					>
						Upload CSV
					</Button>
					<Button
						size={'sm'}
						colorScheme='green'
						leftIcon={<BiPlus color='white' fontSize={'1.2rem'} />}
						onClick={() => {
							drawerRef.current?.open();
						}}
					>
						Add Record
					</Button>
				</Flex>
			</Flex>
			<Flex
				justifyContent={'space-between'}
				alignItems={'center'}
				className='flex-col md:flex-row mt-4 md:mt-0'
				width={'full'}
			>
				<Flex flexGrow={1} gap={3} className='w-full md:w-fit'>
					<SearchBar onSearchTextChanged={setSearchText} />
					<LabelFilter
						labels={all_labels}
						onAddLabel={(label) => handleAddLabel(label)}
						onRemoveLabel={(label) => handleRemoveLabel(label)}
						onClear={handleClear}
						selectedLabels={selectedLabels}
					/>
				</Flex>
				<Flex gap={3} padding={'1rem'}>
					<IconButton
						onClick={() => dispatch(prevPage())}
						aria-label='Previous'
						icon={<BiLeftArrow />}
					/>
					<Text border={'1px solid black'} padding={'0.5rem'} rounded={'md'}>
						{pagination.page} / {pagination.maxPage}
					</Text>
					<IconButton
						onClick={() => dispatch(nextPage())}
						aria-label='Next'
						icon={<BiRightArrow />}
					/>
				</Flex>
			</Flex>
			<Flex
				justifyContent={'space-between'}
				hidden={selected.length === 0}
				px={'1.75rem'}
				fontWeight={'medium'}
			>
				<Flex cursor={'pointer'} textDecoration={'underline'} onClick={handleAllSelected}>
					Select all records
				</Flex>
				<Text textAlign={'right'}>{selected.length} records selected</Text>
			</Flex>
			<TableContainer width={'full'} border={'1px dashed gray'} rounded={'2xl'}>
				<Table variant='striped' colorScheme='gray'>
					<Thead>
						<Tr>
							<Th>
								<Checkbox
									colorScheme='green'
									isChecked={allChecked}
									isIndeterminate={!allChecked && allIntermediate}
									onChange={(e) => {
										toggleAllSelected(e.target.checked);
									}}
								/>{' '}
								S.No.
							</Th>
							<Th>Prefix</Th>
							<Th>Name</Th>
							<Th>Phone</Th>
							<Th>Email</Th>
							<Th>Birthday</Th>
							<Th>Anniversary</Th>
							<Th>Tags</Th>
						</Tr>
					</Thead>
					<Tbody>
						{isFetching ? (
							<>
								<Each
									items={Array.from({ length: 20 })}
									render={() => (
										<Tr>
											<Td colSpan={8} textAlign={'center'}>
												<Skeleton height={'1.2rem'} />
											</Td>
										</Tr>
									)}
								/>
							</>
						) : list.length === 0 ? (
							<Tr>
								<Td colSpan={8} textAlign={'center'}>
									No records found
								</Td>
							</Tr>
						) : (
							<Each
								items={list}
								render={(record, index) => (
									<Tr cursor={'pointer'}>
										<Td width={'5%'}>
											<Checkbox
												colorScheme='green'
												mr={2}
												isChecked={selected.includes(record.id)}
												onChange={(e) => {
													if (e.target.checked) {
														dispatch(addSelected(record.id));
													} else {
														dispatch(removeSelected(record.id));
													}
												}}
											/>
											{pagination.page === 1 ? index + 1 : (pagination.page - 1) * 20 + index + 1}
										</Td>
										<Td onClick={() => openRecord(record)}>{record.salutation}</Td>
										<Td onClick={() => openRecord(record)}>
											{record.first_name} {record.middle_name} {record.last_name}
										</Td>
										<Td onClick={() => openRecord(record)}>
											{record.phone_number.length > 0 ? `+${record.phone_number}` : ''}
										</Td>
										<Td onClick={() => openRecord(record)}>{record.email}</Td>
										<Td onClick={() => openRecord(record)}>{record.birthday}</Td>
										<Td onClick={() => openRecord(record)}>{record.anniversary}</Td>
										<Td onClick={() => openRecord(record)}>{record.labels.join(', ')}</Td>
									</Tr>
								)}
							/>
						)}
					</Tbody>
				</Table>
			</TableContainer>
			<AssignLabelDialog ref={assignLabelDialog} />
			<DeleteAlert ref={deleteDialog} onConfirm={handleDelete} type='Records' />
			<ContactInputDialog ref={drawerRef} onSave={refresh} />
			<UploadPhonebookDialog ref={uploadCSVDialog} />
			<AddFieldDialog ref={addFieldDialog} />
		</Box>
	);
}
