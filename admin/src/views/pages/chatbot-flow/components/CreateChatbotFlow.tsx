/* eslint-disable no-mixed-spaces-and-tabs */
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	IconButton,
	Input,
	Text,
	useToast,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { BiRefresh } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { NAVIGATION } from '../../../../config/const';
import ChatbotFlowServices from '../../../../services/chatbot-flow.service';
import { StoreNames, StoreState } from '../../../../store';
import {
	addChatbotFlow,
	reset,
	setAddingBot,
	setChatbotFlowDetails,
	setName,
	setOptions,
	setRespondTo,
	setTrigger,
} from '../../../../store/reducers/ChatbotFlowReducer';
import { SelectElement, TextAreaElement } from './Inputs';

export default function CreateChatBotFlow() {
	const dispatch = useDispatch();
	const toast = useToast();
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		if (id !== 'new' && typeof id === 'string') {
			dispatch(setChatbotFlowDetails(id));
		} else {
			dispatch(reset());
		}
	}, [dispatch, id]);
	const { details, ui } = useSelector((state: StoreState) => state[StoreNames.CHATBOT_FLOW]);

	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);

	const { trigger, options, respond_to, name } = details;
	const { isAddingBot, isEditingBot } = ui;

	function validate() {
		let hasError = false;

		if (!name) {
			toast({
				title: 'Name content is required',
				status: 'error',
			});
			hasError = true;
		}

		return !hasError;
	}

	async function handleSave() {
		if (!validate()) {
			return;
		}
		if (isEditingBot && !details.id) return;

		addChatBot();
	}

	const addChatBot = () => {
		dispatch(setAddingBot(true));
		const promise = isEditingBot
			? // ? null
			  ChatbotFlowServices.createChatbotFlow({
					device_id: selected_device_id,
					details,
			  })
			: ChatbotFlowServices.createChatbotFlow({
					device_id: selected_device_id,
					details,
			  });
		toast.promise(promise, {
			success: (data) => {
				const acton = isEditingBot ? addChatbotFlow(data) : addChatbotFlow(data);
				dispatch(acton);
				dispatch(reset());
				if (isEditingBot) {
					navigate(`${NAVIGATION.APP}/${NAVIGATION.CHATBOT_FLOW}`);
				} else {
					navigate(`${NAVIGATION.APP}/${NAVIGATION.CHATBOT_FLOW}/update-flow/${data.id}`);
				}
				return {
					title: 'Data saved successfully',
				};
			},
			error: (err) => {
				console.log(err);

				return { title: 'Error Saving Bot' };
			},
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
			<HStack justifyContent={'space-between'}>
				<Button
					leftIcon={<ChevronLeftIcon w={6} h={6} />}
					alignSelf={'flex-start'}
					variant={'link'}
					onClick={() => navigate(`${NAVIGATION.APP}/${NAVIGATION.CHATBOT_FLOW}`)}
				>
					Back to all chatbots flows
				</Button>
				<Button
					hidden={id === 'new'}
					rightIcon={<ChevronRightIcon w={6} h={6} />}
					colorScheme='green'
					alignSelf={'flex-start'}
					onClick={() => navigate(`${NAVIGATION.APP}/${NAVIGATION.CHATBOT_FLOW}/update-flow/${id}`)}
				>
					Customize flow
				</Button>
			</HStack>
			{/*--------------------------------- TRIGGER SECTION--------------------------- */}
			<Flex direction={'column'} borderRadius={'20px'} mb={'1rem'} gap={2}>
				<FormControl>
					<FormLabel>Chatbot Flow Name</FormLabel>
					<Input
						value={name ?? ''}
						onChange={(e) => {
							dispatch(setName(e.target.value));
						}}
						placeholder={'ex. Greeting Bot'}
					/>
				</FormControl>
				<FormControl display={'flex'} flexDirection={'column'} gap={2}>
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
									setOptions(
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

				{/*--------------------------------- BUTTONS SECTION--------------------------- */}

				<HStack justifyContent={'space-between'} alignItems={'center'} py={8}>
					{isEditingBot && (
						<Button
							bgColor={'red.300'}
							width={'100%'}
							onClick={() => {
								dispatch(reset());
								navigate(`${NAVIGATION.APP}/${NAVIGATION.CHATBOT_FLOW}`);
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
							navigate(`${NAVIGATION.APP}/${NAVIGATION.CHATBOT_FLOW}/new`);
						}}
					/>
				</HStack>
			</Flex>
		</Flex>
	);
}
