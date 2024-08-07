/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Box,
	Button,
	Divider,
	Flex,
	FormControl,
	FormLabel,
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
import { useFetchLabels } from '../../../hooks/useFetchLabels';
import useFilterLabels from '../../../hooks/useFilterLabels';
import DeviceService from '../../../services/device.service';
import UploadService from '../../../services/upload.service';
import { StoreNames, StoreState } from '../../../store';
import {
	resetBroadcast,
	setBodyParameterCount,
	setBroadcastType,
	setDailyMessagesCount,
	setDescription,
	setEndTime,
	setError,
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

	const { selectedLabels, onAddLabel, onClear, onRemoveLabel } = useFilterLabels();

	const { all_labels } = useFetchLabels();

	const {
		body,
		broadcast_options,
		description,
		name,
		recipients_from,
		template_id,
		to,
		header_file,
		header_link,
		error,
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

	useEffect(() => {
		if (!selected_device_id) {
			toast({
				title: 'Please add a device to send a broadcast',
				status: 'error',
				isClosable: true,
			});
			return;
		}
		DeviceService.fetchMessageHealth(selected_device_id).then((res) => {
			if (res === 'RED') {
				toast({
					title: 'Your number health is RED',
					description: 'Are you sure you want to send a broadcast?',
					status: 'warning',
					isClosable: true,
					duration: null,
				});
			}
		});
	}, [selected_device_id, toast]);

	function sendBroadcast(header_media: { link?: string; media_id?: string } = {}) {
		const template = templateListFiltered.find((t) => t.id === template_id)!;
		const header = template.components.find((c) => c.type === 'HEADER');
		const promise = APIInstance.post(`${selected_device_id}/broadcast/send`, {
			name: name,
			description: description,
			template_id: template_id,
			template_name: template.name,
			to: recipients_from === 'numbers' ? to : [],
			labels: recipients_from === 'phonebook' ? selectedLabels : [],
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

	const handleLabelChange = (label: string) => {
		onAddLabel(label);
		dispatch(setLabels(selectedLabels));
	};

	const handleLabelRemove = (label: string) => {
		onRemoveLabel(label);
		dispatch(setLabels(selectedLabels));
	};

	function onSend() {
		if (!name) {
			dispatch(setError({ type: 'NAME', message: 'Name is required' }));
			toast({
				title: 'Name is required',
				status: 'error',
				isClosable: true,
			});
			return;
		}

		if (!template_id) {
			dispatch(setError({ type: 'TEMPLATE', message: 'Template is required' }));
			toast({
				title: 'Template is required',
				status: 'error',
				isClosable: true,
			});
			return;
		}
		if (recipients_from === 'numbers' && to.length === 0) {
			dispatch(setError({ type: 'RECIPIENTS', message: 'Recipients are required' }));
			toast({
				title: 'Recipients are required',
				status: 'error',
				isClosable: true,
			});
			return;
		}

		if (recipients_from === 'phonebook' && selectedLabels.length === 0) {
			dispatch(setError({ type: 'RECIPIENTS', message: 'Labels are required' }));
			toast({
				title: 'Labels are required',
				status: 'error',
				isClosable: true,
			});
			return;
		}

		if (broadcast_options.broadcast_type === 'scheduled') {
			if (!broadcast_options.startDate) {
				dispatch(setError({ type: 'START_DATE', message: 'Start date is required' }));
				toast({
					title: 'Start date is required',
					status: 'error',
					isClosable: true,
				});
				return;
			}

			if (!broadcast_options.startTime) {
				dispatch(setError({ type: 'START_TIME', message: 'Start time is required' }));
				toast({
					title: 'Start time is required',
					status: 'error',
					isClosable: true,
				});
				return;
			}

			if (!broadcast_options.endTime) {
				dispatch(setError({ type: 'END_TIME', message: 'End time is required' }));
				toast({
					title: 'End time is required',
					status: 'error',
					isClosable: true,
				});
				return;
			}

			if (!broadcast_options.daily_messages_count) {
				dispatch(
					setError({ type: 'DAILY_MESSAGES_COUNT', message: 'Daily messages count is required' })
				);
				toast({
					title: 'Daily messages count is required',
					status: 'error',
					isClosable: true,
				});
				return;
			}
		}

		dispatch(
			setError({
				message: '',
				type: '',
			})
		);

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
				<FormControl isInvalid={error.type === 'NAME'} flexGrow={1}>
					<FormLabel>Broadcast Name</FormLabel>
					<Input
						placeholder='Enter broadcast name'
						type='text'
						onChange={(e) => dispatch(setName(e.target.value))}
						value={name ?? ''}
					/>
				</FormControl>
				<FormControl isInvalid={error.type === 'TEMPLATE'} flexGrow={1}>
					<FormLabel>Select Template</FormLabel>
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
				</FormControl>

				<Flex gap={3} className='flex-col md:flex-row'>
					<FormControl>
						<FormLabel>Broadcast Type</FormLabel>
						<RadioBoxGroup
							options={[
								{ key: 'instant', value: 'Instant' },
								{ key: 'scheduled', value: 'Scheduled' },
							]}
							selectedValue={broadcast_options.broadcast_type}
							defaultValue={'instant'}
							onChange={(value) => dispatch(setBroadcastType(value as 'instant' | 'scheduled'))}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Recipient From</FormLabel>
						<RadioBoxGroup
							options={[
								{ key: 'numbers', value: 'Numbers' },
								{ key: 'phonebook', value: 'Tags' },
							]}
							defaultValue={'numbers'}
							selectedValue={recipients_from}
							onChange={(value) => dispatch(setRecipientsFrom(value as 'numbers' | 'phonebook'))}
						/>
					</FormControl>
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
								labels={all_labels}
								onAddLabel={(label) => handleLabelChange(label)}
								onRemoveLabel={(label) => handleLabelRemove(label)}
								onClear={onClear}
								selectedLabels={selectedLabels}
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
				<FormControl isInvalid={error.type === 'START_DATE'} flexGrow={1}>
					<FormLabel>Start Date</FormLabel>
					<Input
						placeholder='Select Date'
						size='md'
						type='date'
						value={broadcast_options.startDate}
						onChange={(e) => dispatch(setStartDate(e.target.value))}
					/>
				</FormControl>
				<FormControl isInvalid={error.type === 'START_TIME'} flexGrow={1}>
					<FormLabel>Start Time</FormLabel>
					<Input
						placeholder='Select Time'
						size='md'
						type='time'
						value={broadcast_options.startTime}
						onChange={(e) => dispatch(setStartTime(e.target.value))}
					/>
				</FormControl>
				<FormControl isInvalid={error.type === 'END_TIME'} flexGrow={1}>
					<FormLabel>End Time</FormLabel>
					<Input
						placeholder='End Time'
						size='md'
						type='time'
						value={broadcast_options.endTime}
						onChange={(e) => dispatch(setEndTime(e.target.value))}
					/>
				</FormControl>
				<FormControl isInvalid={error.type === 'DAILY_MESSAGES_COUNT'} flexGrow={1}>
					<FormLabel>No of messages daily</FormLabel>
					<Input
						placeholder='100'
						size='md'
						type='number'
						value={broadcast_options.daily_messages_count.toString()}
						onChange={(e) => dispatch(setDailyMessagesCount(parseInt(e.target.value, 10) || 100))}
					/>
				</FormControl>
			</Flex>

			<Divider
				borderColor={'gray.400'}
				my={'1rem'}
				hidden={broadcast_options.broadcast_type !== 'scheduled'}
			/>

			<FormControl isInvalid={error.type === 'DESCRIPTION'} flexGrow={1}>
				<Text>Broadcast Description</Text>
				<Textarea
					placeholder='Enter template description'
					height={'150px'}
					onChange={(e) => dispatch(setDescription(e.target.value))}
					value={description ?? ''}
				/>
			</FormControl>
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
