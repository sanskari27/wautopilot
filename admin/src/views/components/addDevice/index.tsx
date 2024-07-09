/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	AbsoluteCenter,
	Box,
	Button,
	Center,
	Divider,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Stack,
	Textarea,
	useBoolean,
	useToast,
} from '@chakra-ui/react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { FaFacebook } from 'react-icons/fa';
import { MdDataSaverOff } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { WEBPAGE_URL } from '../../../config/const';
import DeviceService from '../../../services/device.service';

export type AddDeviceHandle = {
	open: () => void;
};

export type AddDeviceProps = {
	onDeviceAdded: () => void;
};

const AddDevice = forwardRef<AddDeviceHandle, AddDeviceProps>(
	({ onDeviceAdded }: AddDeviceProps, ref) => {
		const [isOpen, setIsOpen] = useBoolean(false);
		const [loading, setLoading] = useBoolean();
		const [facebookSignupLoading, setFacebookSignupLoading] = useBoolean();
		const toast = useToast();

		useImperativeHandle(ref, () => ({
			open: () => {
				setIsOpen.on();
			},
		}));

		const [details, setDetails] = useState({
			phoneNumberId: '',
			waid: '',
			accessToken: '',
			code: '',
		});

		const handleChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setDetails((prev) => ({
				...prev,
				[e.target.name]: e.target.value,
			}));
		};

		const handleSave = useCallback(async () => {
			setLoading.on();
			const success = await DeviceService.addDevice(details);

			setLoading.off();
			if (success) {
				toast({
					title: 'Device added successfully.',
					description: 'Devices will reflect in the dashboard shortly.',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				onDeviceAdded();
			} else {
				toast({
					title: 'Error adding device.',
					description: 'Entry already exists or invalid details. Please check and try again.',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			}
			setIsOpen.off();
		}, [setLoading, details, setIsOpen, toast, onDeviceAdded]);

		const onClose = () => {
			setIsOpen.off();
		};

		// --------------------------------------------- META REGISTRATION SCRIPTS ---------------------------------------------
		useEffect(() => {
			(window as any).fbAsyncInit = () => {
				(window as any).FB.init({
					appId: import.meta.env.VITE_DATA_META_APP_ID,
					cookie: true,
					xfbml: true,
					version: 'v20.0',
				});
			};

			(function (d, s, id) {
				const fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) {
					return;
				}
				const js = d.createElement(s);
				js.id = id;
				(js as any).src = 'https://connect.facebook.net/en_US/sdk.js';
				fjs.parentNode?.insertBefore(js, fjs);
			})(document, 'script', 'facebook-jssdk');

			const sessionInfoListener = (event: any) => {
				try {
					const data = JSON.parse(event.data);
					if (data.type === 'WA_EMBEDDED_SIGNUP') {
						// if user finishes the Embedded Signup flow
						if (data.event === 'FINISH') {
							const { phone_number_id, waba_id } = data.data;
							setDetails((prev) => ({
								...prev,
								phoneNumberId: phone_number_id,
								waid: waba_id,
							}));
						} else {
							toast({
								title: 'Error adding device.',
								description: 'Error signing up with facebook. Please try again.',
								status: 'error',
								duration: 3000,
								isClosable: true,
							});
						}
					}
				} catch (err) {
					//ignore
				}
			};

			window.addEventListener('message', sessionInfoListener);
		}, [toast]);

		async function launchWhatsAppSignup() {
			// Launch Facebook login
			setFacebookSignupLoading.on();
			(window as any).FB.login(
				function (data: any) {
					if (!data.authResponse) {
						setFacebookSignupLoading.off();
						toast({
							title: 'Error adding device.',
							description: 'Login cancelled or did not fully authorize.',
							status: 'error',
							duration: 3000,
							isClosable: true,
						});
					}

					const code = data.authResponse.code;
					setDetails((prev) => ({
						...prev,
						code,
					}));
				},
				{
					config_id: import.meta.env.VITE_DATA_META_CONFIG_ID,
					response_type: 'code',
					override_default_response_type: true,
					extras: {
						feature: 'whatsapp_embedded_signup',
						sessionInfoVersion: 2,
					},
				}
			);
		}

		useEffect(() => {
			if (!details.code || !details.phoneNumberId) {
				return;
			}
			handleSave().then(() => {
				setFacebookSignupLoading.off();
			});
		}, [details, handleSave, setFacebookSignupLoading]);

		// --------------------------------------------- META REGISTRATION SCRIPTS  END ---------------------------------------------

		return (
			<Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign={'center'}>Add Device</ModalHeader>
					<ModalBody pb={'2rem'}>
						<Button
							width={'full'}
							colorScheme='blue'
							leftIcon={<FaFacebook />}
							onClick={launchWhatsAppSignup}
							isLoading={facebookSignupLoading}
						>
							Facebook Embedded Signup
						</Button>
						<Box position='relative' marginY={'1.5rem'}>
							<Divider />
							<AbsoluteCenter bg='white' px='4'>
								OR
							</AbsoluteCenter>
						</Box>
						<Stack gap={2}>
							<FormControl>
								<FormLabel htmlFor='email' color={'#0b826f'}>
									Phone Number ID
								</FormLabel>
								<Input
									name='phoneNumberId'
									value={details.phoneNumberId}
									variant='unstyled'
									bgColor={'white'}
									onChange={handleChanges}
									placeholder='XXXXXXXXXXXX'
									_placeholder={{
										color: 'green',
										opacity: 0.7,
									}}
									borderColor={'green'}
									borderWidth={'1px'}
									padding={'0.5rem'}
									marginTop={'-0.5rem'}
									isDisabled={facebookSignupLoading}
								/>
							</FormControl>
							<FormControl>
								<FormLabel htmlFor='email' color={'#0b826f'}>
									WA ID
								</FormLabel>
								<Input
									name='waid'
									value={details.waid}
									variant='unstyled'
									bgColor={'white'}
									onChange={handleChanges}
									placeholder='XXXXXXXXXXXX'
									_placeholder={{
										color: 'green',
										opacity: 0.7,
									}}
									borderColor={'green'}
									borderWidth={'1px'}
									padding={'0.5rem'}
									isDisabled={facebookSignupLoading}
									marginTop={'-0.5rem'}
								/>
							</FormControl>
							<FormControl>
								<FormLabel htmlFor='email' color={'#0b826f'}>
									Access Token
								</FormLabel>
								<Textarea
									name='accessToken'
									value={details.accessToken}
									variant='unstyled'
									bgColor={'white'}
									onChange={handleChanges}
									placeholder='Access Token Here'
									_placeholder={{
										color: 'green',
										opacity: 0.7,
									}}
									borderColor={'green'}
									borderWidth={'1px'}
									padding={'0.5rem'}
									isDisabled={facebookSignupLoading}
									marginTop={'-0.5rem'}
								/>
							</FormControl>

							<Button
								width={'full'}
								colorScheme='green'
								leftIcon={<MdDataSaverOff />}
								onClick={handleSave}
								isLoading={loading}
							>
								Save
							</Button>

							<Center>
								<Link to={WEBPAGE_URL + 'docs/webhook-setup'} target='_blank'>
									Need help setting webhook? Click Here
								</Link>
							</Center>
						</Stack>
					</ModalBody>
				</ModalContent>
			</Modal>
		);
	}
);

export default AddDevice;
