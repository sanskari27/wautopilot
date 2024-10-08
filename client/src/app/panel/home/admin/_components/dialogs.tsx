'use client';

import Each from '@/components/containers/each';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { PLANS } from '@/lib/consts';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ExtendAdminExpiry, SetMarkUpPrice, UpgradePlan } from '../action';

export function ExtendExpiryDialog() {
	const searchParams = useSearchParams();
	const pathName = usePathname();
	const router = useRouter();
	const id = searchParams.get('extend-expiry');
	const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
	if (!id) return null;

	const extendExpiry = () => {
		toast.promise(ExtendAdminExpiry(id, date), {
			loading: 'Extending expiry...',
			success: () => {
				router.replace(pathName);
				return 'Expiry extended successfully';
			},
			error: 'Failed to extend expiry',
		});
	};

	return (
		<Dialog
			open={true}
			onOpenChange={(value) => {
				if (!value) {
					router.replace(pathName);
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Extend Expiry</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Are you sure? You can{'&apos'}t undo this action afterwards.
				</DialogDescription>
				<Input
					placeholder='Enter new expiry date'
					type='date'
					onChange={(e) => setDate(e.target.value)}
					min={new Date().toISOString().split('T')[0]}
					value={date}
				/>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant={'destructive'}>Close</Button>
					</DialogClose>
					<Button onClick={extendExpiry}>Upgrade</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function MarkupPriceDialog() {
	const [markupPrice, setMarkupPrice] = useState<string>('');
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathName = usePathname();
	const id = searchParams.get('markup-price');
	const price = searchParams.get('price');

	const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			return toast.error('Please enter a valid markup price');
		}
		setMarkupPrice(e.target.value);
	};

	useEffect(() => {
		if (price) {
			setMarkupPrice(price ?? '');
		}
	}, [price]);

	if (!id) return null;

	const handleSave = () => {
		if (markupPrice === '' || Number(markupPrice) < 0)
			return toast.error('Please enter a valid markup price');
		toast.promise(SetMarkUpPrice(id, Number(markupPrice)), {
			loading: 'Saving...',
			success: () => {
				router.replace(pathName);
				return 'Markup price saved successfully';
			},
			error: (err) => {
				return 'Failed to save markup price';
			},
		});
	};

	return (
		<Dialog
			open={true}
			onOpenChange={(value) => {
				if (!value) {
					router.replace(pathName);
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Set Markup Price</DialogTitle>
				</DialogHeader>
				<Input
					placeholder='Enter Markup Price'
					value={markupPrice}
					type='number'
					onChange={handlePriceInput}
				/>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant={'destructive'}>Close</Button>
					</DialogClose>
					<Button onClick={handleSave}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function UpgradePlanDialog() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathName = usePathname();
	const id = searchParams.get('upgrade-plan');

	const [plan, setPlan] = useState<string>('remove');
	const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

	if (!id) return null;

	const handleUpgradePlan = () => {
		toast.promise(UpgradePlan(id, plan, date), {
			loading: 'Upgrading plan...',
			success: () => {
				router.replace(pathName);
				return 'Plan upgraded successfully';
			},
			error: 'Failed to upgrade plan',
		});
	};

	return (
		<Dialog
			open={true}
			onOpenChange={(value) => {
				if (!value) {
					router.replace(pathName);
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Upgrade plan</DialogTitle>
				</DialogHeader>
				<Select value={plan} onValueChange={(value) => setPlan(value)}>
					<SelectTrigger>
						<SelectValue placeholder='Select Plan' />
					</SelectTrigger>
					<SelectContent>
						<Each
							items={PLANS}
							render={(plan) => <SelectItem value={plan._id}>{plan.plan_name}</SelectItem>}
						/>
						<SelectItem value='remove'>Remove</SelectItem>
					</SelectContent>
				</Select>
				{plan !== 'remove' && (
					<>
						<p>Plan Expiry</p>
						<Input
							placeholder='Enter new expiry date'
							type='date'
							onChange={(e) => setDate(e.target.value)}
							min={new Date().toISOString().split('T')[0]}
							value={date}
						/>
					</>
				)}
				<DialogFooter>
					<DialogClose asChild>
						<Button variant={'destructive'}>Close</Button>
					</DialogClose>
					<Button onClick={handleUpgradePlan}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
