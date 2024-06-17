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
import { useDispatch, useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';
import {
	setBodyParameter,
	setHeaderFile,
	setHeaderLink,
} from '../../../../store/reducers/BroadcastReducer';
import SampleMessage from '../../../components/sampleMessage';
import Each from '../../../components/utils/Each';

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
	components: Record<string, any>[];
};

export default function ComponentParameters({ components }: Props) {
	const dispatch = useDispatch();
	const header = components.find((component) => component.type === 'HEADER');

	const { body } = useSelector((state: StoreState) => state[StoreNames.BROADCAST]);

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
				<FormControl hidden={!header || header.format === 'TEXT'} mt={'1rem'}>
					<FormLabel>Header media link</FormLabel>
					<Input
						placeholder='Media file link'
						type='url'
						onChange={(e) => dispatch(setHeaderLink(e.target.value))}
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
							onChange={(e) => dispatch(setHeaderFile(e.target.files?.[0] ?? null))}
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
											dispatch(
												setBodyParameter({
													index,
													key: 'custom_text',
													value: e.target.value,
												})
											)
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
												dispatch(
													setBodyParameter({
														index,
														key: 'phonebook_data',
														value: e.target.value,
													})
												)
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
														dispatch(
															setBodyParameter({
																index,
																key: 'phonebook_data',
																value: e.target.value,
															})
														)
													}
												/>
											)}

										<Input
											type='text'
											size={'sm'}
											placeholder='Fallback value'
											value={parameter.fallback_value}
											onChange={(e) =>
												dispatch(
													setBodyParameter({
														index,
														key: 'fallback_value',
														value: e.target.value,
													})
												)
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
											dispatch(
												setBodyParameter({
													index,
													key: 'variable_from',
													value: e.target.value,
												})
											)
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

			<Box className='w-full md:w-[30%]'>
				<SampleMessage components={components} />
			</Box>
		</Flex>
	);
}
