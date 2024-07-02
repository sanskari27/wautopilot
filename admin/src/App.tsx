import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { NAVIGATION } from './config/const';

import { Flex, Progress } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useFetchLabels } from './hooks/useFetchLabels';
import useFilterLabels from './hooks/useFilterLabels';
import AuthService from './services/auth.service';
import { setIsAuthenticated } from './store/reducers/UserReducers';

const BroadcastReport = lazy(() => import('./views/pages/broadcast-report'));
const AppPage = lazy(() => import('./views/pages/app'));
const Conversation = lazy(() => import('./views/pages/conversation'));
const ContactPage = lazy(() => import('./views/pages/contacts'));
const Broadcast = lazy(() => import('./views/pages/broadcast'));
const Dashboard = lazy(() => import('./views/pages/dashboard'));
const Templates = lazy(() => import('./views/pages/templates'));
const EditTemplate = lazy(() => import('./views/pages/templates/edit-template'));
const Phonebook = lazy(() => import('./views/pages/phonebook'));
const MediaPage = lazy(() => import('./views/pages/media'));
const AddMedia = lazy(() => import('./views/pages/media/add-media'));
const ChatBot = lazy(() => import('./views/pages/chatbot'));
const CreateChatBot = lazy(() => import('./views/pages/chatbot/components/CreateChatbot'));
const ChatbotFlow = lazy(() => import('./views/pages/chatbot-flow'));
const RenderFlow = lazy(() => import('./views/pages/chatbot-flow/components/RenderFlow'));

function App() {
	const dispatch = useDispatch();
	useFilterLabels();
	useFetchLabels();

	useEffect(() => {
		AuthService.isAuthenticated().then((res) => {
			dispatch(setIsAuthenticated(res));
		});
	}, [dispatch]);

	return (
		<Flex minHeight={'100vh'} width={'100vw'} className='bg-background '>
			<Router>
				<Suspense fallback={<Loading />}>
					<Routes>
						<Route path={NAVIGATION.APP} element={<AppPage />}>
							<Route path={NAVIGATION.PHONEBOOK} element={<Phonebook />} />
							<Route
								path={NAVIGATION.TEMPLATES + '/' + NAVIGATION.ADD_TEMPLATE}
								element={<EditTemplate />}
							/>
							<Route
								path={NAVIGATION.TEMPLATES + '/' + NAVIGATION.EDIT_TEMPLATE + '/:id'}
								element={<EditTemplate />}
							/>
							<Route path={NAVIGATION.MEDIA} element={<MediaPage />}>
								<Route path={'new'} element={<AddMedia />} />
							</Route>
							<Route path={NAVIGATION.TEMPLATES} element={<Templates />} />
							<Route path={NAVIGATION.BROADCAST} element={<Broadcast />} />
							<Route path={NAVIGATION.BROADCAST_REPORT} element={<BroadcastReport />} />
							<Route path={NAVIGATION.CONTACT} element={<ContactPage />} />
							<Route path={NAVIGATION.INBOX} element={<Conversation />} />
							<Route path={NAVIGATION.CHATBOT} element={<ChatBot />}>
								<Route path={':id'} element={<CreateChatBot />} />
								<Route path={'new'} element={<CreateChatBot />} />
							</Route>
							<Route path={NAVIGATION.CHATBOT_FLOW} element={<ChatbotFlow />}>
								<Route path={'new'} element={<RenderFlow />} />
							</Route>
							<Route path={NAVIGATION.DASHBOARD} element={<Dashboard />} />
						</Route>
						<Route
							path='*'
							element={<Navigate to={NAVIGATION.APP + '/' + NAVIGATION.PHONEBOOK} />}
						/>
					</Routes>
				</Suspense>
			</Router>
		</Flex>
	);
}

const Loading = () => {
	return (
		<Flex
			direction={'column'}
			justifyContent={'center'}
			alignItems={'center'}
			flexDirection='column'
			width={'100vw'}
			height={'100vh'}
		>
			<Flex
				direction={'column'}
				justifyContent={'center'}
				alignItems={'center'}
				flexDirection='column'
				padding={'3rem'}
				rounded={'lg'}
				width={'500px'}
				height={'550px'}
			>
				<Flex justifyContent={'center'} alignItems={'center'} direction={'column'}>
					<Flex justifyContent={'center'} alignItems={'center'} width={'full'}>
						{/* <Image src={LOGO_PRIMARY} aspectRatio={1 / 1} className='' /> */}
					</Flex>
					<Progress size='xs' isIndeterminate width={'350px'} rounded={'lg'} />
				</Flex>
			</Flex>
		</Flex>
	);
};

export default App;
