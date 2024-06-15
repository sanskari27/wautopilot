import {
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	IconButton,
	Input,
	Select,
	Text,
	VStack,
	useDisclosure,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { IoAdd } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../store';
import {
	addEmptyAddress,
	addEmptyEmail,
	addEmptyPhone,
	addEmptyUrl,
	removeAddress,
	removeEmail,
	removePhone,
	removeUrl,
	reset,
	resetContactDetails,
	setAddressCity,
	setAddressCountry,
	setAddressCountryCode,
	setAddressPostalCode,
	setAddressState,
	setAddressStreet,
	setAddressType,
	setContact,
	setCurrentCompany,
	setDepartment,
	setEmail,
	setEmailType,
	setFirstName,
	setFormattedName,
	setJobTitle,
	setLastName,
	setMiddleName,
	setPhone,
	setPhoneType,
	setPrefix,
	setSuffix,
	setUrl,
	setUrlType,
} from '../../../store/reducers/ContactReducer';
import { Contact } from '../../../store/types/ContactState';
import Each from '../utils/Each';

export type ContactHandle = {
	open: ({ contact, editable }: { contact?: Contact; editable: boolean }) => void;
	onClose: () => void;
};

type ContactProps = {
	onConfirm: (data: Contact) => void;
};

const ContactDrawer = forwardRef<ContactHandle, ContactProps>(
	({ onConfirm }: ContactProps, ref) => {
		const dispatch = useDispatch();

		const { isOpen, onOpen, onClose: closeDrawer } = useDisclosure();
		const { contact } = useSelector((state: StoreState) => state[StoreNames.CONTACT]);
		const [isNewContact, setIsNewContact] = useState(false);

		const isUpdating = contact.id !== '';

		useImperativeHandle(ref, () => ({
			open: ({ contact, editable: newContact }) => {
				if (contact) {
					dispatch(setContact(contact as Contact));
				} else {
					dispatch(resetContactDetails());
				}
				setIsNewContact(newContact);
				onOpen();
			},
			onClose: () => {
				handleClose();
			},
		}));

		const handleClose = () => {
			dispatch(reset());
			closeDrawer();
		};

		const handleSubmit = () => {
			onConfirm(contact as Contact);
			handleClose();
		};

		return (
			<Drawer isOpen={isOpen} placement='right' onClose={closeDrawer} size={'lg'}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>{isNewContact ? 'Create Contact' : 'Contact Info'}</DrawerHeader>

					<DrawerBody>
						<VStack width={'full'} alignItems={'stretch'} gap={4}>
							<FormControl width={'full'}>
								<FormLabel>Formatted Name</FormLabel>
								<Input
									placeholder='Formatted name'
									type='text'
									readOnly={!isNewContact}
									onChange={(e) => dispatch(setFormattedName(e.target.value))}
									value={contact.name.formatted_name}
								/>
							</FormControl>
							<HStack>
								<FormControl>
									<FormLabel>Prefix</FormLabel>
									<Input
										placeholder='Prefix'
										type='text'
										value={contact.name.prefix}
										readOnly={!isNewContact}
										onChange={(e) => dispatch(setPrefix(e.target.value))}
									/>
								</FormControl>
								<FormControl>
									<FormLabel>First name</FormLabel>
									<Input
										placeholder='First name'
										name='first_name'
										type='text'
										value={contact.name.first_name}
										readOnly={!isNewContact}
										onChange={(e) => dispatch(setFirstName(e.target.value))}
									/>
								</FormControl>
							</HStack>
							<HStack>
								<FormControl width={'full'}>
									<FormLabel>Middle name</FormLabel>
									<Input
										placeholder='Middle name'
										type='text'
										readOnly={!isNewContact}
										onChange={(e) => dispatch(setMiddleName(e.target.value))}
										value={contact.name.middle_name}
									/>
								</FormControl>
								<FormControl width={'full'}>
									<FormLabel>Last name</FormLabel>
									<Input
										placeholder='Last name'
										type='text'
										readOnly={!isNewContact}
										onChange={(e) => dispatch(setLastName(e.target.value))}
										value={contact.name.last_name}
									/>
								</FormControl>
							</HStack>
							<HStack>
								<FormControl width={'full'}>
									<FormLabel>Suffix</FormLabel>
									<Input
										placeholder='Suffix'
										type='text'
										readOnly={!isNewContact}
										onChange={(e) => dispatch(setSuffix(e.target.value))}
										value={contact.name.suffix}
									/>
								</FormControl>
							</HStack>
							<Text>Job Description</Text>
							<FormControl width={'full'}>
								<FormLabel>Company</FormLabel>
								<Input
									placeholder='Company'
									type='text'
									readOnly={!isNewContact}
									onChange={(e) => dispatch(setCurrentCompany(e.target.value))}
									value={contact.org.company}
								/>
							</FormControl>
							<HStack>
								<FormControl width={'full'}>
									<FormLabel>Title</FormLabel>
									<Input
										placeholder='Title'
										type='text'
										readOnly={!isNewContact}
										onChange={(e) => dispatch(setJobTitle(e.target.value))}
										value={contact.org.title}
									/>
								</FormControl>
								<FormControl width={'full'}>
									<FormLabel>Department</FormLabel>
									<Input
										placeholder='Department'
										type='text'
										readOnly={!isNewContact}
										onChange={(e) => dispatch(setDepartment(e.target.value))}
										value={contact.org.department}
									/>
								</FormControl>
							</HStack>
							<FormControl>
								<HStack alignItems={'center'} justifyContent={'space-between'} pb={2}>
									<Text fontWeight={'medium'}>Email</Text>
									{isNewContact && (
										<IconButton
											size={'sm'}
											icon={<IoAdd fontSize={'1.5rem'} />}
											aria-label='Add Email'
											onClick={() => {
												dispatch(addEmptyEmail());
											}}
											colorScheme='green'
										/>
									)}
								</HStack>

								<Each
									items={contact.emails ?? []}
									render={(email, index) => (
										<HStack pb={2}>
											<Input
												flex={1}
												placeholder='Type'
												type='text'
												readOnly={!isNewContact}
												onChange={(e) =>
													dispatch(
														setEmailType({
															index,
															type: e.target.value,
														})
													)
												}
												value={email.type}
											/>
											<Input
												flex={2}
												placeholder='Email'
												type='email'
												readOnly={!isNewContact}
												onChange={(e) =>
													dispatch(
														setEmail({
															index,
															email: e.target.value,
														})
													)
												}
												value={email.email}
											/>
											{isNewContact && (
												<IconButton
													aria-label='Delete Email'
													size={'sm'}
													icon={<FaTrash />}
													onClick={() => {
														dispatch(removeEmail(index));
													}}
													colorScheme={'red'}
												/>
											)}
										</HStack>
									)}
								/>
							</FormControl>

							<FormControl>
								<HStack alignItems={'center'} justifyContent={'space-between'} pb={2}>
									<Text fontWeight={'medium'}>Phone</Text>
									{isNewContact && (
										<IconButton
											size={'sm'}
											icon={<IoAdd fontSize={'1.5rem'} />}
											aria-label='Add Email'
											onClick={() => {
												dispatch(addEmptyPhone());
											}}
											colorScheme='green'
										/>
									)}
								</HStack>

								<Each
									items={contact.phones ?? []}
									render={(phone, index) => (
										<HStack pb={2}>
											<Input
												flex={1}
												placeholder='Type'
												type='text'
												readOnly={!isNewContact}
												onChange={(e) =>
													dispatch(
														setPhoneType({
															index,
															type: e.target.value,
														})
													)
												}
												value={phone.type}
											/>
											<Input
												flex={2}
												placeholder='Phone Number'
												type='email'
												readOnly={!isNewContact}
												onChange={(e) =>
													dispatch(
														setPhone({
															index,
															phone: e.target.value,
														})
													)
												}
												value={phone.phone}
											/>
											{isNewContact && (
												<IconButton
													aria-label='Delete Email'
													size={'sm'}
													icon={<FaTrash />}
													onClick={() => {
														dispatch(removePhone(index));
													}}
													colorScheme={'red'}
												/>
											)}
										</HStack>
									)}
								/>
							</FormControl>

							<FormControl>
								<HStack alignItems={'center'} justifyContent={'space-between'} pb={2}>
									<Text fontWeight={'medium'}>Websites</Text>
									{isNewContact && (
										<IconButton
											size={'sm'}
											icon={<IoAdd fontSize={'1.5rem'} />}
											aria-label='Add Website'
											onClick={() => {
												dispatch(addEmptyUrl());
											}}
											colorScheme='green'
										/>
									)}
								</HStack>

								<Each
									items={contact.urls ?? []}
									render={(url, index) => (
										<HStack pb={2}>
											<Select
												flex={1}
												onChange={(e) => {
													dispatch(
														setUrlType({
															index,
															type: e.target.value,
														})
													);
												}}
											>
												<option value='Work'>Work</option>
												<option value='Others'>Others</option>
											</Select>
											<Input
												flex={2}
												placeholder='URL'
												type='email'
												readOnly={!isNewContact}
												onChange={(e) =>
													dispatch(
														setUrl({
															index,
															url: e.target.value,
														})
													)
												}
												value={url.url}
											/>
											<IconButton
												aria-label='Delete Email'
												size={'sm'}
												icon={<FaTrash />}
												onClick={() => {
													dispatch(removeUrl(index));
												}}
												colorScheme={'red'}
											/>
										</HStack>
									)}
								/>
							</FormControl>

							<FormControl>
								<HStack alignItems={'center'} justifyContent={'space-between'} pb={2}>
									<Text fontWeight={'medium'}>Address</Text>
									{isNewContact && (
										<IconButton
											size={'sm'}
											icon={<IoAdd fontSize={'1.5rem'} />}
											aria-label='Add Address'
											onClick={() => {
												dispatch(addEmptyAddress());
											}}
											colorScheme='green'
										/>
									)}
								</HStack>

								<Each
									items={contact.addresses ?? []}
									render={(address, index) => (
										<HStack pb={4} width={'full'} alignItems={'flex-end'}>
											<Flex direction={'column'} gap={2} flex={1} width={'full'}>
												<Input
													placeholder='Type'
													type='text'
													readOnly={!isNewContact}
													onChange={(e) =>
														dispatch(
															setAddressType({
																index,
																type: e.target.value,
															})
														)
													}
													value={address.type}
												/>

												<HStack>
													<Input
														placeholder='Street'
														type='text'
														readOnly={!isNewContact}
														onChange={(e) =>
															dispatch(
																setAddressStreet({
																	index,
																	street: e.target.value,
																})
															)
														}
														value={address.street}
													/>
													<Input
														placeholder='City'
														type='text'
														readOnly={!isNewContact}
														onChange={(e) =>
															dispatch(
																setAddressCity({
																	index,
																	city: e.target.value,
																})
															)
														}
														value={address.city}
													/>
												</HStack>
												<HStack>
													<Input
														placeholder='State'
														type='text'
														readOnly={!isNewContact}
														onChange={(e) =>
															dispatch(
																setAddressState({
																	index,
																	state: e.target.value,
																})
															)
														}
														value={address.state}
													/>
													<Input
														placeholder='Country'
														type='text'
														readOnly={!isNewContact}
														onChange={(e) =>
															dispatch(
																setAddressCountry({
																	index,
																	country: e.target.value,
																})
															)
														}
														value={address.country}
													/>
												</HStack>
												<HStack>
													<Input
														placeholder='Pincode'
														type='text'
														readOnly={!isNewContact}
														onChange={(e) =>
															dispatch(
																setAddressPostalCode({
																	index,
																	postalCode: e.target.value,
																})
															)
														}
														value={address.zip}
													/>
													<Input
														placeholder='Country Code'
														type='text'
														readOnly={!isNewContact}
														onChange={(e) =>
															dispatch(
																setAddressCountryCode({
																	index,
																	countryCode: e.target.value,
																})
															)
														}
														value={address.country_code}
													/>
												</HStack>
											</Flex>
											{isNewContact && (
												<IconButton
													aria-label='Delete Email'
													size={'sm'}
													icon={<FaTrash />}
													onClick={() => {
														dispatch(removeAddress(index));
													}}
													colorScheme={'red'}
												/>
											)}
										</HStack>
									)}
								/>
							</FormControl>
						</VStack>
					</DrawerBody>

					<DrawerFooter width={'full'}>
						<HStack>
							<Button variant='outline' colorScheme='red' mr={3} onClick={handleClose}>
								Close
							</Button>
							{isNewContact && (
								<Button colorScheme='green' onClick={handleSubmit}>
									{isUpdating ? 'Update' : 'Create'}
								</Button>
							)}
						</HStack>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		);
	}
);

export default ContactDrawer;
