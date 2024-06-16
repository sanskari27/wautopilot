import { Box, useBoolean } from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useOutlet } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import AuthService from '../../../services/auth.service';
import DeviceService from '../../../services/device.service';
import MediaService from '../../../services/media.service';
import MessagesService from '../../../services/messages.service';
import TemplateService from '../../../services/template.service';
import { StoreNames, StoreState } from '../../../store';
import {
	setDevicesList,
	startDeviceLoading,
	stopDeviceLoading,
} from '../../../store/reducers/DevicesReducers';
import { setMediaFetching, setMediaList } from '../../../store/reducers/MediaReducer';
import { setRecipientsList, setRecipientsLoading } from '../../../store/reducers/RecipientReducer';
import { setTemplateFetching, setTemplatesList } from '../../../store/reducers/TemplateReducer';
import {
	setIsAuthenticated,
	setSelectedDeviceId,
	setUserDetails,
} from '../../../store/reducers/UserReducers';
import AppNavbar from '../../components/navbar/AppNavbar';
import NavigationDrawer from '../../components/navbar/NavigationDrawer';

const AppPage = () => {
	const outlet = useOutlet();

	const dispatch = useDispatch();

	const [authLoaded, setAuthLoaded] = useBoolean(false);

	const [expanded, setDrawerExpanded] = useBoolean(false);

	const { isAuthenticated, selected_device_id } = useSelector(
		(state: StoreState) => state[StoreNames.USER]
	);

	const fetchUserDetails = useCallback(async () => {
		try {
			dispatch(setRecipientsLoading(false));
			dispatch(setMediaFetching(false));
			dispatch(setTemplateFetching(false));

			const promises = [
				MessagesService.fetchAllConversation(selected_device_id),
				MediaService.getMedias(selected_device_id),
				TemplateService.listTemplates(selected_device_id),
				AuthService.userDetails(),
			];

			const results = await Promise.all(promises);

			dispatch(setRecipientsList(results[0]));
			dispatch(setMediaList(results[1]));
			dispatch(setTemplatesList(results[2]));
			dispatch(setUserDetails(results[3]));
		} catch (e) {
			return;
		}
		dispatch(setMediaFetching(false));
		dispatch(setTemplateFetching(false));
		dispatch(setRecipientsLoading(false));
	}, [dispatch, selected_device_id]);

	useEffect(() => {
		AuthService.isAuthenticated().then((res) => {
			dispatch(setIsAuthenticated(res));
			setAuthLoaded.on();
		});
	}, [dispatch, setAuthLoaded]);

	useEffect(() => {
		dispatch(startDeviceLoading());
		DeviceService.listDevices()
			.then((devices) => {
				dispatch(setDevicesList(devices));
				// setDevices(devices);
				if (devices.length > 0) {
					dispatch(setSelectedDeviceId(devices[0].id ?? '')); // TODO
					// dispatch(setSelectedDevice(devices[0]));
				}
			})
			.finally(() => dispatch(stopDeviceLoading()));
		if (!selected_device_id) {
			return;
		}

		fetchUserDetails();
	}, [dispatch, fetchUserDetails, selected_device_id]);

	if (!authLoaded) return null;

	if (!isAuthenticated) return <Navigate to={`${NAVIGATION.AUTH}/${NAVIGATION.LOGIN}`} />;

	if (!outlet) return <Navigate to={`${NAVIGATION.APP}/${NAVIGATION.PHONEBOOK}`} />;

	return (
		<Box width={'full'}>
			<AppNavbar expanded={expanded} setDrawerExpanded={setDrawerExpanded} />
			<NavigationDrawer expanded={expanded} setDrawerExpanded={setDrawerExpanded} />
			<Box
				className='ml-0 md:ml-[70px] overflow-y-auto overflow-x-hidden'
				height={'calc(100vh - 50px)'}
			>
				{outlet}
			</Box>
		</Box>
	);
};

export default AppPage;
