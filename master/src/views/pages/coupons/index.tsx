import { AddIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Checkbox,
	HStack,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useToast,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import useFilteredList from '../../../hooks/useFilteredList';
import CouponService from '../../../services/coupon.service';
import { StoreNames, StoreState } from '../../../store';
import {
	addCouponToList,
	addSelectedCouponId,
	removeCouponFromList,
	removeSelectedCouponId,
	setCouponSaving,
	updateCouponFromList,
} from '../../../store/reducers/CouponReducer';
import { Coupon } from '../../../store/types/CouponState';
import DeleteAlert, { DeleteAlertHandle } from '../../components/delete-alert';
import SearchBar from '../../components/searchBar';
import Each from '../../components/utils/Each';
import CouponInputDrawer, { CouponInputDrawerHandle } from './components/CouponInputDrawer';

export default function Coupons() {
	const dispatch = useDispatch();
	const toast = useToast();
	const couponInputDrawerRef = useRef<CouponInputDrawerHandle>(null);
	const deleteAlertDialogref = useRef<DeleteAlertHandle>(null);

	const {
		list,
		selectedCouponId,
		couponDetails: {
			couponCode,
			availableCoupon,
			couponPerUser,
			discountAmount,
			discountPercentage,
			discountType,
			totalCoupons,
			id,
		},
		uiDetails: { isFetching },
	} = useSelector((state: StoreState) => state[StoreNames.COUPON]);

	const { filtered, setSearchText } = useFilteredList(list, {
		couponCode: 1,
	});

	const handleCouponSelect = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
		if (e.target.checked) {
			dispatch(addSelectedCouponId(id));
		} else {
			dispatch(removeSelectedCouponId(id));
		}
	};

	const openCouponInputDrawer = (coupon: Coupon) => {
		couponInputDrawerRef.current?.onOpen(coupon);
	};

	const handleCouponDelete = () => {
		selectedCouponId.forEach(async (id) => {
			await CouponService.deleteCoupon(id).then((res) => {
				if (res) {
					dispatch(removeCouponFromList(id));
				}
			});
		});
	};

	const handleSave = () => {
		dispatch(setCouponSaving(true));
		const details = {
			code: couponCode,
			available_coupon: availableCoupon,
			count_per_user: couponPerUser,
			discount_amount: discountAmount,
			discount_percentage: discountPercentage,
			discount_type: discountType,
			total_coupons: totalCoupons,
		};
		if (id) {
			toast.promise(CouponService.updateCoupon(id, details), {
				loading: {
					title: 'Updating coupon',
				},
				success: (res) => {
					dispatch(setCouponSaving(false));
					if (!res) {
						return {
							title: 'Failed to update coupon',
							status: 'error',
						};
					}
					dispatch(updateCouponFromList(res));
					return {
						title: 'Coupon updated successfully',
						status: 'success',
					};
				},
				error: () => {
					dispatch(setCouponSaving(false));
					return {
						title: 'Failed to update coupon',
					};
				},
			});
		} else {
			toast.promise(CouponService.createCoupon(details), {
				loading: {
					title: 'Saving coupon',
				},
				success: (res) => {
					dispatch(setCouponSaving(false));
					if (!res) {
						return {
							title: 'Failed to save coupon',
							status: 'error',
						};
					}
					dispatch(addCouponToList(res));
					return {
						title: 'Coupon saved successfully',
						status: 'success',
					};
				},
				error: () => {
					dispatch(setCouponSaving(false));
					return {
						title: 'Failed to save coupon',
					};
				},
			});
		}
	};

	return (
		<>
			<Box width={'full'} p={'1rem'}>
				<HStack justifyContent={'space-between'}>
					<Text fontSize={'xl'} fontWeight={'bold'}>
						Coupons
					</Text>
					<HStack>
						<Button
							colorScheme='red'
							onClick={() => deleteAlertDialogref.current?.open()}
							leftIcon={<FaTrash />}
							isDisabled={selectedCouponId.length === 0}
						>
							Delete
						</Button>
						<Button
							colorScheme='green'
							onClick={() => {
								couponInputDrawerRef.current?.onOpen({
									id: '',
									couponCode: '',
									availableCoupon: 0,
									couponPerUser: 0,
									discountAmount: 0,
									discountPercentage: 0,
									discountType: 'amount',
									totalCoupons: 0,
								});
							}}
							leftIcon={<AddIcon />}
						>
							Add
						</Button>
					</HStack>
				</HStack>
				<Box py={'1rem'}>
					<SearchBar onSearchTextChanged={setSearchText} />
				</Box>
				<TableContainer rounded={'2xl'} borderStyle={'dashed'} borderWidth={'2px'}>
					<Table variant={'striped'}>
						<Thead>
							<Tr>
								<Th width={'10%'}>Sl. no.</Th>
								<Th width={'30%'}>Code</Th>
								<Th width={'30%'}>Available coupon</Th>
								<Th width={'30%'}>Total Coupon</Th>
							</Tr>
						</Thead>
						<Tbody>
							{isFetching ? (
								<Tr>
									<Td colSpan={5}>
										<Box width={'full'} p={'1rem'}>
											<Text fontSize={'xl'} fontWeight={'bold'}>
												Loading...
											</Text>
										</Box>
									</Td>
								</Tr>
							) : !filtered.length ? (
								<Tr>
									<Td colSpan={5}>
										<Box width={'full'} p={'1rem'}>
											<Text fontSize={'xl'} fontWeight={'bold'}>
												No admins found
											</Text>
										</Box>
									</Td>
								</Tr>
							) : (
								<Each
									items={filtered}
									render={(coupon, index) => (
										<Tr>
											<Td>
												<Checkbox
													isChecked={selectedCouponId.includes(coupon.id)}
													onChange={(e) => handleCouponSelect(e, coupon.id)}
													mr={'1rem'}
												/>
												{index + 1}
											</Td>
											<Td cursor={'pointer'} onClick={() => openCouponInputDrawer(coupon)}>
												{coupon.couponCode}
											</Td>
											<Td cursor={'pointer'} onClick={() => openCouponInputDrawer(coupon)}>
												{coupon.availableCoupon}
											</Td>
											<Td cursor={'pointer'} onClick={() => openCouponInputDrawer(coupon)}>
												{coupon.totalCoupons}
											</Td>
										</Tr>
									)}
								/>
							)}
						</Tbody>
					</Table>
				</TableContainer>
			</Box>
			<CouponInputDrawer onConfirm={handleSave} ref={couponInputDrawerRef} />
			<DeleteAlert ref={deleteAlertDialogref} onConfirm={handleCouponDelete} type={'coupon'} />
		</>
	);
}
