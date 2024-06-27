/* eslint-disable no-mixed-spaces-and-tabs */
import { CheckIcon } from '@chakra-ui/icons';
import {
	Button,
	Divider,
	Flex,
	FormControl,
	FormErrorMessage,
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
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatBotService from '../../../services/chatbot.service';
import UploadService from '../../../services/upload.service';
import { StoreNames, StoreState } from '../../../store';
import {
	addBot,
	reset,
	setAddingBot,
	setBodyParameterCount,
	setCondition,
	setEndAt,
	setError,
	setMessage,
	setRespondTo,
	setResponseDelayTime,
	setResponseDelayType,
	setStartAt,
	setTemplateId,
	setTrigger,
	setTriggerGapTime,
	setTriggerGapType,
} from '../../../store/reducers/ChatBotReducer';
import { countOccurrences } from '../../../utils/templateHelper';
import TemplateComponentParameter, {
	ComponentParameterHandle,
} from '../../components/template-component-parameters';
import Each from '../../components/utils/Each';
import AllResponders from './components/AllResponders';
import { NumberInput, SelectElement, TextAreaElement } from './components/Inputs';
import StaticMessageInput from './components/StaticMessageInput';

export default function ChatBotPage() {
	const componentParameterRef = useRef<ComponentParameterHandle>(null);

	const dispatch = useDispatch();
	const toast = useToast();

	const [messageType, setMessageType] = useState<'static' | 'template'>('static');

	const { list: templateList } = useSelector((state: StoreState) => state[StoreNames.TEMPLATES]);
	const { details, response_delay, trigger_gap, ui } = useSelector(
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
		response_delay_seconds,
		trigger_gap_seconds,
		template_body,
	} = details;
	const { isAddingBot, isEditingBot } = ui;

	const templateListFiltered = templateList.filter((t) => t.status === 'APPROVED');
	const selectedTemplate = templateListFiltered.find((t) => t.id === details.template_id);

	function validate() {
		const errorPayload: {
			type:
				| 'triggerError'
				| 'messageError'
				| 'respondToError'
				| 'optionsError'
				| 'contactCardsError'
				| 'attachmentError'
				| 'triggerGapError'
				| 'responseGapError'
				| 'startAtError'
				| 'endAtError';
			error: string;
		} = {
			type: 'triggerError',
			error: '',
		};

		let notHasError = true;

		errorPayload.type = 'triggerError';
		errorPayload.error = '';
		dispatch(setError(errorPayload));

		if (
			!message &&
			audios.length === 0 &&
			documents.length === 0 &&
			images.length === 0 &&
			contacts.length === 0 &&
			videos.length === 0
		) {
			errorPayload.type = 'messageError';
			errorPayload.error = 'Message or Attachment or Contact or Poll is required';
			dispatch(setError(errorPayload));
			notHasError = false;
		} else {
			errorPayload.type = 'messageError';
			errorPayload.error = '';
			dispatch(setError(errorPayload));
		}

		if (!respond_to) {
			errorPayload.type = 'respondToError';
			errorPayload.error = 'Recipients is required';
			dispatch(setError(errorPayload));
			notHasError = false;
		} else {
			errorPayload.type = 'respondToError';
			errorPayload.error = '';
			dispatch(setError(errorPayload));
		}

		if (!options) {
			errorPayload.type = 'optionsError';
			errorPayload.error = 'Conditions is required';
			dispatch(setError(errorPayload));
			notHasError = false;
		} else {
			errorPayload.type = 'optionsError';
			errorPayload.error = '';
			dispatch(setError(errorPayload));
		}

		if (response_delay_seconds <= 0) {
			errorPayload.type = 'responseGapError';
			errorPayload.error = 'Invalid Message Delay';
			dispatch(setError(errorPayload));
			notHasError = false;
		} else {
			errorPayload.type = 'responseGapError';
			errorPayload.error = '';
			dispatch(setError(errorPayload));
		}

		if (trigger_gap_seconds <= 0) {
			errorPayload.type = 'triggerGapError';
			errorPayload.error = 'Invalid Delay Gap';
			dispatch(setError(errorPayload));
			notHasError = false;
		} else {
			errorPayload.type = 'triggerGapError';
			errorPayload.error = '';
			dispatch(setError(errorPayload));
		}
		if (!details.startAt) {
			errorPayload.type = 'startAtError';
			errorPayload.error = 'Invalid Start Time';
			dispatch(setError(errorPayload));
			notHasError = false;
		} else {
			errorPayload.type = 'startAtError';
			errorPayload.error = '';
		}
		if (!details.endAt) {
			errorPayload.type = 'endAtError';
			errorPayload.error = 'Invalid End Time';
			dispatch(setError(errorPayload));
			notHasError = false;
		} else {
			errorPayload.type = 'endAtError';
			errorPayload.error = '';
		}

		if (messageType === 'template') {
			console.log(componentParameterRef.current?.validate());
		}

		return notHasError;
	}

	useEffect(() => {
		const template = templateList.find((t) => t.id === details.template_id);
		if (!template) return;

		const body = template.components.find((c) => c.type === 'BODY');
		const variables = countOccurrences(body?.text ?? '');
		dispatch(setBodyParameterCount(variables));
	}, [templateList, dispatch, details.template_id]);

	async function handleSave() {
		if (!validate()) {
			return;
		}
		if (!componentParameterRef.current?.validate()) {
			return;
		}
		if (isEditingBot && !details.id) return;

		const templateMessageDetails = componentParameterRef.current?.getTemplateDetails();

		if (templateMessageDetails?.headerFile) {
			toast.promise(
				UploadService.generateMetaMediaId(selected_device_id, templateMessageDetails.headerFile),
				{
					success: (media_id) => {
						addChatBot({ media_id });
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
				}
			);
		} else if (templateMessageDetails?.headerLink) {
			addChatBot({ link: templateMessageDetails?.headerLink });
		} else {
			addChatBot();
		}
	}

	const addChatBot = (header_media: { link?: string; media_id?: string } = {}) => {
		const ChatbotDetails =
			messageType === 'static'
				? {
						...details,
						template_id: '',
				  }
				: {
						...details,
						template_header: {
							type: details.template_header.type,
							...header_media,
						},
				  };

		console.log('ChatbotDetails', ChatbotDetails);
		dispatch(setAddingBot(true));
		const promise = isEditingBot
			? // ? null
			  ChatBotService.createBot({ deviceId: selected_device_id, details: ChatbotDetails })
			: ChatBotService.createBot({ deviceId: selected_device_id, details: ChatbotDetails });
		toast.promise(promise, {
			success: (data) => {
				const acton = isEditingBot ? addBot(data) : addBot(data);
				dispatch(acton);
				dispatch(reset());
				return {
					title: 'Data saved successfully',
				};
			},
			error: {
				title: 'Error Saving Bot',
			},
			loading: { title: 'Saving Data', description: 'Please wait' },
		});
		dispatch(reset());
	};

	return (
		<Flex
			direction={'column'}
			gap={'0.5rem'}
			className='custom-scrollbar'
			justifyContent={'center'}
			p={'1rem'}
		>
			<Text fontSize={'2xl'} fontWeight={'bold'}>
				ChatBot
			</Text>
			<Flex direction={'column'} gap={'0.5rem'}>
				<Flex direction={'column'} borderRadius={'20px'} mb={'1rem'} gap={2}>
					{/*--------------------------------- TRIGGER SECTION--------------------------- */}
					<FormControl
						// isInvalid={!!ui.triggerError}
						display={'flex'}
						flexDirection={'column'}
						gap={2}
					>
						<Flex justifyContent={'space-between'} alignItems={'center'}>
							<Text>Trigger</Text>
							<Flex gap={2} alignItems={'center'}>
								<IconButton
									isRound={true}
									variant='solid'
									aria-label='Done'
									size='xs'
									icon={!trigger ? <CheckIcon color='white' /> : <></>}
									onClick={() => {}}
									className={`${
										!trigger ? '!bg-[#4CB072]' : '!bg-[#A6A6A6] '
									} hover:!bg-green-700 `}
								/>
								<Text fontSize='sm'>Default Message</Text>
							</Flex>
						</Flex>
						<TextAreaElement
							value={trigger ?? ''}
							onChange={(e) => {
								dispatch(setTrigger(e.target.value));
							}}
							isInvalid={!!ui.triggerError}
							placeholder={'ex. hello'}
						/>
						{ui.triggerError && <FormErrorMessage>{ui.triggerError}</FormErrorMessage>}
					</FormControl>

					{/*--------------------------------- RECIPIENTS SECTION--------------------------- */}

					<Flex gap={4}>
						<FormControl isInvalid={!!ui.respondToError} flexGrow={1}>
							<Text>Recipients</Text>
							<SelectElement
								value={respond_to}
								onChangeText={(text) =>
									dispatch(setRespondTo(text as 'All' | 'SAVED_CONTACTS' | 'NON_SAVED_CONTACTS'))
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
							{ui.respondToError && <FormErrorMessage>{ui.respondToError}</FormErrorMessage>}
						</FormControl>
						<FormControl isInvalid={!!ui.optionsError} flexGrow={1}>
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
							{ui.optionsError && <FormErrorMessage>{ui.optionsError}</FormErrorMessage>}
						</FormControl>
					</Flex>

					<HStack alignItems={'start'}>
						{/*--------------------------------- GAP & DELAY SECTION--------------------------- */}

						<FormControl isInvalid={!!ui.triggerGapError} flex={1}>
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
							{ui.triggerGapError && <FormErrorMessage>{ui.triggerGapError}</FormErrorMessage>}
						</FormControl>
						<FormControl isInvalid={!!ui.responseGapError} flex={1}>
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
							{ui.responseGapError && <FormErrorMessage>{ui.responseGapError}</FormErrorMessage>}
						</FormControl>
						<Flex flex={1} gap={'0.5rem'}>
							<FormControl flex={1} isInvalid={!!ui.startAtError}>
								<Text>Start At (in IST)</Text>
								<Input
									type='time'
									placeholder='00:00'
									rounded={'md'}
									value={details.startAt}
									onChange={(e) => dispatch(setStartAt(e.target.value))}
								/>
								<FormErrorMessage>{ui.startAtError}</FormErrorMessage>
							</FormControl>
							<FormControl flex={1} isInvalid={!!ui.endAtError}>
								<Text>End At (in IST)</Text>
								<Input
									type='time'
									width={'full'}
									placeholder='23:59'
									rounded={'md'}
									value={details.endAt}
									onChange={(e) => dispatch(setEndAt(e.target.value))}
								/>
								<FormErrorMessage>{ui.endAtError}</FormErrorMessage>
							</FormControl>
						</Flex>
					</HStack>

					{/*--------------------------------- MESSAGE SECTION--------------------------- */}

					<Tabs variant='soft-rounded' colorScheme='green' mt={'1rem'}>
						<TabList>
							<Tab
								onClick={() => {
									dispatch(setMessage(''));
									setMessageType('static');
								}}
							>
								Message
							</Tab>
							<Tab
								onClick={() => {
									dispatch(setTemplateId(''));
									setMessageType('template');
								}}
							>
								Template Message
							</Tab>
						</TabList>
						<TabPanels>
							<TabPanel>
								<StaticMessageInput />
							</TabPanel>
							<TabPanel>
								<Select
									placeholder='Select one!'
									value={details.template_id}
									onChange={(e) => dispatch(setTemplateId(e.target.value))}
								>
									<Each
										items={templateListFiltered}
										render={(t) => <option value={t.id}>{t.name}</option>}
									/>
								</Select>
								<Divider my={'1rem'} />
								<TemplateComponentParameter
									ref={componentParameterRef}
									components={selectedTemplate?.components ?? []}
									body={template_body ?? []}
								/>
							</TabPanel>
						</TabPanels>
					</Tabs>

					{/*--------------------------------- BUTTONS SECTION--------------------------- */}

					<HStack justifyContent={'space-between'} alignItems={'center'} py={8}>
						{isEditingBot ? (
							<>
								<Button
									bgColor={'red.300'}
									width={'100%'}
									onClick={() => {}}
									isLoading={isAddingBot}
								>
									<Text color={'white'}>Cancel</Text>
								</Button>
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
							</>
						) : (
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
						)}
					</HStack>
				</Flex>
				<AllResponders />
			</Flex>
		</Flex>
	);
}
