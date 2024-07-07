import { Suspense, lazy } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { NAVIGATION } from './config/const';

import { Flex, Progress } from '@chakra-ui/react';
import { useFetchLabels } from './hooks/useFetchLabels';
import useFilterLabels from './hooks/useFilterLabels';
import usePermissions from './hooks/usePermissions';
import InvalidPage from './views/components/invalid-page';

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
const CreateChatbotFlow = lazy(
	() => import('./views/pages/chatbot-flow/components/CreateChatbotFlow')
);
const RecurringPage = lazy(() => import('./views/pages/recurring'));
const CreateRecurring = lazy(() => import('./views/pages/recurring/CreateRecurring'));
const ButtonResponseReport = lazy(() => import('./views/components/button-report'));
const AgentPage = lazy(() => import('./views/pages/agent'));

function App() {
	useFilterLabels();
	useFetchLabels();

	const { broadcast, buttons, chatbot, chatbot_flow, template, media, recurring } =
		usePermissions();

	return (
		<Flex minHeight={'100vh'} width={'100vw'} className='bg-background '>
			<Router>
				<Suspense fallback={<Loading />}>
					<Routes>
						<Route path={NAVIGATION.APP} element={<AppPage />}>
							<Route path={NAVIGATION.PHONEBOOK} element={<Phonebook />} />
							{template.create && (
								<Route
									path={NAVIGATION.TEMPLATES + '/' + NAVIGATION.ADD_TEMPLATE}
									element={<EditTemplate />}
								/>
							)}
							{template.update && (
								<Route
									path={NAVIGATION.TEMPLATES + '/' + NAVIGATION.EDIT_TEMPLATE + '/:id'}
									element={<EditTemplate />}
								/>
							)}
							<Route path={NAVIGATION.MEDIA} element={<MediaPage />}>
								{media.create && <Route path={'new'} element={<AddMedia />} />}
							</Route>
							<Route path={NAVIGATION.TEMPLATES} element={<Templates />} />
							{broadcast.create && <Route path={NAVIGATION.BROADCAST} element={<Broadcast />} />}
							<Route path={NAVIGATION.AGENT} element={<AgentPage />} />
							<Route path={NAVIGATION.RECURRING} element={<RecurringPage />}>
								{buttons.read && (
									<Route path={'button-report/:campaignId'} element={<ButtonResponseReport />} />
								)}
								{recurring.create ? (
									<Route path={'new'} element={<CreateRecurring />} />
								) : (
									<Route path={'new'} element={<InvalidPage />} />
								)}
								{recurring.update && <Route path={':id'} element={<CreateRecurring />} />}
							</Route>
							{broadcast.report && (
								<Route path={NAVIGATION.BROADCAST_REPORT} element={<BroadcastReport />}>
									{buttons.read && (
										<Route path={'button-report/:campaignId'} element={<ButtonResponseReport />} />
									)}
								</Route>
							)}
							<Route path={NAVIGATION.CONTACT} element={<ContactPage />} />
							<Route path={NAVIGATION.INBOX} element={<Conversation />} />
							<Route path={NAVIGATION.CHATBOT} element={<ChatBot />}>
								{chatbot.create ? (
									<Route path={'new'} element={<CreateChatBot />} />
								) : (
									<Route path={'new'} element={<InvalidPage />} />
								)}
								{buttons.read && (
									<Route path={'button-report/:campaignId'} element={<ButtonResponseReport />} />
								)}
								{chatbot.update && <Route path={':id'} element={<CreateChatBot />} />}
							</Route>
							<Route path={NAVIGATION.CHATBOT_FLOW} element={<ChatbotFlow />}>
								{chatbot_flow.update && <Route path={'update-flow/:id'} element={<RenderFlow />} />}
								{buttons.read && (
									<Route path={'button-report/:campaignId'} element={<ButtonResponseReport />} />
								)}
								{chatbot_flow.create ? (
									<Route path={'new'} element={<CreateChatbotFlow />} />
								) : (
									<Route path={'new'} element={<InvalidPage />} />
								)}
								{chatbot_flow.update && <Route path={':id'} element={<CreateChatbotFlow />} />}
							</Route>
							<Route path={NAVIGATION.DASHBOARD} element={<Dashboard />} />
							<Route path='*' element={<InvalidPage />} />
						</Route>
						<Route path='*' element={<InvalidPage />} />
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
