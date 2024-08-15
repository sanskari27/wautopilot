'use client';

import Show from '@/components/containers/show';
import { useUserDetails } from '@/components/context/user-details';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthService from '@/services/auth.service';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function SettingsDialog() {
	const { name, email, phone } = useUserDetails();

	const [details, setDetails] = React.useState<{
		name: string;
		email: string;
		phone: string;
	}>({
		name: '',
		email: '',
		phone: '',
	});

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
		toast.promise(AuthService.updateProfileDetails(details), {
			loading: 'Saving...',
			success: 'Profile updated',
			error: 'Failed to update profile',
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
						<Input defaultValue={details.name} readOnly={!isEditing} />
						<p>Email</p>
						<Input defaultValue={details.email} readOnly={!isEditing} />
						<p>Phone</p>
						<Input defaultValue={details.phone} readOnly={!isEditing} />
					</TabsContent>
					<TabsContent value='settings'>2</TabsContent>
				</Tabs>
				<DialogFooter>
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
			</DialogContent>
		</Dialog>
	);
}
