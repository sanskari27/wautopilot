'use client';

import Show from '@/components/containers/show';
import { useUserDetails, useUserDetailsSetter } from '@/components/context/user-details';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthService from '@/services/auth.service';
import { Separator } from '@radix-ui/react-menubar';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function SettingsDialog() {
	const { name, email, phone, isSubscribed, walletBalance } = useUserDetails();
	const setProfile = useUserDetailsSetter();

	const [details, setDetails] = React.useState<{
		name: string;
		email: string;
		phone: string;
	}>({
		name: '',
		email: '',
		phone: '',
	});

	const [addMoney, setAddMoney] = React.useState('0');

	const [isEditing, setIsEditing] = React.useState(false);

	const searchParams = useSearchParams();
	const router = useRouter();
	useEffect(() => {
		setDetails({
			name: name,
			email: email,
			phone: phone,
		});
	}, [name, email, phone]);
	if (!Array.from(searchParams.keys()).includes('settings')) {
		return null;
	}

	const closeSettings = () => {
		const url = new URL((window as any).location);
		if (url.searchParams.has('settings')) {
			url.searchParams.delete('settings');
		}
		router.replace(url.toString());
	};

	const handleEdit = (value: boolean) => {
		setIsEditing(value);
	};

	const handleSave = () => {
		console.log(details);
		toast.promise(AuthService.updateProfileDetails(details), {
			loading: 'Saving...',
			success: () => {
				setIsEditing(false);
				setProfile(details);
				return 'Profile updated';
			},
			error: 'Failed to update profile',
		});
	};

	// const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
	// 	e.preventDefault();
	// 	try {
	// 		const orderId: string = await createOrderId();
	// 		const options = {
	// 			key: process.env.key_id,
	// 			amount: parseFloat(amount) * 100,
	// 			currency: currency,
	// 			name: 'name',
	// 			description: 'description',
	// 			order_id: orderId,
	// 			handler: async function (response: any) {
	// 				const data = {
	// 					orderCreationId: orderId,
	// 					razorpayPaymentId: response.razorpay_payment_id,
	// 					razorpayOrderId: response.razorpay_order_id,
	// 					razorpaySignature: response.razorpay_signature,
	// 				};

	// 				const result = await fetch('/api/verify', {
	// 					method: 'POST',
	// 					body: JSON.stringify(data),
	// 					headers: { 'Content-Type': 'application/json' },
	// 				});
	// 				const res = await result.json();
	// 				if (res.isOk) alert('payment succeed');
	// 				else {
	// 					alert(res.message);
	// 				}
	// 			},
	// 			prefill: {
	// 				name: name,
	// 				email: email,
	// 			},
	// 			theme: {
	// 				color: '#3399cc',
	// 			},
	// 		};
	// 		const paymentObject = new window.Razorpay(options);
	// 		paymentObject.on('payment.failed', function (response: any) {
	// 			alert(response.error.description);
	// 		});
	// 		paymentObject.open();
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

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
		try {
			const rzp1 = new (window as any).Razorpay({
				...razorpay_options,
				handler: async function () {
					AuthService.confirmPayment(transaction_id).then((res) => {
						if (res) {
							toast.success('Payment successful');
							AuthService.userDetails().then((res) => {
								if (res) {
									setProfile(res);
								}
							});
						} else {
							toast.error('Payment failed');
						}
					});
				},
				modal: {
					ondismiss: function () {
						console.log('dismissed');
						toast.error('Payment failed');
					},
				},
			});

			rzp1.open();
		} catch (err) {
			console.log(err);
		}
	};

	const addWalletMoney = async () => {
		if (!addMoney) return;
		const amount = parseInt(addMoney.toString());
		if (isNaN(amount) || amount <= 0) {
			toast.error('Invalid amount');
			return;
		}
		toast.promise(AuthService.addMoney(amount), {
			loading: 'Transaction in progress...',
			success: (res) => {
				handlePayment(res.razorpay_options, res.transaction_id);
				setAddMoney('0');
				return 'Continue to payment';
			},
			error: (err) => {
				console.log(err);
				return 'Failed to add money';
			},
		});
	};

	return (
		<Dialog
			open={true}
			onOpenChange={(value) => {
				if (!value) {
					setDetails({
						name: name,
						email: email,
						phone: phone,
					});
					closeSettings();
				}
			}}
		>
			<DialogContent>
				<DialogHeader>Settings</DialogHeader>
				<Tabs defaultValue='profile' className='w-full'>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='profile'>Profile</TabsTrigger>
						<TabsTrigger value='settings'>Settings</TabsTrigger>
					</TabsList>
					<TabsContent value='profile'>
						<p>Name</p>
						<Input
							defaultValue={details.name}
							onChange={(e) =>
								setDetails((prev) => {
									return {
										...prev,
										name: e.target.value,
									};
								})
							}
							readOnly={!isEditing}
						/>
						<p>Email</p>
						<Input
							defaultValue={details.email}
							onChange={(e) =>
								setDetails((prev) => {
									return {
										...prev,
										email: e.target.value,
									};
								})
							}
							readOnly={!isEditing}
						/>
						<p>Phone</p>
						<Input
							defaultValue={details.phone}
							onChange={(e) =>
								setDetails((prev) => {
									return {
										...prev,
										phone: e.target.value,
									};
								})
							}
							readOnly={!isEditing}
						/>
						<DialogFooter className='mt-4'>
							<Show>
								<Show.When condition={isEditing}>
									<Button onClick={handleSave}>Save</Button>
									<Button variant={'destructive'} onClick={() => handleEdit(false)}>
										Cancel
									</Button>
								</Show.When>
								<Show.Else>
									<Button onClick={() => handleEdit(true)}>Edit</Button>
								</Show.Else>
							</Show>
						</DialogFooter>
					</TabsContent>
					<TabsContent value='settings'>
						<div className='flex gap-2'>
							<div
								className={`flex-1 text-center px-4 py-2 rounded-lg mb-4 bg-${
									isSubscribed ? 'blue-200' : 'red-200'
								} text-${isSubscribed ? 'blue-500' : 'red-500'}`}
							>
								<p>{isSubscribed ? 'Subscribed' : 'Not Subscribed'}</p>
							</div>
							<div className='flex-1 text-center px-4 py-2 rounded-lg mb-4 bg-blue-200 text-blue-500'>
								<p>Balance : ₹{walletBalance}</p>
							</div>
						</div>
						<Separator className='my-4' />
						<div className='flex items-end gap-2'>
							<div>
								<p>Amount</p>
								<div>
									<Input
										type='number'
										value={addMoney}
										onChange={(e) => setAddMoney(e.target.value)}
									/>
								</div>
							</div>
							<Button onClick={addWalletMoney}>Add</Button>
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
