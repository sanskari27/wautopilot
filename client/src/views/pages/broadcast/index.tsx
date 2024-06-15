/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Box,
	Button,
	Divider,
	Flex,
	Input,
	Select,
	Text,
	Textarea,
	useToast,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { BiSend } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import APIInstance from '../../../config/APIInstance';
import UploadService from '../../../services/upload.service';
import { StoreNames, StoreState } from '../../../store';
import {
	resetBroadcast,
	setBodyParameterCount,
	setBroadcastType,
	setDailyMessagesCount,
	setDescription,
	setEndTime,
	setLabels,
	setName,
	setRecipientsFrom,
	setStartDate,
	setStartTime,
	setTemplateId,
	setTo,
} from '../../../store/reducers/BroadcastReducer';
import { countOccurrences } from '../../../utils/templateHelper';
import LabelFilter from '../../components/labelFilter';
import { RadioBoxGroup } from '../../components/radioBox';
import Each from '../../components/utils/Each';
import AddNumbers from './components/AddNumbers';
import ComponentParameters from './components/ComponentParameters';

export default function Broadcast() {
	const dispatch = useDispatch();
	const toast = useToast();

	const {
		body,
		broadcast_options,
		description,
		name,
		recipients_from,
		template_id,
		to,
		labels,
		header_file,
		header_link,
	} = useSelector((state: StoreState) => state[StoreNames.BROADCAST]);
	const { list: templateList } = useSelector((state: StoreState) => state[StoreNames.TEMPLATES]);
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);

	useEffect(() => {
		const template = templateList.find((t) => t.id === template_id);
		if (!template) return;

		const body = template.components.find((c) => c.type === 'BODY');
		const variables = countOccurrences(body?.text ?? '');
		dispatch(setBodyParameterCount(variables));
	}, [template_id, templateList, dispatch]);

	useEffect(() => {
		dispatch(resetBroadcast());
	}, [dispatch]);

	const templateListFiltered = templateList.filter((t) => t.status === 'APPROVED');
	const selectedTemplate = templateListFiltered.find((t) => t.id === template_id);

	function sendBroadcast(header_media: { link?: string; media_id?: string } = {}) {
		const template = templateListFiltered.find((t) => t.id === template_id)!;
		const header = template.components.find((c) => c.type === 'HEADER');
		const promise = APIInstance.post(`/message/${selected_device_id}/send-broadcast`, {
			name: name,
			description: description,
			template_id: template_id,
			template_name: template.name,
			to: recipients_from === 'numbers' ? to : [],
			labels: recipients_from === 'phonebook' ? labels : [],
			broadcast_options,
			body,
			...(header
				? {
						header: {
							media_id: header_media.media_id,
							link: header_media.link,
							type: header.format,
						},
				  }
				: {}),
		});

		toast.promise(promise, {
			success: () => {
				dispatch(resetBroadcast());
				return {
					title: 'Broadcast sent successfully',
				};
			},
			error: () => {
				return {
					title: 'Failed to send broadcast',
				};
			},
			loading: {
				title: 'Sending Broadcast...',
			},
		});
	}

	function onSend() {
		if (header_file) {
			toast.promise(UploadService.generateMetaMediaId(selected_device_id, header_file), {
				success: (media_id) => {
					sendBroadcast({ media_id });
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
		} else if (header_link) {
			sendBroadcast({ link: header_link });
		} else {
			sendBroadcast();
		}
	}

	return (
		<Box padding={'1rem'}>
			<Text fontSize={'2xl'} fontWeight={'bold'}>
				Broadcast
			</Text>

			<Flex className='flex-col md:flex-row' columnGap={6} rowGap={3}>
				<Box flexGrow={1}>
					<Text>Broadcast Name</Text>
					<Input
						placeholder='Enter broadcast name'
						type='text'
						onChange={(e) => dispatch(setName(e.target.value))}
						value={name ?? ''}
					/>
				</Box>
				<Box flexGrow={1}>
					<Text>Select Template</Text>
					<Select
						placeholder='Select one!'
						value={template_id}
						onChange={(e) => dispatch(setTemplateId(e.target.value))}
					>
						<Each
							items={templateListFiltered}
							render={(t) => <option value={t.id}>{t.name}</option>}
						/>
					</Select>
				</Box>

				<Flex gap={3} className='flex-col md:flex-row'>
					<Box>
						<Text>Broadcast Type</Text>
						<RadioBoxGroup
							options={[
								{ key: 'instant', value: 'Instant' },
								{ key: 'scheduled', value: 'Scheduled' },
							]}
							selectedValue={broadcast_options.broadcast_type}
							defaultValue={'instant'}
							onChange={(value) => dispatch(setBroadcastType(value as 'instant' | 'scheduled'))}
						/>
					</Box>
					<Box>
						<Text>Recipient From</Text>
						<RadioBoxGroup
							options={[
								{ key: 'numbers', value: 'Numbers' },
								{ key: 'phonebook', value: 'Tags' },
							]}
							defaultValue={'numbers'}
							selectedValue={recipients_from}
							onChange={(value) => dispatch(setRecipientsFrom(value as 'numbers' | 'phonebook'))}
						/>
					</Box>
					<Flex justifyContent={'flex-end'} direction={'column'} pb={'0.25rem'}>
						<AddNumbers
							hidden={recipients_from !== 'numbers'}
							onComplete={(numbers) => dispatch(setTo(numbers))}
						/>

						<Box hidden={recipients_from !== 'phonebook'}>
							<LabelFilter
								buttonComponent={
									<Button
										rounded={'full'}
										colorScheme='blue'
										hidden={recipients_from !== 'phonebook'}
									>
										Select Tags
									</Button>
								}
								onChange={(labels) => dispatch(setLabels(labels))}
							/>
						</Box>
					</Flex>
				</Flex>
			</Flex>

			<Divider borderColor={'gray.400'} my={'1rem'} />
			<Text hidden={broadcast_options.broadcast_type !== 'scheduled'}>Scheduling Options</Text>
			<Flex
				hidden={broadcast_options.broadcast_type !== 'scheduled'}
				gap={3}
				mt={'0.5rem'}
				className='flex-col md:flex-row'
			>
				<Box flexGrow={1}>
					<Text>Start Date</Text>
					<Input
						placeholder='Select Date'
						size='md'
						type='date'
						value={broadcast_options.startDate}
						onChange={(e) => dispatch(setStartDate(e.target.value))}
					/>
				</Box>
				<Box flexGrow={1}>
					<Text>Start Time</Text>
					<Input
						placeholder='Select Time'
						size='md'
						type='time'
						value={broadcast_options.startTime}
						onChange={(e) => dispatch(setStartTime(e.target.value))}
					/>
				</Box>
				<Box flexGrow={1}>
					<Text>End Time</Text>
					<Input
						placeholder='End Time'
						size='md'
						type='time'
						value={broadcast_options.endTime}
						onChange={(e) => dispatch(setEndTime(e.target.value))}
					/>
				</Box>
				<Box flexGrow={1}>
					<Text>No of messages daily</Text>
					<Input
						placeholder='100'
						size='md'
						type='number'
						value={broadcast_options.daily_messages_count.toString()}
						onChange={(e) => dispatch(setDailyMessagesCount(parseInt(e.target.value, 10) || 100))}
					/>
				</Box>
			</Flex>

			<Divider
				borderColor={'gray.400'}
				my={'1rem'}
				hidden={broadcast_options.broadcast_type !== 'scheduled'}
			/>

			<Box flexGrow={1}>
				<Text>Broadcast Description</Text>
				<Textarea
					placeholder='Enter template description'
					height={'150px'}
					onChange={(e) => dispatch(setDescription(e.target.value))}
					value={description ?? ''}
				/>
			</Box>
			<Divider borderColor={'gray.400'} my={'1rem'} />

			<Flex gap={3} mt={'0.5rem'} direction={'column'}>
				<ComponentParameters components={selectedTemplate?.components ?? []} />
				<Flex justifyContent={'flex-end'} marginRight={'1rem'}>
					<Button colorScheme='red' onClick={() => dispatch(resetBroadcast())}>
						Reset
					</Button>
					<Button colorScheme='green' onClick={onSend} leftIcon={<BiSend />} ml={3}>
						Send
					</Button>
				</Flex>
			</Flex>
		</Box>
	);
}
