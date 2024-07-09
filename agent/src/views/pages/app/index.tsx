import { Box, useBoolean } from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useOutlet } from 'react-router-dom';
import APIInstance from '../../../config/APIInstance';
import { AUTH_URL, NAVIGATION } from '../../../config/const';
import AgentService from '../../../services/agent.service';
import AuthService from '../../../services/auth.service';
import ChatbotFlowService from '../../../services/chatbot-flow.service';
import ChatBotService from '../../../services/chatbot.service';
import { DashboardService } from '../../../services/dashboard.service';
import DeviceService from '../../../services/device.service';
import MediaService from '../../../services/media.service';
import MessagesService from '../../../services/messages.service';
import RecurringService from '../../../services/recurring.service';
import TemplateService from '../../../services/template.service';
import { StoreNames, StoreState } from '../../../store';
import { setAgentList } from '../../../store/reducers/AgentReducer';
import { setChatBotList, setChatbotLoading } from '../../../store/reducers/ChatBotReducer';
import { setChatbotFlow, setLoading } from '../../../store/reducers/ChatbotFlowReducer';
import { setContactList } from '../../../store/reducers/ContactReducer';
import { setDashboardList } from '../../../store/reducers/DashboardReducer';
import {
	setDevicesList,
	startDeviceLoading,
	stopDeviceLoading,
} from '../../../store/reducers/DevicesReducers';
import { setMediaFetching, setMediaList } from '../../../store/reducers/MediaReducer';
import { setRecipientsList, setRecipientsLoading } from '../../../store/reducers/RecipientReducer';
import { setRecurringList } from '../../../store/reducers/RecurringReducer';
import { setTemplateFetching, setTemplatesList } from '../../../store/reducers/TemplateReducer';
import {
	setIsAuthenticated,
	setSelectedDeviceId,
	setUserDetails,
} from '../../../store/reducers/UserReducers';
import { Contact } from '../../../store/types/ContactState';
import AppNavbar from '../../components/navbar/AppNavbar';
import NavigationDrawer from '../../components/navbar/NavigationDrawer';
import { setQuickReplyList } from '../../../store/reducers/MessagesReducers';

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
			if (res) {
				AuthService.userDetails().then((user) => {
					if (user) {
						dispatch(setUserDetails(user));
					}
					dispatch(setIsAuthenticated(res));
					setAuthLoaded.on();
				});
			} else {
				dispatch(setIsAuthenticated(res));
				setAuthLoaded.on();
			}
		});
	}, [dispatch, setAuthLoaded]);

	const fetchUserDetails = useCallback(async () => {
		try {
			const promises = [
				APIInstance.get(`/contacts`),
				AgentService.getAgent(),
				MessagesService.fetchQuickReplies(),
			];

			const results = await Promise.all(promises);
			dispatch(setContactList(results[0].data.contacts as Contact[]));
			dispatch(setAgentList(results[1]));
			dispatch(setQuickReplyList(results[2]));
		} catch (e) {
			return;
		}
	}, [dispatch]);

	const fetchDeviceBasedUserDetails = useCallback(
		async (selected_device_id: string) => {
			if (!selected_device_id) return;
			try {
				dispatch(setRecipientsLoading(false));
				dispatch(setMediaFetching(false));
				dispatch(setTemplateFetching(false));

				const promises = [
					MessagesService.fetchAllConversation(selected_device_id),
					MediaService.getMedias(selected_device_id),
					TemplateService.listTemplates(selected_device_id),
					ChatBotService.listChatBots({ deviceId: selected_device_id }),
					DashboardService.getDashboardData(selected_device_id),
					ChatbotFlowService.listChatBots({ deviceId: selected_device_id }),
					RecurringService.getRecurringList({ deviceId: selected_device_id }),
					AgentService.getAgent(),
				];

				const results = await Promise.all(promises);
				dispatch(setRecipientsList(results[0]));
				dispatch(setMediaList(results[1]));
				dispatch(setTemplatesList(results[2]));
				dispatch(setChatBotList(results[3]));
				dispatch(setDashboardList(results[4]));
				dispatch(setChatbotFlow(results[5]));
				dispatch(setRecurringList(results[6]));
				dispatch(setAgentList(results[7]));
			} catch (e) {
				return;
			}
			dispatch(setMediaFetching(false));
			dispatch(setTemplateFetching(false));
			dispatch(setRecipientsLoading(false));
			dispatch(setLoading(false));
			dispatch(setChatbotLoading(false));
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
			.finally(() => {
				dispatch(stopDeviceLoading());
			});
		fetchUserDetails();
		fetchDeviceBasedUserDetails(selected_device_id);
	}, [dispatch, fetchDeviceBasedUserDetails, fetchUserDetails, selected_device_id]);

	if (!authLoaded) return <></>;

	if (!isAuthenticated) {
		window.location.replace(`${AUTH_URL}auth/agent/login?callback_url=${window.location.href}`);
		return <></>;
	}

	if (!outlet) return <Navigate to={`${NAVIGATION.APP}/${NAVIGATION.DASHBOARD}`} />;

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
