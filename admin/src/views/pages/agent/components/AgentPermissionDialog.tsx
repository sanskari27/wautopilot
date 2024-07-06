import { CloseIcon } from '@chakra-ui/icons';
import {
	Button,
	FormControl,
	FormLabel,
	HStack,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Switch,
	Tag,
	TagLabel,
	TagRightIcon,
	Text,
	useToast,
	Wrap,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { NAVIGATION } from '../../../../config/const';
import { useFetchLabels } from '../../../../hooks/useFetchLabels';
import AgentService from '../../../../services/agent.service';
import { StoreNames, StoreState } from '../../../../store';
import {
	addLabels,
	changeAutoAssignChats,
	changeBroadcastAccess,
	changeCanManipulatePhonebook,
	changeCanManipulateTemplate,
	changeChatbotAccess,
	changeChatbotFlowsAccess,
	changeContactsAccess,
	changeMediaAccess,
	changeRecurringBroadcast,
	changeViewBroadcastReport,
	clearLabels,
	createPhonebook,
	createTemplate,
	deletePhonebook,
	deleteTemplate,
	removeLabels,
	setAgentDetails,
	setAgentEmail,
	setAgentName,
	setAgentPassword,
	setAgentPhone,
	updateAgent,
	updatePhonebook,
	updateTemplate,
} from '../../../../store/reducers/AgentReducer';
import LabelFilter from '../../../components/labelFilter';
import Each from '../../../components/utils/Each';

const AgentPermissionDialog = () => {
	const dispatch = useDispatch();
	const toast = useToast();
	const navigate = useNavigate();
	const { id } = useParams();
	const { all_labels } = useFetchLabels();

	const {
		agentPermissions: {
			assigned_labels,
			create_broadcast,
			auto_assign_chats,
			can_manipulate_phonebook,
			can_manipulate_template,
			view_broadcast_report,
			create_recurring_broadcast,
			manage_chatbot,
			manage_chatbot_flows,
			manage_contacts,
			manage_media,
		},
	} = useSelector((state: StoreState) => state[StoreNames.AGENT]);

	const handleClose = () => {
		navigate(`${NAVIGATION.APP}/${NAVIGATION.AGENT}`);
	};

	const handleSave = () => {
		if (!id) return;

		const promise = AgentService.assignAgentPermission({
			agentId: id,
			permission: {
				assigned_labels,
				manage_chatbot: manage_chatbot,
				manage_chatbot_flows: manage_chatbot_flows,
				manage_contacts: manage_contacts,
				manage_media: manage_media,
				create_recurring_broadcast: create_recurring_broadcast,
				view_broadcast_reports: view_broadcast_report,
				create_broadcast: create_broadcast,
				create_phonebook: can_manipulate_phonebook.create_phonebook,
				update_phonebook: can_manipulate_phonebook.update_phonebook,
				delete_phonebook: can_manipulate_phonebook.delete_phonebook,
				auto_assign_chats: auto_assign_chats,
				create_template: can_manipulate_template.create_template,
				update_template: can_manipulate_template.update_template,
				delete_template: can_manipulate_template.delete_template,
			},
		});

		toast.promise(promise, {
			loading: { title: 'Saving...' },
			success: (data) => {
				dispatch(updateAgent(data));
				handleClose();
				return {
					title: 'Agent saved successfully',
				};
			},
			error: (err) => {
				return {
					title: err.message,
				};
			},
		});
	};

	const handleAddLabels = (label: string) => {
		dispatch(addLabels(label));
	};

	const handleRemoveLabels = (label: string) => {
		dispatch(removeLabels(label));
	};

	const handleClearLabels = () => {
		dispatch(clearLabels());
	};

	useEffect(() => {
		if (id) {
			dispatch(setAgentDetails(id));
		} else {
			dispatch(setAgentName(''));
			dispatch(setAgentEmail(''));
			dispatch(setAgentPhone(''));
			dispatch(setAgentPassword(''));
		}
	}, [dispatch, id]);

	return (
		<Modal isOpen={true} onClose={handleClose} size={'4xl'} scrollBehavior='inside'>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Assign Permissions</ModalHeader>
				<ModalBody>
					{(create_broadcast || can_manipulate_phonebook.access) && (
						<HStack mb={'0.25rem'}>
							<LabelFilter
								labels={all_labels}
								selectedLabels={assigned_labels}
								onAddLabel={handleAddLabels}
								onRemoveLabel={handleRemoveLabels}
								onClear={handleClearLabels}
							/>
							<Wrap
								width={'full'}
								borderWidth={'2px'}
								minH={'38px'}
								rounded={'lg'}
								borderStyle={'dashed'}
								p={'0.5rem'}
							>
								{assigned_labels.length === 0 && (
									<Text width={'full'} textAlign={'center'}>
										No labels selected
									</Text>
								)}
								<Each
									items={assigned_labels}
									render={(label) => (
										<Tag variant='outline' colorScheme='green' size={'sm'}>
											<TagLabel>{label}</TagLabel>
											<TagRightIcon
												cursor={'pointer'}
												as={CloseIcon}
												onClick={() => handleRemoveLabels(label)}
											/>
										</Tag>
									)}
								/>
							</Wrap>
						</HStack>
					)}
					<FormControl mb={'0.25rem'} borderBottom={'1px solid gray'} pb={'0.25rem'}>
						<HStack justifyContent={'space-between'}>
							<FormLabel m={0}>Broadcast Report access</FormLabel>
							<Switch
								onChange={(e) => dispatch(changeViewBroadcastReport(e.target.checked))}
								colorScheme={'green'}
								size='sm'
								isChecked={view_broadcast_report}
							/>
						</HStack>
					</FormControl>
					<FormControl mb={'0.25rem'} borderBottom={'1px solid gray'} pb={'0.25rem'}>
						<HStack justifyContent={'space-between'}>
							<FormLabel m={0}>Contacts access</FormLabel>
							<Switch
								onChange={(e) => dispatch(changeContactsAccess(e.target.checked))}
								colorScheme={'green'}
								size='sm'
								isChecked={manage_contacts}
							/>
						</HStack>
					</FormControl>
					<FormControl mb={'0.25rem'} borderBottom={'1px solid gray'} pb={'0.25rem'}>
						<HStack justifyContent={'space-between'}>
							<FormLabel m={0}>Media access</FormLabel>
							<Switch
								onChange={(e) => dispatch(changeMediaAccess(e.target.checked))}
								colorScheme={'green'}
								size='sm'
								isChecked={manage_media}
							/>
						</HStack>
					</FormControl>
					<FormControl mb={'0.25rem'} borderBottom={'1px solid gray'} pb={'0.25rem'}>
						<HStack justifyContent={'space-between'}>
							<FormLabel m={0}>Chatbot access</FormLabel>
							<Switch
								onChange={(e) => dispatch(changeChatbotAccess(e.target.checked))}
								colorScheme={'green'}
								size='sm'
								isChecked={manage_chatbot}
							/>
						</HStack>
					</FormControl>
					<FormControl mb={'0.25rem'} borderBottom={'1px solid gray'} pb={'0.25rem'}>
						<HStack justifyContent={'space-between'}>
							<FormLabel m={0}>Chatbot Flow access</FormLabel>
							<Switch
								onChange={(e) => dispatch(changeChatbotFlowsAccess(e.target.checked))}
								colorScheme={'green'}
								size='sm'
								isChecked={manage_chatbot_flows}
							/>
						</HStack>
					</FormControl>
					<FormControl mb={'0.25rem'} borderBottom={'1px solid gray'} pb={'0.25rem'}>
						<HStack justifyContent={'space-between'}>
							<FormLabel m={0}>Auto Assign Chats</FormLabel>
							<Switch
								onChange={(e) => dispatch(changeAutoAssignChats(e.target.checked))}
								colorScheme={'green'}
								size='sm'
								isChecked={auto_assign_chats}
							/>
						</HStack>
					</FormControl>
					<FormControl mb={'0.25rem'} borderBottom={'1px solid gray'} pb={'0.25rem'}>
						<HStack justifyContent={'space-between'}>
							<FormLabel m={0}>Create Recurring Broadcast</FormLabel>
							<Switch
								onChange={(e) => dispatch(changeRecurringBroadcast(e.target.checked))}
								colorScheme={'green'}
								size='sm'
								isChecked={create_recurring_broadcast}
							/>
						</HStack>
					</FormControl>
					<FormControl mb={'0.25rem'} borderBottom={'1px solid gray'} pb={'0.25rem'}>
						<HStack justifyContent={'space-between'}>
							<FormLabel m={0}>Broadcast access</FormLabel>
							<Switch
								onChange={(e) => dispatch(changeBroadcastAccess(e.target.checked))}
								colorScheme={'green'}
								size='sm'
								isChecked={create_broadcast}
							/>
						</HStack>
					</FormControl>

					<FormControl mb={'0.25rem'} borderBottom={'1px solid gray'} pb={'0.25rem'}>
						<HStack justifyContent={'space-between'}>
							<FormLabel m={0}>Manipulate Phonebook access</FormLabel>
							<Switch
								onChange={(e) => dispatch(changeCanManipulatePhonebook(e.target.checked))}
								colorScheme={'green'}
								size='sm'
								isChecked={can_manipulate_phonebook.access}
							/>
						</HStack>
						{can_manipulate_phonebook.access && (
							<>
								<HStack mt={'1rem'} justifyContent={'space-between'}>
									<FormLabel m={0}>Create phonebook</FormLabel>
									<Switch
										onChange={(e) => dispatch(createPhonebook(e.target.checked))}
										colorScheme={'green'}
										size='sm'
										isChecked={can_manipulate_phonebook.create_phonebook}
									/>
								</HStack>
								<HStack justifyContent={'space-between'}>
									<FormLabel m={0}>Update Phonebook</FormLabel>
									<Switch
										onChange={(e) => dispatch(updatePhonebook(e.target.checked))}
										colorScheme={'green'}
										size='sm'
										isChecked={can_manipulate_phonebook.update_phonebook}
									/>
								</HStack>
								<HStack justifyContent={'space-between'}>
									<FormLabel m={0}>Delete Phonebook</FormLabel>
									<Switch
										onChange={(e) => dispatch(deletePhonebook(e.target.checked))}
										colorScheme={'green'}
										size='sm'
										isChecked={can_manipulate_phonebook.delete_phonebook}
									/>
								</HStack>
							</>
						)}
					</FormControl>
					<FormControl mb={'0.25rem'} borderBottom={'1px solid gray'} pb={'0.25rem'}>
						<HStack justifyContent={'space-between'}>
							<FormLabel m={0}>Manipulate template access</FormLabel>
							<Switch
								onChange={(e) => dispatch(changeCanManipulateTemplate(e.target.checked))}
								colorScheme={'green'}
								size='sm'
								isChecked={can_manipulate_template.access}
							/>
						</HStack>
						{can_manipulate_template.access && (
							<>
								<HStack mt={'1rem'} justifyContent={'space-between'}>
									<FormLabel m={0}>Create template</FormLabel>
									<Switch
										onChange={(e) => dispatch(createTemplate(e.target.checked))}
										colorScheme={'green'}
										size='sm'
										isChecked={can_manipulate_template.create_template}
									/>
								</HStack>
								<HStack justifyContent={'space-between'}>
									<FormLabel m={0}>Update template</FormLabel>
									<Switch
										onChange={(e) => dispatch(updateTemplate(e.target.checked))}
										colorScheme={'green'}
										size='sm'
										isChecked={can_manipulate_template.update_template}
									/>
								</HStack>
								<HStack justifyContent={'space-between'}>
									<FormLabel m={0}>Delete template</FormLabel>
									<Switch
										onChange={(e) => dispatch(deleteTemplate(e.target.checked))}
										colorScheme={'green'}
										size='sm'
										isChecked={can_manipulate_template.delete_template}
									/>
								</HStack>
							</>
						)}
					</FormControl>
				</ModalBody>
				<ModalFooter>
					<Button colorScheme='red' variant={'outline'} mr={3} onClick={handleClose}>
						Close
					</Button>
					<Button colorScheme={'green'} onClick={handleSave}>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AgentPermissionDialog;
