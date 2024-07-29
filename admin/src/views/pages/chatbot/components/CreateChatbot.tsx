/* eslint-disable no-mixed-spaces-and-tabs */
import { CheckIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import {
	AbsoluteCenter,
	Box,
	Button,
	Divider,
	Flex,
	FormControl,
	HStack,
	IconButton,
	Input,
	Select,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	useToast,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { BiRefresh } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { NAVIGATION } from '../../../../config/const';
import ChatBotService from '../../../../services/chatbot.service';
import UploadService from '../../../../services/upload.service';
import { StoreNames, StoreState } from '../../../../store';
import {
	addBot,
	clearSelectedTemplate,
	reset,
	setAddingBot,
	setChatbot,
	setCondition,
	setEndAt,
	setForwardMessage,
	setForwardNumber,
	setHeaderFile,
	setRespondTo,
	setRespondType,
	setResponseDelayTime,
	setResponseDelayType,
	setSelectedTemplate,
	setStartAt,
	setTemplateBodyCustomText,
	setTemplateBodyFallbackValue,
	setTemplateBodyPhonebookData,
	setTemplateBodyVariableFrom,
	setTemplateHeaderLink,
	setTemplateHeaderMediaId,
	setTrigger,
	setTriggerGapTime,
	setTriggerGapType,
	updateBot,
} from '../../../../store/reducers/ChatBotReducer';
import TemplateComponentParameter from '../../../components/template-component-parameters';
import Each from '../../../components/utils/Each';
import { NumberInput, SelectElement, TextAreaElement, TextInput } from './Inputs';
import LeadsNurturing, { LeadsNurturingHandle } from './LeadsNurturingDialog';
import StaticMessageInput from './StaticMessageInput';

export default function CreateChatBot() {
	const dispatch = useDispatch();
	const toast = useToast();
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		if (id) {
			dispatch(setChatbot(id));
		} else {
			dispatch(reset());
		}
	}, [dispatch, id]);

	const leadsNurtureRef = useRef<LeadsNurturingHandle>(null);

	const { list: templateList } = useSelector((state: StoreState) => state[StoreNames.TEMPLATES]);
	const { details, response_delay, trigger_gap, template_header_file, ui } = useSelector(
		(state: StoreState) => state[StoreNames.CHATBOT]
	);

	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);

	const {
		trigger,
		message,
		options,
		respond_to,
		contacts,
		audios,
		documents,
		videos,
		images,
		template_body,
		template_header,
		template_id,
		respond_type,
		nurturing,
		forward,
	} = details;
	const { isAddingBot, isEditingBot } = ui;

	const templateListFiltered = templateList.filter((t) => t.status === 'APPROVED');
	const selectedTemplate = templateListFiltered.find((t) => t.id === details.template_id);

	function validate() {
		let hasError = false;

		if (respond_type === 'normal') {
			if (
				!message &&
				audios.length === 0 &&
				documents.length === 0 &&
				images.length === 0 &&
				contacts.length === 0 &&
				videos.length === 0
			) {
				toast({
					title: 'Message content is required',
					status: 'error',
				});
				hasError = true;
			}
		}
		if (respond_type === 'template') {
			if (template_id === '') {
				toast({
					title: 'Template is required',
					status: 'error',
				});
				hasError = true;
			}

			if (template_header?.type === ('IMAGE' || 'VIDEO' || 'DOCUMENT')) {
				if (!template_header_file && !template_header.link && !template_header.media_id) {
					toast({
						title: 'Header link or file is required',
						status: 'error',
					});
					hasError = true;
				}
			}

			const invalid = template_body.some((body) => {
				if (body.variable_from === 'phonebook_data') {
					if (!body.phonebook_data || !body.fallback_value) {
						return true;
					}
				} else if (body.variable_from === 'custom_text' && !body.custom_text) {
					return true;
				}
			});
			if (invalid) {
				toast({
					title: 'Phonebook Data & Fallback Value is required',
					status: 'error',
				});
			}
			hasError = true;
		}

		return !hasError;
	}

	const handleTemplateChange = (templateId: string) => {
		if (!templateId) {
			dispatch(clearSelectedTemplate());
		}
		const template = templateList.find((t) => t.id === templateId);
		if (!template) return;
		dispatch(setSelectedTemplate(template));
	};

	const handleTemplateDetailsChange = ({
		headerLink,
		headerFile,
		headerMediaId,
		body,
	}: {
		headerLink?: string;
		headerFile?: File | null;
		headerMediaId: string;
		body?: {
			index: number;
			custom_text: string;
			phonebook_data: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value: string;
		};
	}) => {
		dispatch(setTemplateHeaderMediaId(headerMediaId ?? ''));
		dispatch(setTemplateHeaderLink(headerLink ?? ''));
		if (headerFile) {
			dispatch(setHeaderFile(headerFile));
		}
		if (body) {
			dispatch(setTemplateBodyCustomText({ index: body.index, custom_text: body.custom_text }));
			dispatch(
				setTemplateBodyPhonebookData({ index: body.index, phonebook_data: body.phonebook_data })
			);
			dispatch(
				setTemplateBodyVariableFrom({
					index: body.index,
					variable_from: body.variable_from,
				})
			);
			dispatch(
				setTemplateBodyFallbackValue({ index: body.index, fallback_value: body.fallback_value })
			);
		}
	};

	async function handleSave() {
		if (!validate()) {
			return;
		}
		if (isEditingBot && !details.id) return;

		if (template_header_file) {
			toast.promise(UploadService.generateMetaMediaId(selected_device_id, template_header_file), {
				success: (media_id) => {
					addChatBot(media_id);
					return {
						title: 'File uploaded',
					};
				},
				error: {
					title: 'Failed to upload file',
				},
				loading: {
					title: 'Uploading file',
				},
			});
		} else {
			addChatBot();
		}
	}

	const addChatBot = (mediaId?: string) => {
		const chatbotDetails = {
			...details,
			...(details.template_header
				? {
						template_header: {
							...details.template_header,
							media_id: mediaId,
						},
				  }
				: {}),
			nurturing: details.nurturing.map((n) => {
				return {
					...n,
					after:
						n.after.type === 'days'
							? Number(n.after.value) * 86400
							: n.after.type === 'hours'
							? Number(n.after.value) * 3600
							: Number(n.after.value) * 60,
				};
			}),
		};

		dispatch(setAddingBot(true));
		const promise = isEditingBot
			? // ? null
			  ChatBotService.editChatBot({
					deviceId: selected_device_id,
					botId: details.id,
					details: chatbotDetails,
			  })
			: ChatBotService.createBot({
					deviceId: selected_device_id,
					details: chatbotDetails,
			  });
		toast.promise(promise, {
			success: (data) => {
				const acton = isEditingBot ? updateBot(data[0]) : addBot(data[0]);
				dispatch(acton);
				dispatch(reset());
				navigate(`${NAVIGATION.APP}/${NAVIGATION.CHATBOT}`);
				return {
					title: 'Data saved successfully',
				};
			},
			error: { title: 'Error Saving Bot' },
			loading: { title: 'Saving Data', description: 'Please wait' },
		});
	};

	return (
		<Flex
			direction={'column'}
			gap={'0.5rem'}
			className='custom-scrollbar'
			justifyContent={'center'}
			p={'1rem'}
		>
			{/*--------------------------------- TRIGGER SECTION--------------------------- */}
			<Flex direction={'column'} borderRadius={'20px'} mb={'1rem'} gap={2}>
				<FormControl
					// isInvalid={!!ui.triggerError}
					display={'flex'}
					flexDirection={'column'}
					gap={2}
				>
					<Button
						leftIcon={<ChevronLeftIcon w={6} h={6} />}
						alignSelf={'flex-start'}
						variant={'link'}
						onClick={() => navigate(`${NAVIGATION.APP}/${NAVIGATION.CHATBOT}`)}
					>
						Back to all chatbots
					</Button>
					<Flex justifyContent={'space-between'} alignItems={'center'}>
						<Text>Trigger</Text>
						<Flex gap={2} alignItems={'center'}>
							<IconButton
								isRound={true}
								variant='solid'
								aria-label='Done'
								size='xs'
								icon={!trigger ? <CheckIcon color='white' /> : <></>}
								onClick={() => {
									dispatch(setTrigger(''));
								}}
								className={`${!trigger ? '!bg-[#4CB072]' : '!bg-[#A6A6A6] '} hover:!bg-green-700 `}
							/>
							<Text fontSize='sm'>Default Message</Text>
						</Flex>
					</Flex>
					<TextAreaElement
						value={trigger ?? ''}
						onChange={(e) => {
							dispatch(setTrigger(e.target.value));
						}}
						placeholder={'ex. hello'}
					/>
				</FormControl>

				{/*--------------------------------- RECIPIENTS SECTION--------------------------- */}

				<Flex gap={4}>
					<FormControl flexGrow={1}>
						<Text>Recipients</Text>
						<SelectElement
							value={respond_to}
							onChangeText={(text) =>
								dispatch(setRespondTo(text as 'ALL' | 'SAVED_CONTACTS' | 'NON_SAVED_CONTACTS'))
							}
							options={[
								{
									value: 'ALL',
									title: 'All',
								},
								{
									value: 'SAVED_CONTACTS',
									title: 'Saved Contacts',
								},
								{
									value: 'NON_SAVED_CONTACTS',
									title: 'Non Saved Contacts',
								},
							]}
						/>
					</FormControl>
					<FormControl flexGrow={1}>
						<Text>Conditions</Text>
						<SelectElement
							value={options}
							onChangeText={(text) =>
								dispatch(
									setCondition(
										text as
											| 'INCLUDES_IGNORE_CASE'
											| 'INCLUDES_MATCH_CASE'
											| 'EXACT_IGNORE_CASE'
											| 'EXACT_MATCH_CASE'
									)
								)
							}
							options={[
								{
									value: 'INCLUDES_IGNORE_CASE',
									title: 'Includes Ignore Case',
								},
								{
									value: 'INCLUDES_MATCH_CASE',
									title: 'Includes Match Case',
								},
								{
									value: 'EXACT_IGNORE_CASE',
									title: 'Exact Ignore Case',
								},
								{
									value: 'EXACT_MATCH_CASE',
									title: 'Exact Match Case',
								},
							]}
						/>
					</FormControl>
				</Flex>

				{/*--------------------------------- GAP & DELAY SECTION--------------------------- */}
				<Flex gap={'1rem'} className='flex-col md:flex-row'>
					<Flex flex={1} gap={'0.5rem'} className='flex-col md:flex-row'>
						<FormControl flex={1}>
							<Flex alignItems={'center'}>
								<Text>Gap Delay</Text>
								{/* <Info>Time Gap if same trigger is sent.</Info> */}
							</Flex>

							<HStack>
								<NumberInput
									value={trigger_gap.time}
									onChangeText={(text) => dispatch(setTriggerGapTime(text))}
								/>
								<SelectElement
									value={trigger_gap.type}
									onChangeText={(text) => dispatch(setTriggerGapType(text))}
									options={[
										{
											value: 'SEC',
											title: 'Second',
										},
										{
											value: 'MINUTE',
											title: 'Min',
										},
										{
											value: 'HOUR',
											title: 'Hour',
										},
									]}
								/>
							</HStack>
						</FormControl>
						<FormControl flex={1}>
							<Flex alignItems={'center'}>
								<Text>Message Delay</Text>
								{/* <Info>Time Delay between trigger and response.</Info> */}
							</Flex>
							<HStack>
								<NumberInput
									value={response_delay.time}
									onChangeText={(text) => dispatch(setResponseDelayTime(text))}
								/>
								<SelectElement
									value={response_delay.type}
									onChangeText={(text) => dispatch(setResponseDelayType(text))}
									options={[
										{
											value: 'SEC',
											title: 'Second',
										},
										{
											value: 'MINUTE',
											title: 'Min',
										},
										{
											value: 'HOUR',
											title: 'Hour',
										},
									]}
								/>
							</HStack>
						</FormControl>
					</Flex>
					<Flex flex={1} className='flex-col md:flex-row' gap={'0.5rem'}>
						<FormControl flex={1}>
							<Text>Start At (in IST)</Text>
							<Input
								type='time'
								placeholder='00:00'
								rounded={'md'}
								value={details.startAt}
								onChange={(e) => dispatch(setStartAt(e.target.value))}
							/>
						</FormControl>
						<FormControl flex={1}>
							<Text>End At (in IST)</Text>
							<Input
								type='time'
								width={'full'}
								placeholder='23:59'
								rounded={'md'}
								value={details.endAt}
								onChange={(e) => dispatch(setEndAt(e.target.value))}
							/>
						</FormControl>
					</Flex>
				</Flex>

				{/*--------------------------------- MESSAGE SECTION--------------------------- */}

				<Tabs
					variant='soft-rounded'
					colorScheme='green'
					mt={'1rem'}
					index={respond_type === 'normal' ? 0 : 1}
				>
					<TabList>
						<Tab onClick={() => dispatch(setRespondType('normal'))}>Normal Message</Tab>
						<Tab onClick={() => dispatch(setRespondType('template'))}>Template Message</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<StaticMessageInput />
						</TabPanel>
						<TabPanel>
							<FormControl>
								<Select
									placeholder='Select one!'
									value={details.template_id}
									onChange={(e) => handleTemplateChange(e.target.value)}
								>
									<Each
										items={templateListFiltered}
										render={(t) => <option value={t.id}>{t.name}</option>}
									/>
								</Select>
							</FormControl>

							<TemplateComponentParameter
								header={template_header ?? { type: '', link: '', media_id: '' }}
								headerFile={template_header_file}
								headerMediaId={details.template_header?.media_id ?? ''}
								components={selectedTemplate?.components ?? []}
								body={template_body ?? []}
								headerLink={details.template_header?.link ?? ''}
								handleTemplateDetailsChange={handleTemplateDetailsChange}
							/>
						</TabPanel>
					</TabPanels>
				</Tabs>
				<Flex justifyContent={'flex-end'} m={'1rem'}>
					<Button colorScheme='teal' onClick={() => leadsNurtureRef.current?.open()}>
						Leads Nurturing ({nurturing.length})
					</Button>
					<LeadsNurturing ref={leadsNurtureRef} />
				</Flex>
				{/* -------------------------------- FORWARD SECTION -------------------------- */}
				<Flex direction={'column'} gap={2} mt={'1rem'}>
					<Box position='relative'>
						<Divider height='2px' />
						<AbsoluteCenter bg='white' px='4' color='gray.500'>
							Forward Leads
						</AbsoluteCenter>
					</Box>
					<Box flex={1} mt={'0.5rem'}>
						<Text className='text-gray-700 dark:text-gray-400'>Forward To (without +)</Text>
						<TextInput
							placeholder='ex 9175XXXXXX68'
							value={forward.number ?? ''}
							onChangeText={(text) => dispatch(setForwardNumber(text))}
						/>
					</Box>

					<Box flex={1}>
						<Text className='text-gray-700 dark:text-gray-400'>Forward Message</Text>
						<TextAreaElement
							value={forward.message ?? ''}
							onChange={(e) => dispatch(setForwardMessage(e.target.value))}
							isInvalid={false}
							placeholder={'ex. Forwarded Lead'}
						/>
					</Box>
				</Flex>

				<Divider my={'1rem'} />

				{/*--------------------------------- BUTTONS SECTION--------------------------- */}

				<HStack justifyContent={'space-between'} alignItems={'center'} py={8}>
					{isEditingBot && (
						<Button
							bgColor={'red.300'}
							width={'100%'}
							onClick={() => {
								dispatch(reset());
								navigate(`${NAVIGATION.APP}/${NAVIGATION.CHATBOT}`);
							}}
							isLoading={isAddingBot}
						>
							<Text color={'white'}>Cancel</Text>
						</Button>
					)}
					<Button
						isLoading={isAddingBot}
						bgColor={'green.300'}
						_hover={{
							bgColor: 'green.400',
						}}
						width={'100%'}
						onClick={handleSave}
					>
						<Text color={'white'}>Save</Text>
					</Button>
					<IconButton
						aria-label='reest'
						icon={<BiRefresh />}
						onClick={() => {
							dispatch(reset());
							navigate(`${NAVIGATION.APP}/${NAVIGATION.CHATBOT}/new`);
						}}
					/>
				</HStack>
			</Flex>
		</Flex>
	);
}
