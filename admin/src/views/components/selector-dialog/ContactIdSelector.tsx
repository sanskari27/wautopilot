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
import { StoreNames, StoreState } from '../../../store';
import SearchBar from '../searchBar';
import Each from '../utils/Each';

export type ContactIdSelectorHandle = {
	open: (id: string[]) => void;
	close: () => void;
};

type Props = {
	onConfirm: (id: string[]) => void;
};

const ContactIdSelectorDialog = forwardRef<ContactIdSelectorHandle, Props>(
	({ onConfirm }: Props, ref) => {
		const [selected, setSelected] = useState<string[]>([]);
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
			open: (id: string[]) => {
				setSelected(id);
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
															console.log(filtered.map((item) => item.id));
															setSelected(filtered.map((item) => item.id));
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
															isChecked={selected.includes(item.id)}
															mr={4}
															onChange={(e) => {
																if (e.target.checked) {
																	setSelected((prev) => [...prev, item.id]);
																} else {
																	setSelected((prev) => {
																		return prev.filter((id) => id !== item.id);
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
								<Button colorScheme='green' onClick={handleAdd}>
									Select
								</Button>
							</Flex>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</>
		);
	}
);

export default ContactIdSelectorDialog;
