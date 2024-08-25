'use client';

import Show from '@/components/containers/show';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { parseToObject } from '@/lib/utils';
import { Coupon, couponSchema } from '@/schema/coupon';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { createCoupon, editCoupon } from '../action';

const DEFAULT_VALUE: Coupon = {
	id: '',
	couponCode: '',
	availableCoupon: '0',
	couponPerUser: '0',
	discountAmount: '0',
	discountPercentage: '0',
	discountType: 'percentage',
	totalCoupons: '0',
};

export function EditCouponDialog() {
	const searchParams = useSearchParams();
	const pathName = usePathname();
	const router = useRouter();
	const id = searchParams.get('coupon');
	const res = couponSchema.safeParse(parseToObject(searchParams.get('data')));
	const data = res.success ? res.data : DEFAULT_VALUE;

	const onClose = () => {
		router.replace(pathName);
	};

	const onSubmit = (data: z.infer<typeof couponSchema>) => {
		const promise = data.id
			? editCoupon(data.id, {
					code: data.couponCode,
					total_coupons: parseInt(data.totalCoupons),
					discount_type: data.discountType,
					discount_amount: parseInt(data.discountAmount),
					discount_percentage: parseInt(data.discountPercentage),
					count_per_user: parseInt(data.couponPerUser),
			  })
			: createCoupon({
					code: data.couponCode,
					total_coupons: parseInt(data.totalCoupons),
					discount_type: data.discountType,
					discount_amount: parseInt(data.discountAmount),
					discount_percentage: parseInt(data.discountPercentage),
					count_per_user: parseInt(data.couponPerUser),
			  });
		toast.promise(promise, {
			loading: 'Saving coupon...',
			success: () => {
				router.replace(pathName);
				router.refresh();
				return 'Coupon saved successfully';
			},
			error: (err) => {
				return 'Failed to save coupon';
			},
		});
	};

	if (!id) {
		return null;
	}

	return <CouponDetails onSubmit={onSubmit} onClose={onClose} id={id} data={data} />;
}

export function CouponDetails({
	data,
	onClose,
	onSubmit,
}: {
	onSubmit: (data: z.infer<typeof couponSchema>) => void;
	onClose: () => void;
	id: string;
	data: Coupon;
}) {
	const form = useForm<z.infer<typeof couponSchema>>({
		resolver: zodResolver(couponSchema),
		defaultValues: data,
		mode: 'onChange',
	});

	return (
		<Dialog
			open={true}
			onOpenChange={(value) => {
				if (!value) {
					onClose();
				}
			}}
		>
			<DialogContent>
				<DialogHeader>Coupon Details</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							name='couponCode'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Coupon Code</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name='totalCoupons'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Total Coupons</FormLabel>
									<FormControl>
										<Input type='number' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name='couponPerUser'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Coupon per user</FormLabel>
									<FormControl>
										<Input type='number' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name='discountType'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Discount Type</FormLabel>
									<FormControl>
										<Select value={field.value} onValueChange={(value) => field.onChange(value)}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='amount'>Amount</SelectItem>
												<SelectItem value='percentage'>Percentage</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='mt-2'>
							<Show>
								<Show.When condition={form.getValues('discountType') === 'amount'}>
									<FormField
										name='discountAmount'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Discount Amount</FormLabel>
												<FormControl>
													<Input type='number' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</Show.When>
								<Show.Else>
									<FormField
										name='discountPercentage'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Discount Percentage</FormLabel>
												<FormControl>
													<Input type='number' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</Show.Else>
							</Show>
						</div>
						<DialogFooter className='mt-4'>
							<DialogClose asChild>
								<Button variant={'destructive'}>Close</Button>
							</DialogClose>
							<Button disabled={!form.formState.isValid || !form.formState.isDirty}>Save</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
