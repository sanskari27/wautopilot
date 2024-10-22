'use client';

import DeleteDialog from '@/components/elements/dialogs/delete';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { deleteCoupon } from '../action';

export default function CouponContextMenu({
	children,
	coupon,
}: {
	children: React.ReactNode;
	coupon: {
		id: string;
		couponCode: string;
		availableCoupon: string;
		couponPerUser: string;
		discountAmount: string;
		discountPercentage: string;
		totalCoupons: string;
		discountType: string;
	};
}) {
	const handleDeleteCoupon = () => {
		toast.promise(deleteCoupon(coupon.id), {
			loading: 'Deleting coupon...',
			success: 'Coupon deleted successfully',
			error: 'Failed to delete coupon',
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent>
				<Link className='w-full' href={`?coupon=${coupon.id}&data=${JSON.stringify(coupon)}`}>
					<DropdownMenuItem>Edit</DropdownMenuItem>
				</Link>
				<DeleteDialog onDelete={handleDeleteCoupon} action='Coupon'>
					<Button variant={'destructive'} size={'sm'} className='w-full'>
						<span className='mr-auto'>Delete</span>
					</Button>
				</DeleteDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
