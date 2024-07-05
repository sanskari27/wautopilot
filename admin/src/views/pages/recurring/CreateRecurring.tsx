import { ChevronLeftIcon, CloseIcon } from '@chakra-ui/icons';
import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Select,
	Tag,
	TagLabel,
	TagRightIcon,
	Text,
	Textarea,
	useToast,
	Wrap,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import { useFetchLabels } from '../../../hooks/useFetchLabels';
import useFilterLabels from '../../../hooks/useFilterLabels';
import RecurringService from '../../../services/recurring.service';
import { StoreNames, StoreState } from '../../../store';
import {
	addRecurringLabels,
	addRecurringMessage,
	clearRecurringLabels,
	clearSelectedTemplate,
	editRecurring,
	removeRecurringLabels,
	reset,
	setAddingRecurring,
	setRecurring,
	setRecurringDelay,
	setRecurringDescription,
	setRecurringEndTime,
	setRecurringName,
	setRecurringStartTime,
	setRecurringWishFrom,
	setSelectedTemplate,
	setTemplateBodyCustomText,
	setTemplateBodyFallbackValue,
	setTemplateBodyPhonebookData,
	setTemplateBodyVariableFrom,
	setTemplateHeaderMediaId,
} from '../../../store/reducers/RecurringReducer';
import LabelFilter from '../../components/labelFilter';
import TemplateComponentParameter from '../../components/template-component-parameters';
import Each from '../../components/utils/Each';

