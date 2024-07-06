import { ChevronDownIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useBoolean,
	useToast,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ADMIN_URL, AUTH_URL } from '../../../config/const';
import useFilteredList from '../../../hooks/useFilteredList';
import AdminsService from '../../../services/admin.service';
import AuthService from '../../../services/auth.service';
import { StoreNames, StoreState } from '../../../store';
import { setAdminMarkup } from '../../../store/reducers/AdminReducer';
import { setIsAuthenticated } from '../../../store/reducers/UserReducers';
import { Admin } from '../../../store/types/AdminState';
import ExtendExpiryModal, { ExtendExpiryModalHandle } from '../../components/extend-expiry';
import MarkUpDialog, { MarkUpDialogHandle } from '../../components/markup-price-dialog';
import SearchBar from '../../components/searchBar';
import UpgradePlanDialog, { UpgradePlanDialogHandle } from '../../components/upgrade-plan';
import Each from '../../components/utils/Each';

export default function AdminPage() {
	const dispatch = useDispatch();

	const [authLoaded, setAuthLoaded] = useBoolean(false);

	const { admins, loading } = useSelector((state: StoreState) => state[StoreNames.ADMIN]);
	const { isAuthenticated } = useSelector((state: StoreState) => state[StoreNames.USER]);

	const { filtered, setSearchText } = useFilteredList(admins, {
		phone: 1,
	});

	useEffect(() => {
		AuthService.isAuthenticated().then((res) => {
			dispatch(setIsAuthenticated(res));
			setAuthLoaded.on();
		});
	}, [dispatch, setAuthLoaded]);

	if (!authLoaded) return <></>;

	if (!isAuthenticated) {
		window.location.href = `${AUTH_URL}auth/master/login?callback_url=${window.location.href}`;
		return <></>;
	}

	// if (!outlet) return <Navigate to={`${NAVIGATION.APP}/${NAVIGATION.PHONEBOOK}`} />;

	const formatExpiry = (expiry: string) => {
		const date = new Date(expiry);
		return date.toLocaleDateString();
	};

	return (
		<Box width={'full'} p={'1rem'}>
			<Text fontSize={'xl'} fontWeight={'bold'}>
				Admins
			</Text>
			<Box py={'1rem'}>
				<SearchBar onSearchTextChanged={setSearchText} />
			</Box>
			<TableContainer rounded={'2xl'} borderStyle={'dashed'} borderWidth={'2px'}>
				<Table variant={'striped'}>
					<Thead>
						<Tr>
							<Th width={'10%'}>Sl. no.</Th>
							<Th width={'30%'}>Name</Th>
							<Th width={'10%'}>Phone no.</Th>
							<Th width={'20%'}>email</Th>
							<Th width={'10%'}>Expiry</Th>
							<Th width={'20%'}>Actions</Th>
						</Tr>
					</Thead>
					<Tbody>
						{loading ? (
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
								render={(admin, index) => (
									<Tr>
										<Td>{index + 1}</Td>
										<Td>{admin.name}</Td>
										<Td>{admin.phone}</Td>
										<Td>{admin.email}</Td>
										<Td>{admin.isSubscribed ? formatExpiry(admin.subscription_expiry) : 'N/A'}</Td>
										<Td>
											<AdminContextMenu admin={admin} />
										</Td>
									</Tr>
								)}
							/>
						)}
					</Tbody>
				</Table>
			</TableContainer>
		</Box>
	);
}

type AdminContextMenuProps = {
	admin: Admin;
};

const AdminContextMenu = ({ admin }: AdminContextMenuProps) => {
	const toast = useToast();

	const dispatch = useDispatch();

	const extendExpiryRef = useRef<ExtendExpiryModalHandle>(null);
	const upgradePlanRef = useRef<UpgradePlanDialogHandle>(null);
	const markupPriceDialog = useRef<MarkUpDialogHandle>(null);

	const openServiceAccount = async () => {
		const status = await AuthService.serviceAccount(admin.id);
		if (status) {
			window.location.href = ADMIN_URL;
		} else {
			toast({
				title: 'Unable to switch account.',
				description: 'Please try again later.',
				status: 'error',
			});
		}
	};

	const openMarkupPriceDialog = () => {
		markupPriceDialog.current?.open(admin.name, admin.markup);
	};

	const handleMarkupPriceChange = async (rate: number) => {
		const status = await AdminsService.setMarkUpPrice(admin.id, rate);
		if (status) {
			toast({
				title: 'Markup price updated successfully',
				status: 'success',
			});
			dispatch(setAdminMarkup({ id: admin.id, rate }));
		} else {
			toast({
				title: 'Unable to update markup price',
				description: 'Please try again later.',
				status: 'error',
			});
		}
	};

	return (
		<>
			<Menu>
				<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
					Select Action
				</MenuButton>
				<MenuList>
					{admin.isSubscribed && (
						<MenuItem onClick={() => extendExpiryRef.current?.open(admin)}>
							Extend Subscription
						</MenuItem>
					)}
					<MenuItem onClick={() => upgradePlanRef.current?.open(admin)}>Upgrade Plan</MenuItem>
					<MenuItem onClick={openMarkupPriceDialog}>Set Markup Price</MenuItem>
					<MenuItem onClick={openServiceAccount}>Service Account</MenuItem>
				</MenuList>
			</Menu>
			<ExtendExpiryModal ref={extendExpiryRef} />
			<UpgradePlanDialog ref={upgradePlanRef} />
			<MarkUpDialog onConfirm={handleMarkupPriceChange} ref={markupPriceDialog} />
		</>
	);
};
