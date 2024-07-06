import { DeleteIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
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
import { useRef } from 'react';
import { BiPlus } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import TemplateService from '../../../services/template.service';
import { StoreNames, StoreState } from '../../../store';
import { setTemplatesList } from '../../../store/reducers/TemplateReducer';
import { Template } from '../../../store/types/TemplateState';
import DeleteAlert, { DeleteAlertHandle } from '../../components/delete-alert';
import Each from '../../components/utils/Each';

export default function Templates() {
	const confirmationAlertDialogRef = useRef<DeleteAlertHandle>(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const toast = useToast();

	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);
	const {
		list,
		uiDetails: { isFetching },
	} = useSelector((state: StoreState) => state[StoreNames.TEMPLATES]);

	function editTemplate(record: Template): void {
		navigate(`${NAVIGATION.APP}/${NAVIGATION.TEMPLATES}/${NAVIGATION.EDIT_TEMPLATE}/${record.id}`);
	}

	const handleRemoveTemplate = (id: string) => {
		const record = list.find((item) => item.id === id);

		if (!record) return;

		toast.promise(TemplateService.removeTemplate(selected_device_id, record.id, record.name), {
			loading: { title: 'Removing Template' },
			success: () => {
				TemplateService.listTemplates(selected_device_id).then((templates) => {
					dispatch(setTemplatesList(templates));
				});
				return { title: 'Template removed successfully.', description: 'Updating list...' };
			},
			error: { title: 'Failed to remove template' },
		});
	};

	return (
		<Box padding={'1rem'}>
			<Flex justifyContent={'space-between'}>
				<Text fontSize={'2xl'} fontWeight={'bold'}>
					Templates
				</Text>
				<Flex gap={3}>
					<Link to={`${NAVIGATION.APP}/${NAVIGATION.TEMPLATES}/${NAVIGATION.ADD_TEMPLATE}`}>
						<Button colorScheme='green' leftIcon={<BiPlus color='white' fontSize={'1.2rem'} />}>
							Add Template
						</Button>
					</Link>
				</Flex>
			</Flex>

			<TableContainer width={'full'} border={'1px dashed gray'} rounded={'2xl'} mt={'1rem'}>
				<Table variant='striped' colorScheme='gray'>
					<Thead>
						<Tr>
							<Th>S.No.</Th>
							<Th>Name</Th>
							<Th>Status</Th>
							<Th>Category</Th>
							<Th></Th>
						</Tr>
					</Thead>
					<Tbody>
						{isFetching ? (
							<>
								<Each
									items={Array.from({ length: 5 })}
									render={() => (
										<Tr>
											<Td colSpan={5} textAlign={'center'}>
												<Skeleton height={'1.2rem'} />
											</Td>
										</Tr>
									)}
								/>
							</>
						) : list.length === 0 ? (
							<Tr>
								<Td colSpan={5} textAlign={'center'}>
									No records found
								</Td>
							</Tr>
						) : (
							<Each
								items={list}
								render={(record, index) => (
									<Tr cursor={'pointer'}>
										<Td width={'5%'} onClick={() => editTemplate(record)}>
											{index + 1}
										</Td>
										<Td onClick={() => editTemplate(record)}>{record.name}</Td>
										<Td onClick={() => editTemplate(record)}>{record.status}</Td>
										<Td onClick={() => editTemplate(record)}>{record.category}</Td>
										<Td width={'5%'}>
											<IconButton
												aria-label='Remove Device'
												colorScheme='red'
												size={'sm'}
												icon={<DeleteIcon color='white' fontSize={'0.75rem'} />}
												onClick={() => confirmationAlertDialogRef.current?.open(record.id)}
											/>
										</Td>
									</Tr>
								)}
							/>
						)}
					</Tbody>
				</Table>
			</TableContainer>
			<DeleteAlert
				ref={confirmationAlertDialogRef}
				onConfirm={handleRemoveTemplate}
				type='Template'
			/>
		</Box>
	);
}
