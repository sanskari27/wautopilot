'use client';

import { Button } from '@/components/ui/button';
import Combobox from '@/components/ui/combobox';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import APIWebhookService from '@/services/apiwebhook.service';
import DeviceService from '@/services/device.service';
import { Copy } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { createWebhook } from '../action';

type Device = {
	id: string;
	phoneNumberId: string;
	waid: string;
	phoneNumber: string;
	verifiedName: string;
};

export function CreateAPIKeyDialog() {
	const searchParams = useSearchParams();
	const token = searchParams.get('token');
	const router = useRouter();
	const pathname = usePathname();

	const [devices, setDevices] = useState<{ label: string; value: string }[]>([]);
	const [selectedDevice, setSelectedDevice] = useState<string>('');
	const [name, setName] = useState<string>('');

	const fetchDevices = useCallback(() => {
		DeviceService.listDevices().then(({ devices }) => {
			setDevices(devices.map((device) => ({ label: device.verifiedName, value: device.id })));
		});
	}, []);

	useEffect(() => {
		fetchDevices();
	}, [fetchDevices]);

	if (!token) {
		return null;
	}
	const copyToken = () => {
		toast.success('Token copied to clipboard');
		navigator.clipboard.writeText(token);
	};
	const handleSave = () => {
		if (!name || !selectedDevice) {
			return toast.error('Please fill all fields');
		}
		const promise = APIWebhookService.createApiKey(name, selectedDevice);

		toast.promise(promise, {
			loading: 'Creating API Key...',
			success: (token) => {
				const url = new URL((window as any).location);
				url.searchParams.set('token', token);
				router.replace(url.toString());
				return 'API Key created successfully';
			},
			error: (err) => {
				return 'Failed to create API Key';
			},
		});
	};

	if (token === 'create') {
		return (
			<Dialog
				open={true}
				onOpenChange={(value) => {
					if (!value) {
						router.replace(pathname);
					}
				}}
			>
				<DialogContent>
					<DialogHeader>Create API key</DialogHeader>
					<div className='grid space-y-1'>
						<Label className='mb-0'>Name</Label>
						<Input value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
						<Label className='mb-0'>Device</Label>
						<Combobox
							placeholder='Select device'
							value={selectedDevice}
							items={devices}
							onChange={setSelectedDevice}
						/>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant='secondary'>Cancel</Button>
						</DialogClose>
						<Button onClick={handleSave}>Save</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog
			open={true}
			onOpenChange={(value) => {
				if (!value) {
					router.replace(pathname);
				}
			}}
		>
			<DialogContent>
				<DialogHeader>Token</DialogHeader>
				<div className='flex gap-2'>
					<div className='flex-1'>
						<Input value={token} readOnly placeholder='Token' />
					</div>
					<Button variant={'outline'} size={'icon'} onClick={copyToken}>
						<Copy />
					</Button>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant='secondary'>Close</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function CreateWebhookDialog() {
	const webhook = useSearchParams().get('webhook');
	const router = useRouter();
	const pathname = usePathname();

	const [devices, setDevices] = useState<Device[]>([]);
	const [selectedDevice, setSelectedDevice] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [url, setUrl] = useState<string>('');

	const fetchDevices = useCallback(() => {
		DeviceService.listDevices().then(({ devices }) => {
			setDevices(devices);
		});
	}, []);

	useEffect(() => {
		fetchDevices();
	}, [fetchDevices]);

	const handleSave = () => {
		if (!name || !selectedDevice || !url) {
			return toast.error('Please fill all fields');
		}
		if (!Boolean(new URL(url))) {
			return toast.error('Invalid URL');
		}
		const promise = createWebhook(name, selectedDevice, url);

		toast.promise(promise, {
			loading: 'Creating Webhook...',
			success: () => {
				router.replace(pathname);
				return 'Webhook created successfully';
			},
			error: (err) => {
				return 'Failed to create Webhook';
			},
		});
	};

	if (!webhook) {
		return null;
	}

	return (
		<Dialog
			open={true}
			onOpenChange={(value) => {
				if (!value) {
					router.replace(pathname);
				}
			}}
		>
			<DialogContent>
				<DialogHeader>Create Webhook</DialogHeader>
				<div className='grid space-y-1'>
					<Label className='mb-0'>Name</Label>
					<Input value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
					<Label className='mb-0'>Device</Label>
					<Combobox
						placeholder='Select device'
						value={selectedDevice}
						items={devices.map((device) => ({
							label: device.verifiedName,
							value: device.id,
						}))}
						onChange={setSelectedDevice}
					/>
					<Label className='mb-0'>URL</Label>
					<Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder='URL' />
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant='secondary'>Cancel</Button>
					</DialogClose>
					<Button onClick={handleSave}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
