import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Checkbox,
	Flex,
	HStack,
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
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExtrasService from '../../../../services/extras.service';
import { StoreNames, StoreState } from '../../../../store';
import { setFAQAdding, setFAQList } from '../../../../store/reducers/FAQReducer';
import { FAQ } from '../../../../store/types/FAQState';
import Each from '../../../components/utils/Each';
import CreateFAQDialog, { FAQHandle } from './CreateFaqDialog';

export default function FAQPage() {
	const FAQDialogRef = useRef<FAQHandle>(null);

	const dispatch = useDispatch();
	const toast = useToast();

	const [selectedFAQ, setSelectedFAQ] = useState<number[]>([]);

	const {
		list,
		details,
		ui: { isLoading, isAdding },
	} = useSelector((state: StoreState) => state[StoreNames.FAQ]);

	const handleDeleteFAQ = () => {
		const filteredList = list.filter((_, i) => !selectedFAQ.includes(i));
		const promise = ExtrasService.createFAQs(filteredList);

		toast.promise(promise, {
			loading: { title: 'Deleting FAQ' },
			success: () => {
				dispatch(setFAQList(filteredList));
				setSelectedFAQ([]);
				return {
					title: 'FAQ Deleted',
					status: 'success',
				};
			},
			error: () => {
				return {
					title: 'Error while deleting FAQ',
				};
			},
		});
	};

	const handleFAQSave = (details: { title: string; info: string }, index?: number) => {
		let promise;
		let newList: FAQ[] = [];
		dispatch(setFAQAdding(true));
		if (index !== undefined) {
			newList = list.map((item, i) => {
				if (i === index) {
					return details;
				}
				return item;
			});
			promise = ExtrasService.createFAQs(newList);
		} else {
			promise = ExtrasService.createFAQs([...list, details]);
		}

		toast.promise(promise, {
			loading: { title: 'Creating FAQ' },
			success: () => {
				if (index !== undefined) {
					dispatch(setFAQList(newList));
				} else {
					dispatch(setFAQList([...list, details]));
				}
				return {
					title: 'FAQ Created',
					status: 'success',
				};
			},
			error: () => {
				return {
					title: 'Error while saving FAQ',
				};
			},
		});
		dispatch(setFAQAdding(false));
	};

	return (
		<Flex direction={'column'}>
			<HStack justifyContent={'flex-end'}>
				<Button
					colorScheme='red'
					variant={'outline'}
					leftIcon={<DeleteIcon />}
					onClick={handleDeleteFAQ}
					isDisabled={selectedFAQ.length === 0}
				>
					Delete
				</Button>
				<Button
					colorScheme='green'
					variant={'outline'}
					leftIcon={<AddIcon />}
					onClick={() => FAQDialogRef.current?.open(details)}
					isDisabled={isAdding}
				>
					Create FAQ
				</Button>
			</HStack>
			<TableContainer rounded={'2xl'} borderStyle={'dashed'} borderWidth={'2px'} mt={'1rem'}>
				<Table>
					<Thead>
						<Tr>
							<Th width={'5%'}>
								<Checkbox
									mr={'0.5rem'}
									onChange={(e) => {
										if (e.target.checked) {
											setSelectedFAQ(list.map((_, i) => i));
										} else {
											setSelectedFAQ([]);
										}
									}}
									isChecked={selectedFAQ.length === list.length && list.length > 0}
									isIndeterminate={selectedFAQ.length > 0 && selectedFAQ.length < list.length}
								/>
								Sl. no.
							</Th>
							<Th width={'45%'}>Title</Th>
							<Th width={'50%'}>Info</Th>
						</Tr>
					</Thead>
					<Tbody>
						{isLoading ? (
							<Tr>
								<Td colSpan={3}>
									<Skeleton height={'20px'} width={'20%'} />
								</Td>
							</Tr>
						) : list.length === 0 ? (
							<Tr>
								<Td colSpan={5}>
									<Box width={'full'} p={'1rem'}>
										<Text fontSize={'xl'} fontWeight={'bold'}>
											No FAQs found
										</Text>
									</Box>
								</Td>
							</Tr>
						) : (
							<Each
								items={list}
								render={(item, index) => (
									<Tr key={item.title}>
										<Td>
											<Checkbox
												mr={'0.5rem'}
												onChange={(e) => {
													if (e.target.checked) {
														setSelectedFAQ((prev) => [...prev, index]);
													} else {
														setSelectedFAQ((prev) => prev.filter((i) => i !== index));
													}
												}}
												isChecked={selectedFAQ.includes(list.indexOf(item))}
											/>
											{list.indexOf(item) + 1}
										</Td>
										<Td
											cursor={'pointer'}
											onClick={() => FAQDialogRef.current?.open(item, index)}
											whiteSpace={'pre-wrap'}
										>
											{item.title}
										</Td>
										<Td
											cursor={'pointer'}
											onClick={() => FAQDialogRef.current?.open(item, index)}
											whiteSpace={'pre-wrap'}
										>
											{item.info}
										</Td>
									</Tr>
								)}
							/>
						)}
					</Tbody>
				</Table>
			</TableContainer>
			<CreateFAQDialog onConfirm={handleFAQSave} ref={FAQDialogRef} />
		</Flex>
	);
}
