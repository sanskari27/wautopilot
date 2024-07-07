import { CloseIcon } from '@chakra-ui/icons';
import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	HStack,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
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
	clearLabels,
	removeLabels,
	setAgentDetails,
	setAgentEmail,
	setAgentName,
	setAgentPassword,
	setAgentPhone,
	toggleAutoAssignChats,
	toggleBroadcastCreate,
	toggleBroadcastExport,
	toggleBroadcastReport,
	toggleBroadcastUpdate,
	toggleButtonExport,
	toggleButtonRead,
	toggleChatbotCreate,
	toggleChatbotDelete,
	toggleChatbotExport,
	toggleChatbotFlowCreate,
	toggleChatbotFlowDelete,
	toggleChatbotFlowUpdate,
	toggleChatbotUpdate,
	toggleContactsCreate,
	toggleContactsDelete,
	toggleContactsUpdate,
	toggleMediaCreate,
	toggleMediaDelete,
	toggleMediaUpdate,
	togglePhonebookCreate,
	togglePhonebookDelete,
	togglePhonebookExport,
	togglePhonebookUpdate,
	toggleRecurringCreate,
	toggleRecurringDelete,
	toggleRecurringExport,
	toggleRecurringUpdate,
	toggleTemplateCreate,
	toggleTemplateDelete,
	toggleTemplateUpdate,
	updateAgent,
} from '../../../../store/reducers/AgentReducer';
import LabelFilter from '../../../components/labelFilter';
import Each from '../../../components/utils/Each';
import PermissionSwitch from './PermissionSwitch';

