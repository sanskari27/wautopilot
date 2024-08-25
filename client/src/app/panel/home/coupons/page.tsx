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
import { notFound } from 'next/navigation';
import CouponContextMenu from './_components/contextMenu';
import { EditCouponDialog } from './_components/dialogs';

export default async function Coupons() {
	const list = await CouponService.listCoupons();

	if (!list) {
		return notFound();
	}

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
				<div className='border border-dashed border-gray-700 rounded-2xl overflow-hidden'>
					<Table>
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
			</div>
			<EditCouponDialog />
		</>
	);
}
