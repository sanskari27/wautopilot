'use client';

import Show from '@/components/containers/show';
import { useSettingDialogState } from '@/components/context/settingState';
import { useUserDetails, useUserDetailsSetter } from '@/components/context/user-details';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthService from '@/services/auth.service';
import { Separator } from '@radix-ui/react-menubar';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function SettingsDialog() {
	const { setting, setSetting } = useSettingDialogState();

	const closeSettings = () => {
		setSetting(false);
	};

	if (setting) {
		return <SettingsForm onClose={closeSettings} />;
	} else {
		return null;
	}
}

export function SettingsForm({ onClose }: { onClose: () => void }) {
	const { name, email, phone, isSubscribed, walletBalance, isAgent } = useUserDetails();
	const setProfile = useUserDetailsSetter();
	const router = useRouter();
	const pathname = usePathname();

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

	useEffect(() => {
		setDetails({
			name: name,
			email: email,
			phone: phone,
		});
	}, [name, email, phone]);

	const handleSave = () => {
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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDetails((prev) => {
			return {
				...prev,
				[e.target.name]: e.target.value,
			};
		});
	};

	const addWalletMoney = async () => {
		if (!addMoney) return;
		const amount = parseInt(addMoney.toString());
		if (isNaN(amount) || amount <= 0) {
			toast.error('Invalid amount');
			return;
		}
		router.replace(`/payment/razorpay/add-money?amount=${addMoney}&redirect_url=${pathname}`);
	};

	return (
		<Dialog open={true} onOpenChange={(value) => !value && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
				</DialogHeader>
				<Tabs defaultValue='profile' className='w-full'>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='profile'>Profile</TabsTrigger>
						<TabsTrigger disabled={isAgent} value='settings'>
							Settings
						</TabsTrigger>
					</TabsList>
					<TabsContent value='profile'>
						<p>Name</p>
						<Input defaultValue={details.name} onChange={handleChange} readOnly={!isEditing} />
						<p>Email</p>
						<Input defaultValue={details.email} onChange={handleChange} readOnly={!isEditing} />
						<p>Phone</p>
						<Input defaultValue={details.phone} onChange={handleChange} readOnly={!isEditing} />
						<DialogFooter className='mt-4'>
							<Show>
								<Show.When condition={isEditing}>
									<Button onClick={handleSave}>Save</Button>
									<Button variant={'destructive'} onClick={() => setIsEditing(false)}>
										Cancel
									</Button>
								</Show.When>
								<Show.Else>
									<Button onClick={() => setIsEditing(true)}>Edit</Button>
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
