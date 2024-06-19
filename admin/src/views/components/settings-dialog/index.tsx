/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Box,
	Button,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useBoolean,
	useToast,
} from '@chakra-ui/react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from '../../../services/auth.service';
import { StoreNames, StoreState } from '../../../store';
import { setUserDetails } from '../../../store/reducers/UserReducers';

export type SettingsDrawerHandle = {
	open: () => void;
	close: () => void;
};

const SettingsDrawer = forwardRef<SettingsDrawerHandle>((_, ref) => {
	const toast = useToast();
	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState(false);
	const [money, setMoney] = useState<{
		amount: string;
		isPaymentProcessing: boolean;
	}>({
		amount: '',
		isPaymentProcessing: false,
	});
	const [addMoneySection, setAddMoneySection] = useBoolean(false);

	const { user_details } = useSelector((state: StoreState) => state[StoreNames.USER]);

	useImperativeHandle(ref, () => ({
		open: () => {
			setIsOpen(true);
		},
		close: () => onclose,
	}));

	const onClose = () => setIsOpen(false);

	const handlePayment = (
		razorpay_options: {
			description: string;
			currency: string;
			amount: number;
			name: string;
			order_id: string;
			prefill: {
				name: string;
				email: string;
				contact: string;
			};
			key: string;
			theme: {
				color: string;
			};
		},
		transaction_id: string
	) => {
		const rzp1 = new (window as any).Razorpay({
			...razorpay_options,
			handler: function () {
				AuthService.confirmPayment(transaction_id).then((res) => {
					if (res) {
						toast({
							title: 'Payment successful',
							status: 'success',
						});
						AuthService.userDetails().then((res) => {
							if (res) {
								dispatch(setUserDetails(res));
							}
						});
					} else {
						toast({
							title: 'Payment failed',
							status: 'error',
						});
					}
					setMoney((prev) => ({ ...prev, isPaymentProcessing: false }));
				});
			},
			modal: {
				ondismiss: function () {
					setMoney((prev) => ({ ...prev, isPaymentProcessing: false }));
				},
			},
		});

		rzp1.open();
	};

	const addWalletMoney = async () => {
		if (!money.amount) return;
		setMoney((prev) => ({ ...prev, isPaymentProcessing: true }));
		const amount = parseInt(money.amount.toString());
		AuthService.addMoney(amount)
			.then((res) => {
				if (res) {
					handlePayment(res.razorpay_options, res.transaction_id);
					setMoney((prev) => ({ ...prev, amount: '' }));
					setAddMoneySection.off();
				}
			})
			.catch((err) => {
				toast({
					title: err.message,
					status: 'error',
				});
			});
	};

	useEffect(() => {
		AuthService.userDetails().then((user) => user && dispatch(setUserDetails(user)));
	}, [dispatch]);

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Settings</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<HStack justifyContent={'space-between'}>
							<Box
								background={user_details.isSubscribed ? 'rgb(198 227 255)' : 'rgb(255 201 201)'}
								width={'fit-content'}
								px={'1rem'}
								py={'0.5rem'}
								rounded={'lg'}
								color={user_details.isSubscribed ? 'rgb(21 143 255)' : 'rgb(255, 38, 38)'}
								mb={'1rem'}
							>
								<Text>{user_details.isSubscribed ? 'Subscribed' : 'Not Subscribed'}</Text>
							</Box>
							<Box
								background={'rgb(198 227 255)'}
								width={'fit-content'}
								px={'1rem'}
								py={'0.5rem'}
								rounded={'lg'}
								color={'rgb(21 143 255)'}
								mb={'1rem'}
							>
								<Text>Balance : ₹{user_details.walletBalance}</Text>
							</Box>
						</HStack>
						<Flex direction={'column'} gap={'0.5rem'}>
							<FormControl>
								<FormLabel mb={0}>Name</FormLabel>
								<Input value={user_details.name} readOnly />
							</FormControl>
							<FormControl>
								<FormLabel mb={0}>Email</FormLabel>
								<Input value={user_details.email} readOnly />
							</FormControl>
							<FormControl>
								<FormLabel mb={0}>Phone Number</FormLabel>
								<Input value={user_details.phone} readOnly />
							</FormControl>
						</Flex>
						{addMoneySection && (
							<>
								<Divider orientation='horizontal' my={'1rem'} />
								<Flex direction={'row'} alignItems={'flex-end'} gap={'0.5rem'}>
									<FormControl>
										<FormLabel mb={0}>Amount</FormLabel>
										<Input
											type='number'
											value={money.amount}
											onChange={(e) => setMoney((prev) => ({ ...prev, amount: e.target.value }))}
											placeContent={'1000'}
										/>
									</FormControl>
									<Button
										colorScheme='green'
										onClick={addWalletMoney}
										isLoading={money.isPaymentProcessing}
									>
										Add
									</Button>
								</Flex>
							</>
						)}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='teal' onClick={setAddMoneySection.toggle}>
							{addMoneySection ? 'Cancel' : 'Add Money'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
});

export default SettingsDrawer;
