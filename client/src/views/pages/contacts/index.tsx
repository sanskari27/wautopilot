import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
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
import { useEffect, useRef } from 'react';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import APIInstance from '../../../config/APIInstance';
import useFilteredList from '../../../hooks/useFilteredList';
import ContactService from '../../../services/contact.service';
import { StoreNames, StoreState } from '../../../store';
import {
	addSelectedContact,
	nextPage,
	prevPage,
	removeSelectedContact,
	resetSelectedContacts,
	setContactList,
	setFetchingContact,
	setMaxPage,
} from '../../../store/reducers/ContactReducer';
import { Contact } from '../../../store/types/ContactState';
import ContactDrawer, { ContactHandle } from '../../components/contact-drawer';
import DeleteAlert, { DeleteAlertHandle } from '../../components/delete-alert';
import SearchBar from '../../components/searchBar';
import Each from '../../components/utils/Each';

const ContactPage = () => {
	const dispatch = useDispatch();
	const toast = useToast();
	const deleteDialog = useRef<DeleteAlertHandle>(null);
	const contactDrawerRef = useRef<ContactHandle>(null);
	const {
		list,
		uiDetails: { fetchingContact },
		pagination,
		selected,
	} = useSelector((state: StoreState) => state[StoreNames.CONTACT]);

	const { filtered, setSearchText } = useFilteredList(list, {
		formatted_name: 1,
	});

	useEffect(() => {
		const cancelToken = new AbortController();
		dispatch(setFetchingContact(true));
		APIInstance.get(`/contacts`, {
			params: {
				page: pagination.page,
				limit: 20,
			},
			signal: cancelToken.signal,
		})
			.then(({ data }) => {
				dispatch(setContactList(data.contacts as Contact[]));
				dispatch(setMaxPage(Math.ceil(data.totalRecords / 20)));
			})
			.finally(() => dispatch(setFetchingContact(false)));

		return () => {
			cancelToken.abort();
		};
	}, [pagination.page, dispatch]);

	const handleContactInput = (contact: Contact) => {
		if (!contact.id) {
			ContactService.addContact(contact).then((res) => {
				if (res) {
					dispatch(setContactList([contact, ...list]));
					toast({
						title: 'Contact added successfully',
						status: 'success',
					});
					return;
				}
				toast({
					title: 'Failed to add contact',
					status: 'error',
				});
			});
		} else {
			ContactService.updateContact(contact).then((res) => {
				if (res) {
					dispatch(setContactList(list.map((c) => (c.id === contact.id ? contact : c))));
					toast({
						title: 'Contact updated successfully',
						status: 'success',
					});
					return;
				}
				toast({
					title: 'Failed to update contact',
					status: 'error',
				});
			});
		}
	};

	const handleDeleteContact = () => {
		ContactService.deleteContact(selected).then((res) => {
			if (res) {
				dispatch(setContactList(list.filter((c) => !selected.includes(c.id))));
				dispatch(resetSelectedContacts());
				toast({
					title: 'Contact deleted successfully',
					status: 'success',
				});
				return;
			}
			toast({
				title: 'Failed to delete contact',
				status: 'error',
			});
		});
	};

	return (
		<Box padding={'1rem'}>
			<Flex justifyContent={'space-between'}>
				<Text fontSize={'2xl'} fontWeight={'bold'}>
					Contacts
				</Text>
				<Flex gap={3}>
					{selected.length > 0 && (
						<Button
							colorScheme='red'
							leftIcon={<DeleteIcon color='white' fontSize={'1rem'} />}
							onClick={() => {
								deleteDialog.current?.open();
							}}
						>
							Delete
						</Button>
					)}
					<Button
						colorScheme='teal'
						leftIcon={<AddIcon color='white' fontSize={'1rem'} />}
						onClick={() => {
							contactDrawerRef.current?.open({ editable: true });
						}}
					>
						Add
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
			<TableContainer width={'full'} border={'1px dashed gray'} rounded={'2xl'}>
				<Table variant='striped' colorScheme='gray'>
					<Thead>
						<Tr>
							<Th>S.No.</Th>
							<Th>Name</Th>
						</Tr>
					</Thead>
					<Tbody>
						{fetchingContact ? (
							<>
								<Each
									items={Array.from({ length: 20 })}
									render={() => (
										<Tr>
											<Td colSpan={7} textAlign={'center'}>
												<Skeleton height={'1.2rem'} />
											</Td>
										</Tr>
									)}
								/>
							</>
						) : filtered.length === 0 ? (
							<Tr>
								<Td colSpan={2} textAlign={'center'}>
									No records found
								</Td>
							</Tr>
						) : (
							<Each
								items={filtered}
								render={(record, index) => (
									<Tr cursor={'pointer'}>
										<Td width={'5%'}>
											<Checkbox
												colorScheme='green'
												mr={2}
												isChecked={selected.includes(record.id)}
												onChange={(e) => {
													if (e.target.checked) {
														dispatch(addSelectedContact(record.id));
													} else {
														dispatch(removeSelectedContact(record.id));
													}
												}}
											/>
											{pagination.page === 1 ? index + 1 : (pagination.page - 1) * 20 + index + 1}
										</Td>
										<Td
											onClick={() =>
												contactDrawerRef.current?.open({ contact: record, editable: true })
											}
										>
											{record.name.formatted_name}
										</Td>
									</Tr>
								)}
							/>
						)}
					</Tbody>
				</Table>
			</TableContainer>
			{/* <AssignLabelDialog ref={assignLabelDialog} /> */}
			<DeleteAlert ref={deleteDialog} onConfirm={handleDeleteContact} type='Records' />
			<ContactDrawer onConfirm={handleContactInput} ref={contactDrawerRef} />
			{/* <ContactInputDialog ref={drawerRef} /> */}
		</Box>
	);
};

export default ContactPage;
