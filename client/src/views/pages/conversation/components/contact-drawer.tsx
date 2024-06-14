import {
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	HStack,
	Input,
	Text,
	VStack,
	useDisclosure,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import Each from '../../../components/utils/Each';

type Contact = {
	addresses?: {
		type?: string;
		street?: string;
		city?: string;
		state?: string;
		zip?: string;
		country?: string;
		country_code?: string;
	}[];
	birthday?: string;
	emails?: {
		email?: string;
		type?: string;
	}[];
	name?: {
		formatted_name?: string;
		first_name?: string;
		last_name?: string;
		middle_name?: string;
		suffix?: string;
		prefix?: string;
	};
	org?: {
		company?: string;
		department?: string;
		title?: string;
	};
	phones?: {
		phone?: string;
		wa_id?: string;
		type?: string;
	}[];
	urls?: {
		url?: string;
		type?: string;
	}[];
};

const initialContactState: Contact = {
	addresses: [
		{
			type: '',
			street: '',
			city: '',
			state: '',
			zip: '',
			country: '',
			country_code: '',
		},
	],
	birthday: '',
	emails: [
		{
			email: '',
			type: '',
		},
	],
	name: {
		formatted_name: '',
		first_name: '',
		last_name: '',
		middle_name: '',
		suffix: '',
		prefix: '',
	},
	org: {
		company: '',
		department: '',
		title: '',
	},
	phones: [
		{
			phone: '',
			wa_id: '',
			type: '',
		},
	],
	urls: [
		{
			url: '',
			type: '',
		},
	],
};

export type ContactHandle = {
	open: ({ contact }: { contact: Contact }) => void;
	onClose: () => void;
};

const ContactDrawer = forwardRef<ContactHandle>((_, ref) => {
	const { isOpen, onOpen, onClose: closeDrawer } = useDisclosure();
	const [contactInfo, setContactInfo] = useState(initialContactState);

	useImperativeHandle(ref, () => ({
		open: ({ contact }) => {
			setContactInfo(contact);
			onOpen();
		},
		onClose: () => {
			setContactInfo(initialContactState);
			closeDrawer();
		},
	}));

	return (
		<Drawer isOpen={isOpen} placement='right' onClose={closeDrawer} size={'lg'}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>Contact Info</DrawerHeader>

				<DrawerBody>
					<VStack width={'full'} alignItems={'stretch'} gap={4}>
						<Box>
							<Text>First name</Text>
							<Input
								placeholder='First name'
								type='text'
								readOnly
								value={contactInfo?.name?.formatted_name}
							/>
						</Box>
						<HStack>
							<Box width={'full'}>
								<Text>Middle name</Text>
								<Input
									placeholder='Middle name'
									type='text'
									readOnly
									value={contactInfo?.name?.middle_name}
								/>
							</Box>
							<Box width={'full'}>
								<Text>Last name</Text>
								<Input
									placeholder='Last name'
									type='text'
									readOnly
									value={contactInfo?.name?.last_name}
								/>
							</Box>
						</HStack>
						<Text>Job Description</Text>
						<HStack>
							<Box width={'full'}>
								<Text>Title</Text>
								<Input placeholder='Title' type='text' readOnly value={contactInfo?.org?.title} />
							</Box>
							<Box width={'full'}>
								<Text>Organization</Text>
								<Input
									placeholder='Organization'
									type='text'
									readOnly
									value={contactInfo?.org?.company}
								/>
							</Box>
						</HStack>
						<Box>
							<Each
								items={contactInfo?.emails ?? []}
								render={(email, index) => (
									<Box key={index}>
										<Text>Email {email.type}</Text>
										<Input placeholder='Email' type='email' readOnly value={email.email} />
									</Box>
								)}
							/>
						</Box>
						<Box>
							<Each
								items={contactInfo?.phones ?? []}
								render={(phone, index) => (
									<Box key={index}>
										<Text>Phone {phone.type}</Text>
										<Input placeholder='Phone' type='tel' readOnly value={phone.phone} />
									</Box>
								)}
							/>
						</Box>
						<Box>
							<Each
								items={contactInfo?.urls ?? []}
								render={(url, index) => (
									<Box key={index}>
										<Text>Website {url.type}</Text>
										<Input placeholder='Website' type='url' readOnly value={url.url} />
									</Box>
								)}
							/>
						</Box>
						<Box>
							<Each
								items={contactInfo?.addresses ?? []}
								render={(address, index) => (
									<Box key={index}>
										<Text>Address {address.type}</Text>
										<Input placeholder='Address' type='text' readOnly value={address.street} />
										<Input placeholder='Address' type='text' readOnly value={address.city} />
										<Input placeholder='Address' type='text' readOnly value={address.state} />
										<Input placeholder='Address' type='text' readOnly value={address.country} />
										<Input placeholder='Address' type='text' readOnly value={address.zip} />
									</Box>
								)}
							/>
						</Box>
					</VStack>
				</DrawerBody>

				<DrawerFooter width={'full'}>
					<HStack>
						<Button variant='outline' colorScheme='green' mr={3} onClick={closeDrawer}>
							Close
						</Button>
					</HStack>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
});

export default ContactDrawer;
