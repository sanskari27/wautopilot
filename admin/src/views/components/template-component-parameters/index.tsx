/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	AbsoluteCenter,
	Box,
	Divider,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	InputGroup,
	InputLeftAddon,
	InputRightAddon,
	Select,
	Text,
} from '@chakra-ui/react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
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

const initState: {
	headerLink: string;
	headerFile: File | null;
	body: {
		custom_text: string;
		phonebook_data: string;
		variable_from: 'custom_text' | 'phonebook_data';
		fallback_value: string;
	}[];
} = {
	headerLink: '',
	headerFile: null,
	body: [],
};

export type ComponentParameterHandle = {
	getTemplateDetails: () => typeof initState;
	validate: () => boolean;
};

type Props = {
	components: Record<string, any>[];
	body: {
		custom_text: string;
		phonebook_data: string;
		variable_from: 'custom_text' | 'phonebook_data';
		fallback_value: string;
	}[];
};

const TemplateComponentParameter = forwardRef<ComponentParameterHandle, Props>(
	({ components, body }: Props, ref) => {
		const header = components.find((component) => component.type === 'HEADER');

		const [templateDetails, setTemplateDetails] = useState<{
			headerLink: string;
			headerFile: File | null;
			body: {
				custom_text: string;
				phonebook_data: string;
				variable_from: 'custom_text' | 'phonebook_data';
				fallback_value: string;
			}[];
		}>({
			headerLink: '',
			headerFile: null,
			body: body,
		});

		const [error, setError] = useState<{
			headerError: string;
			bodyError: string;
		}>({
			headerError: '',
			bodyError: '',
		});

		const validate = () => {
			let notHasError = true;

			if (header?.format === ('IMAGE' || 'VIDEO' || 'DOCUMENT')) {
				if (!templateDetails.headerFile && !templateDetails.headerLink) {
					setError((prev) => {
						return {
							...prev,
							headerError: 'Header media is required',
						};
					});
					notHasError = false;
				} else {
					setError((prev) => {
						return {
							...prev,
							headerError: '',
						};
					});
				}
			}

			templateDetails.body.forEach((body) => {
				if (body.variable_from === 'phonebook_data') {
					if (!body.phonebook_data) {
						setError((prev) => {
							return {
								...prev,
								bodyError: 'Phonebook data is required',
							};
						});
						notHasError = false;
					} else {
						setError((prev) => {
							return {
								...prev,
								bodyError: '',
							};
						});
					}
					if (!body.fallback_value) {
						setError((prev) => {
							return {
								...prev,
								bodyError: 'Fallback value is required',
							};
						});
						notHasError = false;
					} else {
						setError((prev) => {
							return {
								...prev,
								bodyError: '',
							};
						});
					}
				}
				if (body.variable_from === 'custom_text' && !body.custom_text) {
					setError((prev) => {
						return {
							...prev,
							bodyError: 'Custom text is required',
						};
					});
					notHasError = false;
				} else {
					setError((prev) => {
						return {
							...prev,
							bodyError: '',
						};
					});
				}
			});
			return notHasError;
		};

		useImperativeHandle(ref, () => ({
			getTemplateDetails: () => {
				console.log(templateDetails);
				return templateDetails as typeof initState;
			},
			validate,
		}));

		useEffect(() => {
			setTemplateDetails((prev) => {
				return {
					...prev,
					body: body,
				};
			});
		}, [body]);

		useEffect(() => {
			setTemplateDetails({
				headerLink: '',
				headerFile: null,
				body: [],
			});
		}, []);

		return (
			<Flex
				className='flex-col md:flex-row w-full'
				justifyContent={'space-between'}
				gap={3}
				hidden={components.length === 0}
			>
				<Flex direction={'column'} className='w-full md:w-[70%]'>
					<Text fontSize={'2xl'} fontWeight={'medium'}>
						Template details
					</Text>
					<FormControl
						hidden={!header || header.format === 'TEXT'}
						mt={'1rem'}
						isInvalid={!!error.headerError}
					>
						<FormLabel>Header media link</FormLabel>
						<Input
							placeholder='Media file link'
							type='url'
							onChange={(e) => {
								setTemplateDetails({ ...templateDetails, headerLink: e.target.value });
							}}
							value={templateDetails.headerLink}
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
								onChange={(e) =>
									setTemplateDetails({
										...templateDetails,
										headerFile: e.target.files?.[0] ?? null,
									})
								}
							/>
						</Box>
						{error.headerError && <FormErrorMessage>{error.headerError}</FormErrorMessage>}
					</FormControl>
					<FormControl
						gap={3}
						mt={'1rem'}
						hidden={templateDetails.body.length === 0}
						isInvalid={!!error.bodyError}
					>
						<FormLabel>Template body details</FormLabel>
						<Each
							items={templateDetails.body}
							render={(parameter, index) => (
								<InputGroup size='sm' my={'0.25rem'}>
									<InputLeftAddon>Variable value {index + 1}</InputLeftAddon>
									{parameter.variable_from === 'custom_text' ? (
										<Input
											placeholder='eg. Dave'
											value={parameter.custom_text}
											onChange={(e) =>
												setTemplateDetails({
													...templateDetails,
													body: templateDetails.body.map((item, i) =>
														i === index ? { ...item, custom_text: e.target.value } : item
													),
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
													setTemplateDetails({
														...templateDetails,
														body: templateDetails.body.map((item, i) =>
															i === index ? { ...item, phonebook_data: e.target.value } : item
														),
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
															setTemplateDetails({
																...templateDetails,
																body: templateDetails.body.map((item, i) =>
																	i === index ? { ...item, phonebook_data: e.target.value } : item
																),
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
													setTemplateDetails({
														...templateDetails,
														body: templateDetails.body.map((item, i) =>
															i === index ? { ...item, fallback_value: e.target.value } : item
														),
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
												setTemplateDetails({
													...templateDetails,
													body: templateDetails.body.map((item, i) =>
														i === index
															? {
																	...item,
																	variable_from: e.target.value as 'custom_text' | 'phonebook_data',
															  }
															: item
													),
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
						{error.bodyError && <FormErrorMessage>{error.bodyError}</FormErrorMessage>}
					</FormControl>
				</Flex>

				<Box className='w-full md:w-[30%]'>
					<SampleMessage components={components} />
				</Box>
			</Flex>
		);
	}
);

export default TemplateComponentParameter;
