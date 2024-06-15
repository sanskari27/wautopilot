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
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import useFilteredList from '../../../hooks/useFilteredList';
import { StoreNames, StoreState } from '../../../store';
import { Contact } from '../../../store/types/ContactState';
import ContactDrawer, { ContactHandle } from '../contact-drawer';
import SearchBar from '../searchBar';
import Each from '../utils/Each';

export type ContactSelectorHandle = {
	open: (contact: Omit<Contact, 'id' | 'formatted_name'>[]) => void;
	close: () => void;
};

type Props = {
	onConfirm: (contact: Omit<Contact, 'id' | 'formatted_name'>[]) => void;
};

const ContactSelectorDialog = forwardRef<ContactSelectorHandle, Props>(
	({ onConfirm }: Props, ref) => {
		const addContactHandle = useRef<ContactHandle>(null);

		const [selected, setSelected] = useState<Omit<Contact, 'id' | 'formatted_name'>[]>([]);
		const { list } = useSelector((state: StoreState) => state[StoreNames.CONTACT]);
		const [isOpen, setOpen] = useState(false);
		const onClose = () => {
			setSelected([]);
			setOpen(false);
		};

		const handleAdd = () => {
			onConfirm(selected);
			onClose();
		};

		useImperativeHandle(ref, () => ({
			open: (contact: Omit<Contact, 'id' | 'formatted_name'>[]) => {
				setSelected(contact);
				setOpen(true);
			},
			close: () => {
				setOpen(false);
			},
		}));

		const { filtered, setSearchText } = useFilteredList(list, {
			formatted_name: 1,
		});
		return (
			<>
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
								<Text>Contacts</Text>
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
													isIndeterminate={
														selected.length > 0 && selected.length !== filtered.length
													}
													onChange={(e) => {
														if (!e.target.checked) {
															setSelected([]);
														} else {
															setSelected(filtered);
														}
													}}
												/>{' '}
												Sl no
											</Th>
											<Th>Name</Th>
										</Tr>
									</Thead>
									<Tbody>
										<Each
											items={filtered}
											render={(item, index) => (
												<Tr>
													<Td>
														<Checkbox
															isChecked={selected.includes(item)}
															mr={4}
															onChange={(e) => {
																if (e.target.checked) {
																	setSelected((prev) => [...prev, item]);
																} else {
																	setSelected((prev) => {
																		const index = prev.indexOf(item);
																		if (index !== -1) {
																			prev.splice(index, 1);
																		}
																		return [...prev];
																	});
																}
															}}
														/>
														{index + 1}
													</Td>
													<Td>{item.name?.formatted_name}</Td>
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
									colorScheme='teal'
									mr={3}
									onClick={() => {
										addContactHandle.current?.open({ editable: true });
									}}
								>
									Create new
								</Button>
								<Button isDisabled={selected.length === 0} colorScheme='green' onClick={handleAdd}>
									Select
								</Button>
							</Flex>
						</ModalFooter>
					</ModalContent>
					<ContactDrawer
						ref={addContactHandle}
						onConfirm={(contact) => {
							console.log(contact);
						}}
					/>
				</Modal>
			</>
		);
	}
);

export default ContactSelectorDialog;
