import Each from '@/components/containers/each';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import CouponService from '@/services/coupon.service';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import CouponContextMenu from './_components/contextMenu';
import { EditCouponDialog } from './_components/dialogs';

export default async function Coupons() {
	const list = await CouponService.listCoupons();

	// const handleCouponSelect = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
	// 	if (e.target.checked) {
	// 		dispatch(addSelectedCouponId(id));
	// 	} else {
	// 		dispatch(removeSelectedCouponId(id));
	// 	}
	// };

	// const openCouponInputDrawer = (coupon: Coupon) => {
	// 	couponInputDrawerRef.current?.onOpen(coupon);
	// };

	// const handleCouponDelete = () => {
	// 	selectedCouponId.forEach(async (id) => {
	// 		await CouponService.deleteCoupon(id).then((res) => {
	// 			if (res) {
	// 				dispatch(removeCouponFromList(id));
	// 			}
	// 		});
	// 	});
	// };

	// const handleSave = () => {
	// 	dispatch(setCouponSaving(true));
	// 	const details = {
	// 		code: couponCode,
	// 		count_per_user: couponPerUser,
	// 		discount_amount: discountAmount,
	// 		discount_percentage: discountPercentage,
	// 		discount_type: discountType,
	// 		total_coupons: totalCoupons,
	// 	};
	// 	if (id) {
	// 		toast.promise(CouponService.updateCoupon(id, details), {
	// 			loading: {
	// 				title: 'Updating coupon',
	// 			},
	// 			success: (res) => {
	// 				dispatch(setCouponSaving(false));
	// 				if (!res) {
	// 					return {
	// 						title: 'Failed to update coupon',
	// 						status: 'error',
	// 					};
	// 				}
	// 				dispatch(updateCouponFromList(res));
	// 				return {
	// 					title: 'Coupon updated successfully',
	// 					status: 'success',
	// 				};
	// 			},
	// 			error: () => {
	// 				dispatch(setCouponSaving(false));
	// 				return {
	// 					title: 'Failed to update coupon',
	// 				};
	// 			},
	// 		});
	// 	} else {
	// 		toast.promise(CouponService.createCoupon(details), {
	// 			loading: {
	// 				title: 'Saving coupon',
	// 			},
	// 			success: (res) => {
	// 				dispatch(setCouponSaving(false));
	// 				if (!res) {
	// 					return {
	// 						title: 'Failed to save coupon',
	// 						status: 'error',
	// 					};
	// 				}
	// 				dispatch(addCouponToList(res));
	// 				return {
	// 					title: 'Coupon saved successfully',
	// 					status: 'success',
	// 				};
	// 			},
	// 			error: () => {
	// 				dispatch(setCouponSaving(false));
	// 				return {
	// 					title: 'Failed to save coupon',
	// 				};
	// 			},
	// 		});
	// 	}
	// };

	return (
		<>
			<div className='w-full p-4'>
				<div className='flex gap-2 mb-4 justify-between'>
					<p className='text-xl font-bold'>Coupons</p>
					<Link href='?coupon=new'>
						<Button>
							<Plus size={20} />
							Add
						</Button>
					</Link>
				</div>
				{/* <Box py={'1rem'}>
					<SearchBar onSearchTextChanged={setSearchText} />
				</Box> */}
				<Table className='border-dashed border-2 rounded-xl'>
					<TableHeader>
						<TableRow>
							<TableHead>Sl. no.</TableHead>
							<TableHead>Code</TableHead>
							<TableHead className='text-right'>Available coupon</TableHead>
							<TableHead className='text-right'>Total Coupon</TableHead>
							<TableHead className='text-center'>Total Coupon</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<Each
							items={list}
							render={(coupon, index) => (
								<TableRow>
									<TableCell>{index + 1}</TableCell>
									<TableCell>{coupon.couponCode}</TableCell>
									<TableCell className='text-right'>{coupon.availableCoupon}</TableCell>
									<TableCell className='text-right'>{coupon.totalCoupons}</TableCell>
									<TableCell className='text-center'>
										<CouponContextMenu coupon={coupon}>
											<Button size='sm' variant={'outline'}>
												Action
											</Button>
										</CouponContextMenu>
									</TableCell>
								</TableRow>
							)}
						/>
					</TableBody>
				</Table>
			</div>
			<EditCouponDialog />
		</>
	);
}