const CreateRecurring = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const toast = useToast();
	const { id } = useParams();

	const { onAddLabel, onClear, onRemoveLabel } = useFilterLabels();

	const { all_labels } = useFetchLabels();

	useEffect(() => {
		console.log(id);
		if (id) {
			dispatch(setRecurring(id));
		} else {
			dispatch(reset());
		}
	}, [dispatch, id]);

	const {
		details: {
			name,
			delay,
			description,
			endTime,
			labels,
			startTime,
			template_id,
			template_body,
			template_header,
			wish_from,
			template_name,
			active,
			id: recurringId,
		},
		ui: { isAddingRecurring, isEditingRecurring },
	} = useSelector((state: StoreState) => state[StoreNames.RECURRING]);

	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);

	const { list } = useSelector((state: StoreState) => state[StoreNames.TEMPLATES]);
	const filteredTemplates = list.filter((template) => template.status === 'APPROVED');
	const selectedTemplate = filteredTemplates.find((t) => t.id === template_id);

	const handleTemplateChange = (templateId: string) => {
		if (!templateId) {
			dispatch(clearSelectedTemplate());
		}
		const template = list.find((t) => t.id === templateId);
		if (!template) return;
		dispatch(setSelectedTemplate(template));
	};

	const handleLabelAdd = (label: string) => {
		onAddLabel(label);
		dispatch(addRecurringLabels(label));
	};

	const handleLabelRemove = (label: string) => {
		onRemoveLabel(label);
		dispatch(removeRecurringLabels(label));
	};

	const handleLabelClear = () => {
		onClear();
		dispatch(clearRecurringLabels());
	};

	const handleTemplateDetailsChange = ({
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

	const validate = () => {
		let hasError = false;
		if (!name) {
			toast({
				title: 'Name is required',
				status: 'error',
			});
			hasError = true;
		}
		if (!wish_from) {
			toast({
				title: 'Wish Type is required',
				status: 'error',
			});
			hasError = true;
		}
		if (!description) {
			toast({
				title: 'Description is required',
				status: 'error',
			});
			hasError = true;
		}
		if (labels.length === 0) {
			toast({
				title: 'Labels are required',
				status: 'error',
			});
			hasError = true;
		}
		if (delay < 1) {
			toast({
				title: 'Invalid Delay',
				status: 'error',
			});
			hasError = true;
		}
		if (!startTime) {
			toast({
				title: 'Start time is required',
				status: 'error',
			});
			hasError = true;
		}
		if (!endTime) {
			toast({
				title: 'End time is required',
				status: 'error',
			});
			hasError = true;
		}
		if (!template_id) {
			toast({
				title: 'Template is required',
				status: 'error',
			});
			hasError = true;
		}
		if (template_header.type === ('IMAGE' || 'VIDEO' || 'DOCUMENT') && !template_header.media_id) {
			toast({
				title: 'Header media is required',
				status: 'error',
			});
			hasError = true;
		}
		template_body.forEach((body) => {
			if (body.variable_from === 'phonebook_data' && !body.phonebook_data) {
				toast({
					title: 'Phonebook data is required',
					status: 'error',
				});
				hasError = true;
			}
			if (body.variable_from === 'custom_text' && !body.custom_text) {
				toast({
					title: 'Custom text is required',
					status: 'error',
				});
				hasError = true;
			}
		});

		return hasError;
	};

	const handleSave = () => {
		if (validate()) {
			return;
		}

		dispatch(setAddingRecurring(true));

		const details = {
			id: recurringId,
			name,
			description,
			wish_from,
			labels,
			template_name,
			template_id,
			delay,
			startTime,
			endTime,
			template_body,
			template_header,
			active,
		};

		const promise = isEditingRecurring
			? RecurringService.editRecurring({ deviceId: selected_device_id, details })
			: RecurringService.createRecurring({ deviceId: selected_device_id, details });

		console.log(isEditingRecurring);

		toast.promise(promise, {
			success: (data) => {
				console.log(data);
				isEditingRecurring
					? dispatch(editRecurring(details))
					: dispatch(addRecurringMessage(data[0]));

				dispatch(reset());
				navigate(`${NAVIGATION.APP}/${NAVIGATION.RECURRING}`);
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
		dispatch(setAddingRecurring(false));
	};

	return (
		<Flex
			direction={'column'}
			gap={'1rem'}
			className='custom-scrollbar'
			justifyContent={'center'}
			p={'1rem'}
		>
			<Button
				leftIcon={<ChevronLeftIcon w={6} h={6} />}
				alignSelf={'flex-start'}
				variant={'link'}
				onClick={() => navigate(`${NAVIGATION.APP}/${NAVIGATION.RECURRING}`)}
			>
				Back to all recurring
			</Button>

			<HStack>
				<FormControl>
					<FormLabel>Name</FormLabel>
					<Input
						placeholder={'eg. Birthday wish'}
						value={name}
						onChange={(e) => dispatch(setRecurringName(e.target.value))}
					/>
				</FormControl>

				<FormControl>
					<FormLabel>Select Wish Type</FormLabel>
					<Select
						placeholder={'Select Wish Type'}
						value={wish_from}
						onChange={(e) => dispatch(setRecurringWishFrom(e.target.value as typeof wish_from))}
					>
						<option value='birthday'>Birthday</option>
						<option value='anniversary'>Anniversary</option>
					</Select>
				</FormControl>
			</HStack>
			<FormControl>
				<FormLabel>Description</FormLabel>
				<Textarea
					placeholder='eg. This recurring campaign send birthday wishes to assigned labels.'
					value={description}
					onChange={(e) => dispatch(setRecurringDescription(e.target.value))}
				/>
			</FormControl>
			<HStack>
				<Wrap
					width={'full'}
					borderWidth={'2px'}
					minH={'40px'}
					rounded={'lg'}
					borderStyle={'dashed'}
					p={'0.5rem'}
				>
					{labels.length === 0 && (
						<Text width={'full'} textAlign={'center'} fontWeight={'bold'}>
							No labels selected
						</Text>
					)}
					<Each
						items={labels}
						render={(label) => (
							<Tag variant='outline' colorScheme='green'>
								<TagLabel>{label}</TagLabel>
								<TagRightIcon
									cursor={'pointer'}
									as={CloseIcon}
									onClick={() => handleLabelRemove(label)}
								/>
							</Tag>
						)}
					/>
				</Wrap>
				<LabelFilter
					buttonComponent={<Button colorScheme='green'>Select Labels</Button>}
					labels={all_labels}
					selectedLabels={labels}
					onAddLabel={handleLabelAdd}
					onRemoveLabel={handleLabelRemove}
					onClear={handleLabelClear}
				/>
			</HStack>
			<HStack>
				<FormControl>
					<FormLabel>Delay (in days)</FormLabel>
					<Input
						type={'number'}
						min={'0'}
						placeholder={'eg. 3'}
						value={Number(delay)}
						onChange={(e) => dispatch(setRecurringDelay(e.target.value))}
					/>
				</FormControl>
				<FormControl>
					<FormLabel>Start time</FormLabel>
					<Input
						type='time'
						placeholder={''}
						value={startTime}
						onChange={(e) => dispatch(setRecurringStartTime(e.target.value))}
					/>
				</FormControl>
				<FormControl>
					<FormLabel>End time</FormLabel>
					<Input
						type='time'
						placeholder={''}
						value={endTime}
						onChange={(e) => dispatch(setRecurringEndTime(e.target.value))}
					/>
				</FormControl>
			</HStack>
			<FormControl>
				<FormLabel>Select Template</FormLabel>
				<Select
					value={template_id}
					placeholder='Select Template!'
					onChange={(e) => handleTemplateChange(e.target.value)}
				>
					<Each
						items={filteredTemplates}
						render={(template) => (
							<option key={template.id} value={template.id}>
								{template.name}
							</option>
						)}
					/>
				</Select>
			</FormControl>
			<TemplateComponentParameter
				components={selectedTemplate?.components ?? []}
				body={template_body}
				header={template_header}
				headerMediaId={template_header?.media_id}
				handleTemplateDetailsChange={handleTemplateDetailsChange}
			/>
			<Button colorScheme='green' onClick={handleSave} isLoading={isAddingRecurring}>
				Save
			</Button>
		</Flex>
	);
};

export default CreateRecurring;
