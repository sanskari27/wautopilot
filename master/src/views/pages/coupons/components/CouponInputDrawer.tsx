import {
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	FormControl,
	FormLabel,
	Input,
	Select,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';
import {
	setCouponCode,
	setCouponPerUser,
	setDiscountAmount,
	setDiscountPercentage,
	setDiscountType,
	setError,
	setSelectedCoupon,
	setTotalCoupons,
} from '../../../../store/reducers/CouponReducer';
import { Coupon } from '../../../../store/types/CouponState';

export type CouponInputDrawerHandle = {
	onOpen: (coupon: Coupon) => void;
	onClose: () => void;
};

const CouponInputDrawer = forwardRef(({ onConfirm }: { onConfirm: () => void }, ref) => {
	const dispatch = useDispatch();

	const [isOpen, setIsOpen] = useState(false);

	const {
		couponDetails: {
			couponCode,
			couponPerUser,
			discountAmount,
			discountPercentage,
			discountType,
			id,
			totalCoupons,
		},
		uiDetails: { error, isSaving },
	} = useSelector((state: StoreState) => state[StoreNames.COUPON]);

	useImperativeHandle(ref, () => ({
		onOpen: (coupon: Coupon) => {
			if (coupon.id) {
				dispatch(setSelectedCoupon(coupon));
			}
			setIsOpen(true);
		},
		onClose: () => {
			handleClose();
		},
	}));

	const handleClose = () => {
		dispatch(
			setSelectedCoupon({
				id: '',
				couponCode: '',
				availableCoupon: 0,
				couponPerUser: 0,
				discountAmount: 0,
				discountPercentage: 0,
				discountType: 'amount',
				totalCoupons: 0,
			})
		);
		setIsOpen(false);
	};

	const handleOnConfirm = () => {
		if (!couponCode) {
			dispatch(
				setError({
					type: 'COUPON_CODE',
					message: 'Coupon code is required',
				})
			);
			return;
		}
		if (couponPerUser <= 0) {
			dispatch(
				setError({
					type: 'COUPON_PER_USER',
					message: 'Coupon per user is required',
				})
			);
			return;
		}
		if (totalCoupons <= 0) {
			dispatch(
				setError({
					type: 'TOTAL_COUPONS',
					message: 'Total coupons is required',
				})
			);
			return;
		}
		if (discountType === 'amount' && discountAmount <= 0) {
			dispatch(
				setError({
					type: 'DISCOUNT_AMOUNT',
					message: 'Discount amount is required',
				})
			);
			return;
		}
		if (discountType === 'percentage' && discountPercentage <= 0) {
			dispatch(
				setError({
					type: 'DISCOUNT_PERCENTAGE',
					message: 'Discount percentage is required',
				})
			);
			return;
		}
		dispatch(
			setError({
				type: '',
				message: '',
			})
		);
		onConfirm();
		handleClose();
	};

	return (
		<Drawer isOpen={isOpen} size={'lg'} placement={'right'} onClose={handleClose}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>Create Coupon</DrawerHeader>
				<DrawerBody>
					<FormControl mt={'0.5rem'} isInvalid={error.type === 'COUPON_CODE'}>
						<FormLabel mb={0}>Coupon Code</FormLabel>
						<Input
							type={'text'}
							value={couponCode}
							onChange={(e) => dispatch(setCouponCode(e.target.value))}
							placeholder='Enter coupon code'
						/>
					</FormControl>
					<FormControl mt={'0.5rem'} isInvalid={error.type === 'TOTAL_COUPONS'}>
						<FormLabel mb={0}>Total Coupon</FormLabel>
						<Input
							type={'number'}
							value={totalCoupons.toString()}
							onChange={(e) => dispatch(setTotalCoupons(e.target.value))}
						/>
					</FormControl>
					<FormControl mt={'0.5rem'} isInvalid={error.type === 'COUPON_PER_USER'}>
						<FormLabel mb={0}>Count Per User</FormLabel>
						<Input
							type={'number'}
							value={couponPerUser.toString()}
							onChange={(e) => dispatch(setCouponPerUser(e.target.value))}
						/>
					</FormControl>
					<FormControl mt={'0.5rem'} isInvalid={error.type === 'DISCOUNT_TYPE'}>
						<FormLabel mb={0}>Discount Type</FormLabel>
						<Select
							value={discountType}
							onChange={(e) => dispatch(setDiscountType(e.target.value as 'amount' | 'percentage'))}
						>
							<option value={'amount'}>Amount</option>
							<option value={'percentage'}>Percentage</option>
						</Select>
					</FormControl>
					{discountType === 'amount' ? (
						<FormControl mt={'0.5rem'} isInvalid={error.type === 'DISCOUNT_AMOUNT'}>
							<FormLabel mb={0}>Discount Amount</FormLabel>
							<Input
								type={'number'}
								value={discountAmount.toString()}
								onChange={(e) => dispatch(setDiscountAmount(e.target.value))}
							/>
						</FormControl>
					) : (
						<FormControl mt={'0.5rem'} isInvalid={error.type === 'DISCOUNT_PERCENTAGE'}>
							<FormLabel mb={0}>Discount Percentage</FormLabel>
							<Input
								type={'number'}
								value={discountPercentage.toString()}
								onChange={(e) => dispatch(setDiscountPercentage(e.target.value))}
							/>
						</FormControl>
					)}
				</DrawerBody>
				<DrawerFooter>
					<Button variant={'outline'} mr={3} onClick={handleClose}>
						Cancel
					</Button>
					<Button colorScheme={'green'} onClick={handleOnConfirm} isLoading={isSaving}>
						{id ? 'Update' : 'Create'}
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
});

export default CouponInputDrawer;
