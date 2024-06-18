import {
	Box,
	Button,
	Divider,
	Flex,
	HStack,
	Input,
	InputGroup,
	InputLeftAddon,
	Radio,
	RadioGroup,
	Stack,
	Tag,
	TagCloseButton,
	TagLabel,
	Text,
	Textarea,
	useToast,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { NAVIGATION } from '../../../../config/const';
import TemplateService from '../../../../services/template.service';
import UploadService from '../../../../services/upload.service';
import { StoreNames, StoreState } from '../../../../store';
import {
	removeButtonComponent,
	resetDetails,
	setBodyExample,
	setBodyText,
	setDetails,
	setFile,
	setFooterText,
	setHeaderText,
	setHeaderType,
	setSaving,
	setTemplateCategory,
	setTemplateName,
} from '../../../../store/reducers/TemplateReducer';
import { countOccurrences } from '../../../../utils/templateHelper';
import { RadioBoxGroup } from '../../../components/radioBox';
import SampleMessage from '../../../components/sampleMessage';
import Each from '../../../components/utils/Each';
import AddQuickReply from './AddQuickReply';
import PhoneNumberButton from './PhoneNumberButton';
import URLButton from './URLButton';

export default function EditTemplate() {
	const { id } = useParams();
	const toast = useToast();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);
	const {
		file,
		details: { category, name, components },
	} = useSelector((state: StoreState) => state[StoreNames.TEMPLATES]);

	const headers = components.filter((component) => component.type === 'HEADER');
	const bodies = components.filter((component) => component.type === 'BODY');
	const body =
		bodies.length > 0 ? (bodies[0] as { type: 'BODY'; text: '' }) : { type: 'BODY', text: '' };
	const footers = components.filter((component) => component.type === 'FOOTER');
	const footer =
		footers.length > 0
			? (footers[0] as { type: 'FOOTER'; text: '' })
			: { type: 'FOOTER', text: '' };

	const buttons =
		components.filter((component) => component.type === 'BUTTONS')?.[0]?.buttons ?? [];

	useEffect(() => {
		dispatch(resetDetails());
		if (!id) {
			return;
		}

		if (!selected_device_id) {
			toast({
				title: 'No device selected',
				description: 'Please select a device to edit or create a template',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
			return;
		}
		toast.promise(TemplateService.fetchTemplate(selected_device_id, id), {
			success: (template) => {
				if (!template) {
					return {
						title: 'Template not found',
						description: 'The template you are trying to edit does not exist',
						status: 'error',
						duration: 5000,
						isClosable: true,
					};
				}

				dispatch(setDetails(template));
				return {
					title: 'Edit Template',
					duration: 1,
				};
			},
			error: {
				title: 'Failed to fetch template',
			},
			loading: {
				title: 'Fetching Template',
			},
		});
	}, [id, dispatch, selected_device_id, toast]);

	const saveTemplate = async (handle?: string) => {
		const details = {
			id,
			name,
			category,
			components,
		};

		const buttons =
			components.filter((component) => component.type === 'BUTTONS')?.[0]?.buttons ?? [];

		if (buttons.length === 0) {
			details.components = details.components.filter((c: { type: string }) => c.type !== 'BUTTONS');
		}

		if (handle) {
			details.components = details.components.map((component) => {
				if (component.type === 'HEADER') {
					return {
						...component,
						example: {
							header_handle: [handle],
						},
					};
				}
				return component;
			});
		}

		const promise = id
			? TemplateService.editTemplate(selected_device_id, details)
			: TemplateService.addTemplate(selected_device_id, details);

		toast.promise(promise, {
			success: () => {
				navigate(`${NAVIGATION.APP}/${NAVIGATION.TEMPLATES}`);
				return {
					title: 'Template saved',
					description: 'The template has been saved successfully',
					status: 'success',
					duration: 5000,
					isClosable: true,
				};
			},
			error: {
				title: 'Failed to save template',
			},
			loading: {
				title: 'Saving Template',
			},
		});
	};

	const onSave = async () => {
		dispatch(setSaving(true));
		if (file) {
			toast.promise(UploadService.generateMetaHandle(selected_device_id, file), {
				success: (handle) => {
					saveTemplate(handle);
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
			saveTemplate();
		}
	};

	const bodyVariables = countOccurrences(body.text);

	return (
		<Box padding={'1rem'}>
			<Text fontWeight={'bold'} fontSize={'2xl'}>
				Edit Template
			</Text>

			<Flex className='flex-col md:flex-row w-full' justifyContent={'space-between'} gap={3}>
				<Box className='w-full md:w-[70%]'>
					<Box maxWidth={'500px'}>
						<Text>Template Name</Text>
						<Input
							placeholder='Enter template name'
							type='text'
							onChange={(e) => dispatch(setTemplateName(e.target.value))}
							value={name ?? ''}
							isDisabled={id ? true : false}
						/>
					</Box>
					<Divider my={'1rem'} borderColor={'gray.400'} />
					<Box>
						<Text mb={'0.5rem'} fontWeight={'medium'}>
							Template Type
						</Text>
						<RadioBoxGroup
							options={[
								{ key: 'MARKETING', value: 'Marketing' },
								{ key: 'UTILITY', value: 'Utility' },
							]}
							selectedValue={category}
							defaultValue={'MARKETING'}
							onChange={(val) => dispatch(setTemplateCategory(val))}
						/>
					</Box>

					<Divider my={'1rem'} borderColor={'gray.400'} />

					<Box>
						<Text mb={'0.5rem'} fontWeight={'medium'}>
							Broadcast Header
						</Text>
						<RadioBoxGroup
							options={[
								{ key: 'none', value: 'None' },
								{ key: 'TEXT', value: 'Text' },
								{ key: 'MEDIA', value: 'Media' },
							]}
							defaultValue={'none'}
							selectedValue={
								headers.length > 0 ? (headers[0].format === 'TEXT' ? 'TEXT' : 'MEDIA') : 'none'
							}
							onChange={(val) => dispatch(setHeaderType(val === 'MEDIA' ? 'IMAGE' : val))}
						/>
					</Box>

					{headers.length > 0 && headers[0].format === 'TEXT' ? (
						<Box maxWidth={'500px'} marginTop={'0.5rem'}>
							<Text mb={'0.5rem'}>Header Text</Text>

							<Input
								placeholder='Enter header text'
								type='text'
								onChange={(e) => dispatch(setHeaderText(e.target.value))}
								value={headers[0].text ?? ''}
							/>
						</Box>
					) : null}

					{headers.length > 0 && headers[0].format !== 'TEXT' ? (
						<>
							<RadioGroup
								onChange={(value) => dispatch(setHeaderType(value))}
								value={headers[0].format}
								mt={'1rem'}
								ml={'0.5rem'}
							>
								<Stack direction='row'>
									<Radio value='IMAGE'>Image</Radio>
									<Radio value='VIDEO'>Video</Radio>
									<Radio value='DOCUMENT'>Document</Radio>
								</Stack>
							</RadioGroup>

							<Box maxWidth={'500px'} marginTop={'0.5rem'}>
								<Text mb={'0.5rem'}>Sample Header Media</Text>

								<Input
									type='file'
									onChange={(e) => dispatch(setFile(e.target.files?.[0] ?? null))}
								/>
							</Box>
						</>
					) : null}

					<Divider my={'1rem'} borderColor={'gray.400'} />

					<Box width={'full'}>
						<Text fontWeight={'medium'}>Broadcast Body</Text>
						<Text mb={'0.5rem'} fontSize={'0.75rem'}>
							{`Use dynamic varibale like {{1}} {{2}} and so on`}. (Limit {body.text.length} / 2000)
						</Text>
						<Textarea
							width={'full'}
							height={'300px'}
							resize={'none'}
							placeholder='Enter template name'
							onChange={(e) => dispatch(setBodyText(e.target.value))}
							value={body.text ?? ''}
						/>
						<InputGroup size='sm' my={'0.25rem'} hidden={bodyVariables === 0}>
							<InputLeftAddon>Example Values (Total:- {bodyVariables})</InputLeftAddon>
							<Input
								placeholder='eg. Dave'
								onChange={(e) => dispatch(setBodyExample(e.target.value))}
							/>
						</InputGroup>
					</Box>

					<Divider my={'1rem'} borderColor={'gray.400'} />

					<Box width={'full'}>
						<Text fontWeight={'medium'}>Footer Text (Optional)</Text>
						<Input
							placeholder='Enter footer text'
							onChange={(e) => dispatch(setFooterText(e.target.value))}
							value={footer.text ?? ''}
						/>
					</Box>

					<Divider my={'1rem'} borderColor={'gray.400'} />

					<Box>
						<Text fontWeight={'medium'}>Buttons</Text>
						<Text mb={'0.5rem'} fontSize={'0.75rem'}>
							Insert buttons so your customers can take action and engage with your message!
						</Text>
						<Flex gap={3}>
							<Each
								items={buttons}
								render={(button: { text: string }) => (
									<Tag>
										<TagLabel>{button.text}</TagLabel>
										<TagCloseButton
											onClick={() => {
												dispatch(removeButtonComponent(button.text));
											}}
										/>
									</Tag>
								)}
							/>
						</Flex>

						<HStack gap={3} mt={'0.5rem'}>
							<AddQuickReply disabled={buttons.length >= 3} />
							<PhoneNumberButton disabled={buttons.length >= 3} />
							<URLButton disabled={buttons.length >= 3} />
						</HStack>
					</Box>
				</Box>
				<Box className='w-full md:w-[30%]'>
					<Flex justifyContent={'flex-end'}>
						<Button
							colorScheme='red'
							onClick={() => navigate(`${NAVIGATION.APP}/${NAVIGATION.TEMPLATES}`)}
						>
							Cancel
						</Button>
						<Button colorScheme='green' onClick={onSave} ml={3}>
							Save
						</Button>
					</Flex>

					<SampleMessage components={components} />
				</Box>
			</Flex>
		</Box>
	);
}
