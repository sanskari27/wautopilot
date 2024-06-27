import { Box, useBoolean } from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useOutlet } from 'react-router-dom';
import APIInstance from '../../../config/APIInstance';
import { AUTH_URL, NAVIGATION } from '../../../config/const';
import AuthService from '../../../services/auth.service';
import ChatBotService from '../../../services/chatbot.service';
import DeviceService from '../../../services/device.service';
import MediaService from '../../../services/media.service';
import MessagesService from '../../../services/messages.service';
import TemplateService from '../../../services/template.service';
import { StoreNames, StoreState } from '../../../store';
import { setChatBotList } from '../../../store/reducers/ChatBotReducer';
import { setContactList } from '../../../store/reducers/ContactReducer';
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
import { Contact } from '../../../store/types/ContactState';
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

	useEffect(() => {
		AuthService.isAuthenticated().then((res) => {
			dispatch(setIsAuthenticated(res));
			setAuthLoaded.on();
		});
	}, [dispatch, setAuthLoaded]);

	const fetchUserDetails = useCallback(
		async (selected_device_id: string) => {
			try {
				dispatch(setRecipientsLoading(false));
				dispatch(setMediaFetching(false));
				dispatch(setTemplateFetching(false));
				AuthService.userDetails().then((user) => user && dispatch(setUserDetails(user)));

				const promises = [
					MessagesService.fetchAllConversation(selected_device_id),
					MediaService.getMedias(selected_device_id),
					TemplateService.listTemplates(selected_device_id),
					APIInstance.get(`/contacts`),
					ChatBotService.listChatBots({ deviceId: selected_device_id }),
				];

				const results = await Promise.all(promises);
				dispatch(setRecipientsList(results[0]));
				dispatch(setMediaList(results[1]));
				dispatch(setTemplatesList(results[2]));
				dispatch(setContactList(results[3].data.contacts as Contact[]));
				dispatch(setChatBotList(results[4]));
			} catch (e) {
				return;
			}
			dispatch(setMediaFetching(false));
			dispatch(setTemplateFetching(false));
			dispatch(setRecipientsLoading(false));
		},
		[dispatch]
	);

	useEffect(() => {
		dispatch(startDeviceLoading());
		DeviceService.listDevices()
			.then((devices) => {
				dispatch(setDevicesList(devices));
				if (devices.length > 0) {
					const selectedDevice = localStorage.getItem('selected_device_id') ?? '';
					const isValidSelectedDevice =
						devices.findIndex((device) => device.id === selectedDevice) !== -1;
					dispatch(
						setSelectedDeviceId(isValidSelectedDevice ? selectedDevice : devices[0].id ?? '')
					);
				}
			})
			.finally(() => dispatch(stopDeviceLoading()));

		fetchUserDetails(selected_device_id);
	}, [dispatch, fetchUserDetails, selected_device_id]);

	if (!authLoaded) return <></>;

	if (!isAuthenticated) {
		window.location.replace(`${AUTH_URL}auth/login?callback_url=${window.location.href}`);
		return <></>;
	}

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
