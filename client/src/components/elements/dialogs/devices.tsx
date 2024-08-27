'use client';
import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { useUserDetails } from '@/components/context/user-details';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import useBoolean from '@/hooks/useBoolean';
import { META_APP_ID, META_CONFIG_ID } from '@/lib/consts';
import DeviceService from '@/services/device.service';
import { Facebook, ShieldCheck, Trash } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import DeleteDialog from './delete';

type Device = {
	id: string;
	phoneNumberId: string;
	waid: string;
	phoneNumber: string;
	verifiedName: string;
};

export default function DevicesDialog() {
	const searchParams = useSearchParams();
	const devices = searchParams.get('devices');
	const addDevices = searchParams.get('add-device');

	if (devices) return <DevicesList />;
	else if (addDevices) return <AddDeviceDialog />;
	else {
		return null;
	}
}

function DevicesList() {
	const { isAgent, max_devices } = useUserDetails();
	const router = useRouter();
	const pathname = usePathname();
	const [devices, setDevices] = useState<Device[]>([]);
	const [current, setCurrent] = useState<string>('');

	const fetchDevices = useCallback(() => {
		DeviceService.listDevices().then(({ currentDevice, devices }) => {
			setDevices(devices);
			setCurrent(currentDevice);
		});
	}, []);

	useEffect(() => {
		fetchDevices();
	}, [fetchDevices]);

	const handleRemoveDevice = (id: string) => {
		DeviceService.removeDevice(id)
			.then(fetchDevices)
			.catch(() => {
				toast.error('Error removing device');
			});
	};

	const setCurrentDevice = (id: string) => {
		DeviceService.setCurrentDevice(id)
			.then(fetchDevices)
			.catch(() => {
				toast.error('Error setting device as current');
			});
	};

	const closeDevices = () => {
		const url = new URL((window as any).location);
		if (url.searchParams.has('devices')) {
			url.searchParams.delete('devices');
		}
		router.replace(url.toString());
	};

	const openAddDevices = () => {
		const url = new URL((window as any).location);
		if (!url.searchParams.has(`add-device`)) {
			if (url.searchParams.has('devices')) {
				url.searchParams.delete('devices');
			}
			url.searchParams.set(`add-device`, 'true');
		}
		router.replace(url.toString());
	};

	return (
		<Dialog
			defaultOpen={true}
			onOpenChange={(value) => {
				if (!value) {
					closeDevices();
				}
			}}
		>
			<DialogContent className='sm:max-w-[425px] md:max-w-xl lg:max-w-3xl'>
				<DialogHeader>
					<DialogTitle className='text-center'>Devices</DialogTitle>
				</DialogHeader>
				<RadioGroup value={current} onValueChange={setCurrentDevice}>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead></TableHead>
								<TableHead>VERIFIED NAME</TableHead>
								<TableHead>PHONE NUMBER</TableHead>
								<TableHead>PHONE NUMBER ID</TableHead>
								<TableHead>WABA ID</TableHead>
								<TableHead className='w-[50px]'></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<Each
								items={devices}
								render={(device) => (
									<TableRow>
										<TableCell className='font-medium'>
											<RadioGroupItem value={device.id} />
										</TableCell>
										<TableCell className='font-medium'>{device.verifiedName}</TableCell>
										<TableCell>{device.phoneNumber}</TableCell>
										<TableCell>
											XXXX{device.phoneNumberId.substring(device.phoneNumberId.length - 4)}
										</TableCell>
										<TableCell>XXXX{device.waid.substring(device.waid.length - 4)}</TableCell>
										<TableCell>
											<Show.ShowIf condition={!isAgent}>
												<DeleteDialog onDelete={() => handleRemoveDevice(device.id)}>
													<Button variant='destructive' size='icon'>
														<Trash className='h-4 w-4' />
													</Button>
												</DeleteDialog>
											</Show.ShowIf>
										</TableCell>
									</TableRow>
								)}
							/>
						</TableBody>
					</Table>
				</RadioGroup>
				<Show.ShowIf condition={max_devices === 0}>
					<Label>
						Please subscribe to add devices.{' '}
						<Link href={'?settings=true'} className='hover:underline text-primary'>
							Subscribe
						</Link>
					</Label>
				</Show.ShowIf>
				<DialogFooter>
					<Button
						variant={'ghost'}
						onClick={() => {
							router.replace(pathname);
						}}
					>
						Close
					</Button>
					<Show.ShowIf condition={!isAgent && max_devices > devices.length}>
						<Button onClick={openAddDevices}>Add Device</Button>
					</Show.ShowIf>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function AddDeviceDialog() {
	const router = useRouter();

	const { value: isOpen, ...setIsOpen } = useBoolean(false);
	const { value: loading, ...setLoading } = useBoolean();
	const { value: facebookSignupLoading, ...setFacebookSignupLoading } = useBoolean();

	const [details, setDetails] = useState({
		phoneNumberId: '',
		waid: '',
		accessToken: '',
		code: '',
	});

	const closeAddDevice = () => {
		const url = new URL((window as any).location);
		if (url.searchParams.has('add-device')) {
			if (!url.searchParams.has('devices')) {
				url.searchParams.set('devices', 'true');
			}
			url.searchParams.delete('add-device');
		}
		router.replace(url.toString());
	};

	const onDeviceAdded = useCallback(() => {
		const url = new URL((window as any).location);
		if (url.searchParams.has('add-device')) {
			if (!url.searchParams.has('devices')) {
				url.searchParams.set('devices', 'true');
			}
			url.searchParams.delete('add-device');
		}
		router.replace(url.toString());
	}, [router]);

	const handleSave = useCallback(async () => {
		setLoading.on();
		const success = await DeviceService.addDevice(details);

		setLoading.off();
		if (success) {
			toast.success('Device added successfully.');
			onDeviceAdded();
		} else {
			toast.error('Entry already exists or invalid details. Please check and try again.');
		}
		setIsOpen.off();
	}, [setLoading, details, setIsOpen, onDeviceAdded]);

	const onClose = () => {
		setIsOpen.off();
	};

	// --------------------------------------------- META REGISTRATION SCRIPTS ---------------------------------------------
	useEffect(() => {
		(window as any).fbAsyncInit = () => {
			(window as any).FB.init({
				appId: META_APP_ID,
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
						toast.error('Error signing up with facebook. Please try again.');
					}
				}
			} catch (err) {
				//ignore
			}
		};

		window.addEventListener('message', sessionInfoListener);
	}, []);

	async function launchWhatsAppSignup() {
		// Launch Facebook login
		setFacebookSignupLoading.on();
		(window as any).FB.login(
			function (data: any) {
				if (!data.authResponse) {
					setFacebookSignupLoading.off();
					toast.error('Login cancelled or did not fully authorize.');
					return;
				}

				const code = data.authResponse.code;
				setDetails((prev) => ({
					...prev,
					code,
				}));
			},
			{
				config_id: META_CONFIG_ID,
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
		<Dialog
			defaultOpen={true}
			onOpenChange={(value) => {
				if (!value) {
					closeAddDevice();
				}
			}}
		>
			<DialogContent className='sm:max-w-[425px] md:max-w-md lg:max-w-lg'>
				<DialogHeader>
					<DialogTitle className='text-center'>Add Device</DialogTitle>
				</DialogHeader>
				<div>
					<Button
						className='w-full bg-blue-500 hover:bg-blue-600'
						onClick={launchWhatsAppSignup}
						disabled={facebookSignupLoading}
					>
						<Facebook className='w-4 h-4 mr-2' />
						Facebook Embedded Signup
					</Button>
					<div className='relative my-4'>
						<div className='absolute w-full top-[50%] -translate-y-[50%] -z-[10]'>
							<div className='h-[1px] w-full bg-gray-300' />
						</div>
						<div className='inline-flex justify-center w-full'>
							<span className='bg-white px-2'>OR</span>
						</div>
					</div>

					<div className='space-y-4'>
						<div>
							<Label htmlFor='phoneNumberId' className='text-primary'>
								Phone Number ID<span className='ml-[0.2rem] text-red-800'>*</span>
							</Label>
							<Input
								type='text'
								value={details.phoneNumberId}
								className='text-primary placeholder:text-primary/70'
								placeholder='XXXXXXXXXXXX'
								onChange={(e) => setDetails((prev) => ({ ...prev, phoneNumberId: e.target.value }))}
							/>
						</div>

						<div>
							<Label htmlFor='waid' className='text-primary'>
								WABA ID<span className='ml-[0.2rem] text-red-800'>*</span>
							</Label>
							<Input
								type='text'
								value={details.waid}
								className='text-primary placeholder:text-primary/70'
								placeholder='XXXXXXXXXXXX'
								onChange={(e) => setDetails((prev) => ({ ...prev, waid: e.target.value }))}
							/>
						</div>

						<div>
							<Label htmlFor='accessToken' className='text-primary'>
								Access Token<span className='ml-[0.2rem] text-red-800'>*</span>
							</Label>
							<Textarea
								value={details.accessToken}
								className='w-full text-primary placeholder:text-primary/70'
								placeholder='Access token here...'
								onChange={(e) => setDetails((prev) => ({ ...prev, accessToken: e.target.value }))}
							/>
						</div>

						<Button onClick={handleSave} disabled={loading} className='w-full'>
							<ShieldCheck className='w-4 h-4 mr-2' />
							Save
						</Button>
						<div className='flex justify-center'>
							<Link href={'https://wautopilot.com/docs/webhook-setup'} target='_blank'>
								Need help setting webhook? Click Here
							</Link>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