const AgentPermissionDialog = () => {
	const dispatch = useDispatch();
	const toast = useToast();
	const navigate = useNavigate();
	const { id } = useParams();
	const { all_labels } = useFetchLabels();

	const {
		agentPermissions: {
			assigned_labels,
			auto_assign_chats,
			broadcast,
			chatbot,
			chatbot_flow,
			contacts,
			media,
			phonebook,
			recurring,
			template,
			buttons,
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
				auto_assign_chats,
				broadcast,
				chatbot,
				chatbot_flow,
				contacts,
				media,
				phonebook,
				recurring,
				template,
				buttons,
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
					<Box px={'1rem'}>
						<PermissionSwitch
							onChange={(value) => dispatch(toggleAutoAssignChats(value))}
							label={'Auto Assign Chats'}
							isChecked={auto_assign_chats}
						/>
					</Box>
					<Accordion allowMultiple>
						<AccordionItem>
							<h2>
								<AccordionButton>
									<Box as='span' flex='1' textAlign='left'>
										Phonebook
									</Box>
									<AccordionIcon />
								</AccordionButton>
							</h2>
							<AccordionPanel pb={4}>
								<PermissionSwitch
									onChange={(value) => dispatch(togglePhonebookCreate(value))}
									label={'Create'}
									isChecked={phonebook.create}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(togglePhonebookUpdate(value))}
									label={'Update'}
									isChecked={phonebook.update}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(togglePhonebookDelete(value))}
									label={'Delete'}
									isChecked={phonebook.delete}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(togglePhonebookExport(value))}
									label={'Export'}
									isChecked={phonebook.export}
								/>
							</AccordionPanel>
						</AccordionItem>
						<AccordionItem>
							<h2>
								<AccordionButton>
									<Box as='span' flex='1' textAlign='left'>
										Templates
									</Box>
									<AccordionIcon />
								</AccordionButton>
							</h2>
							<AccordionPanel pb={4}>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleTemplateCreate(value))}
									label={'Create'}
									isChecked={template.create}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleTemplateUpdate(value))}
									label={'Update'}
									isChecked={template.update}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleTemplateDelete(value))}
									label={'Delete'}
									isChecked={template.delete}
								/>
							</AccordionPanel>
						</AccordionItem>
						<AccordionItem>
							<h2>
								<AccordionButton>
									<Box as='span' flex='1' textAlign='left'>
										Broadcast
									</Box>
									<AccordionIcon />
								</AccordionButton>
							</h2>
							<AccordionPanel pb={4}>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleBroadcastCreate(value))}
									label={'Create'}
									isChecked={broadcast.create}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleBroadcastUpdate(value))}
									label={'Update'}
									isChecked={broadcast.update}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleBroadcastExport(value))}
									label={'Export'}
									isChecked={broadcast.export}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleBroadcastReport(value))}
									label={'Report'}
									isChecked={broadcast.report}
								/>
							</AccordionPanel>
						</AccordionItem>
						<AccordionItem>
							<h2>
								<AccordionButton>
									<Box as='span' flex='1' textAlign='left'>
										Recurring Broadcast
									</Box>
									<AccordionIcon />
								</AccordionButton>
							</h2>
							<AccordionPanel pb={4}>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleRecurringCreate(value))}
									label={'Create'}
									isChecked={recurring.create}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleRecurringUpdate(value))}
									label={'Update'}
									isChecked={recurring.update}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleRecurringDelete(value))}
									label={'Delete'}
									isChecked={recurring.delete}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleRecurringExport(value))}
									label={'Export'}
									isChecked={recurring.export}
								/>
							</AccordionPanel>
						</AccordionItem>
						<AccordionItem>
							<h2>
								<AccordionButton>
									<Box as='span' flex='1' textAlign='left'>
										Media
									</Box>
									<AccordionIcon />
								</AccordionButton>
							</h2>
							<AccordionPanel pb={4}>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleMediaCreate(value))}
									label={'Create'}
									isChecked={media.create}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleMediaUpdate(value))}
									label={'Update'}
									isChecked={media.update}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleMediaDelete(value))}
									label={'Delete'}
									isChecked={media.delete}
								/>
							</AccordionPanel>
						</AccordionItem>
						<AccordionItem>
							<h2>
								<AccordionButton>
									<Box as='span' flex='1' textAlign='left'>
										Contacts
									</Box>
									<AccordionIcon />
								</AccordionButton>
							</h2>
							<AccordionPanel pb={4}>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleContactsCreate(value))}
									label={'Create'}
									isChecked={contacts.create}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleContactsUpdate(value))}
									label={'Update'}
									isChecked={contacts.update}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleContactsDelete(value))}
									label={'Delete'}
									isChecked={contacts.delete}
								/>
							</AccordionPanel>
						</AccordionItem>
						<AccordionItem>
							<h2>
								<AccordionButton>
									<Box as='span' flex='1' textAlign='left'>
										Chatbot
									</Box>
									<AccordionIcon />
								</AccordionButton>
							</h2>
							<AccordionPanel pb={4}>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleChatbotCreate(value))}
									label={'Create'}
									isChecked={chatbot.create}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleChatbotUpdate(value))}
									label={'Update'}
									isChecked={chatbot.update}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleChatbotDelete(value))}
									label={'Delete'}
									isChecked={chatbot.delete}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleChatbotExport(value))}
									label={'Export'}
									isChecked={chatbot.export}
								/>
							</AccordionPanel>
						</AccordionItem>
						<AccordionItem>
							<h2>
								<AccordionButton>
									<Box as='span' flex='1' textAlign='left'>
										Chatbot Flow
									</Box>
									<AccordionIcon />
								</AccordionButton>
							</h2>
							<AccordionPanel pb={4}>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleChatbotFlowCreate(value))}
									label={'Create'}
									isChecked={chatbot_flow.create}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleChatbotFlowUpdate(value))}
									label={'Update'}
									isChecked={chatbot_flow.update}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleChatbotFlowDelete(value))}
									label={'Delete'}
									isChecked={chatbot_flow.delete}
								/>
							</AccordionPanel>
						</AccordionItem>
						<AccordionItem>
							<h2>
								<AccordionButton>
									<Box as='span' flex='1' textAlign='left'>
										Button Analysis
									</Box>
									<AccordionIcon />
								</AccordionButton>
							</h2>
							<AccordionPanel pb={4}>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleButtonRead(value))}
									label={'Report'}
									isChecked={buttons.read}
								/>
								<PermissionSwitch
									onChange={(value) => dispatch(toggleButtonExport(value))}
									label={'Export'}
									isChecked={buttons.export}
								/>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
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
