/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	AbsoluteCenter,
	Box,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputLeftAddon,
	InputRightAddon,
	Select,
	Text,
} from '@chakra-ui/react';
import SampleMessage from '../sampleMessage';
import Each from '../utils/Each';

const bodyParametersList = [
	'first_name',
	'last_name',
	'middle_name',
	'phone_number',
	'email',
	'birthday',
	'anniversary',
];

type Props = {
	components?: Record<string, any>[];
	headerLink: string;
	headerFile: File | null;
	body: {
		custom_text: string;
		phonebook_data: string;
		variable_from: 'custom_text' | 'phonebook_data';
		fallback_value: string;
	}[];
	handleTemplateDetailsChange: ({
		headerLink,
		body,
	}: {
		headerLink: string;
		headerFile: File | null;
		body?: {
			index: number;
			custom_text: string;
			phonebook_data: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value: string;
		};
	}) => void;

	showSampleMessage?: boolean;
};

const TemplateComponentParameter = ({
	components,
	body,
	headerLink,
	headerFile,
	handleTemplateDetailsChange,
	showSampleMessage = true,
}: Props) => {
	const header = components?.find((component) => component.type === 'HEADER');

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files ? e.target.files[0] : null;
		handleTemplateDetailsChange({
			headerLink: '',
			headerFile: file,
		});
	};

	return (
		<Flex
			className='flex-col md:flex-row w-full'
			justifyContent={'space-between'}
			gap={3}
			hidden={components?.length === 0}
		>
			<Flex direction={'column'} className='w-full md:w-[70%]'>
				<Text fontSize={'2xl'} fontWeight={'medium'}>
					Template details
				</Text>
				<FormControl hidden={!header || header.format === 'TEXT'} mt={'1rem'}>
					<FormLabel>Header media link</FormLabel>
					<Input
						placeholder='Media file link'
						type='url'
						onChange={(e) => {
							handleTemplateDetailsChange({
								headerLink: e.target.value,
								headerFile: null,
							});
						}}
						value={headerLink}
					/>
					<Box position='relative' my={'1rem'}>
						<Divider />
						<AbsoluteCenter p='4' color='gray.600' bg={'white'}>
							or
						</AbsoluteCenter>
					</Box>
					<Box marginTop={'0.5rem'}>
						<FormLabel mb={'0.5rem'}>Upload header media</FormLabel>
						<Input
							type='file'
							onChange={(e) => {
								handleFileChange(e);
							}}
						/>
					</Box>
				</FormControl>
				<FormControl gap={3} mt={'1rem'} hidden={body.length === 0}>
					<FormLabel>Template body details</FormLabel>
					<Each
						items={body}
						render={(parameter, index) => (
							<InputGroup size='sm' my={'0.25rem'}>
								<InputLeftAddon>Variable value {index + 1}</InputLeftAddon>
								{parameter.variable_from === 'custom_text' ? (
									<Input
										placeholder='eg. Dave'
										value={parameter.custom_text}
										onChange={(e) =>
											handleTemplateDetailsChange({
												headerLink,
												headerFile,
												body: {
													index,
													variable_from: 'custom_text',
													custom_text: e.target.value,
													phonebook_data: '',
													fallback_value: '',
												},
											})
										}
									/>
								) : (
									<>
										<Select
											placeholder='Variables from!'
											px={'0.5rem'}
											size={'sm'}
											value={
												parameter.phonebook_data === ''
													? ''
													: bodyParametersList.includes(parameter.phonebook_data)
													? parameter.phonebook_data
													: 'others'
											}
											onChange={(e) =>
												handleTemplateDetailsChange({
													headerLink,
													headerFile,
													body: {
														index,
														variable_from: 'phonebook_data',
														phonebook_data: e.target.value,
														custom_text: '',
														fallback_value: '',
													},
												})
											}
										>
											<option value='first_name'>First Name</option>
											<option value='last_name'>Last Name</option>
											<option value='middle_name'>Middle Name</option>
											<option value='phone_number'>Phone Number</option>
											<option value='email'>Email</option>
											<option value='birthday'>Birthday</option>
											<option value='anniversary'>Anniversary</option>
											<option value='others'>Others</option>
										</Select>

										{parameter.variable_from === 'phonebook_data' &&
											!['', ...bodyParametersList].includes(parameter.phonebook_data) && (
												<Input
													type='text'
													size={'sm'}
													placeholder='Phonebook variable name'
													value={parameter.phonebook_data}
													onChange={(e) =>
														handleTemplateDetailsChange({
															headerLink,
															headerFile,
															body: {
																index,
																variable_from: 'phonebook_data',
																phonebook_data: e.target.value,
																custom_text: '',
																fallback_value: '',
															},
														})
													}
												/>
											)}

										<Input
											type='text'
											size={'sm'}
											placeholder='Fallback value'
											value={parameter.fallback_value}
											onChange={(e) =>
												handleTemplateDetailsChange({
													headerLink,
													headerFile,
													body: {
														index,
														variable_from: 'phonebook_data',
														phonebook_data: parameter.phonebook_data,
														custom_text: '',
														fallback_value: e.target.value,
													},
												})
											}
										/>
									</>
								)}

								<InputRightAddon px={'0'}>
									<Select
										placeholder='Variables from!'
										variant={'unstyled'}
										px={'0.5rem'}
										value={parameter.variable_from}
										onChange={(e) =>
											handleTemplateDetailsChange({
												headerLink,
												headerFile,
												body: {
													index,
													variable_from: e.target.value as 'custom_text' | 'phonebook_data',
													custom_text: '',
													fallback_value: '',
													phonebook_data: '',
												},
											})
										}
									>
										<option value='custom_text'>Custom Text</option>
										<option value='phonebook_data'>Phonebook Data</option>
									</Select>
								</InputRightAddon>
							</InputGroup>
						)}
					/>
				</FormControl>
			</Flex>

			<Box className='w-full md:w-[30%]' hidden={!showSampleMessage}>
				<SampleMessage components={components ?? []} />
			</Box>
		</Flex>
	);
};

export default TemplateComponentParameter;
