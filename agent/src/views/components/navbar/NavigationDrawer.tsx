import { Avatar, Box, Flex, Icon, Text, VStack } from '@chakra-ui/react';
import { useRef } from 'react';
import { BiBot, BiCake, BiConversation, BiSupport } from 'react-icons/bi';
import { IconType } from 'react-icons/lib';
import { MdContacts, MdOutlineDashboard, MdOutlinePermMedia, MdSettings } from 'react-icons/md';
import { RiContactsBook2Line, RiFlowChart } from 'react-icons/ri';
import { TbLogout2, TbMessage2Plus, TbReportSearch, TbTemplate } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NAVIGATION, WEBPAGE_URL } from '../../../config/const';
import AuthService from '../../../services/auth.service';
import { StoreNames, StoreState } from '../../../store';
import DevicesDialog, { DevicesHandle } from '../devices';
import SettingsDrawer, { SettingsDrawerHandle } from '../settings-dialog';

function isActiveTab(tab: string, path: string): boolean {
	if (path.includes(tab)) return true;
	return false;
}

export default function NavigationDrawer({
	expanded,
	setDrawerExpanded,
}: {
	expanded: boolean;
	setDrawerExpanded: {
		on: () => void;
		off: () => void;
		toggle: () => void;
	};
}) {
	const navigate = useNavigate();
	const DevicesRef = useRef<DevicesHandle>(null);
	const settingsDrawer = useRef<SettingsDrawerHandle>(null);

	const handleDevicesDialog = () => {
		DevicesRef.current?.open();
	};

	const { list: deviceList } = useSelector((state: StoreState) => state[StoreNames.DEVICES]);
	const {
		selected_device_id,
		user_details: { permissions },
	} = useSelector((state: StoreState) => state[StoreNames.USER]);

	const handleLogout = async () => {
		await AuthService.logout();
		window.location.replace(WEBPAGE_URL);
	};

	const theme = 'light';

	return (
		<Box>
			<Flex
				direction={'column'}
				userSelect={'none'}
				position={'fixed'}
				height={'calc(100vh - 35px)'}
				borderRightWidth={'thin'}
				borderRightColor={theme === 'light' ? 'gray.300' : 'gray.500'}
				zIndex={99}
				background={theme === 'light' ? 'white' : '#252525'}
				className={`md:hover:w-[200px] transition-all duration-300 ease-in-out w-0 md:w-[70px] ${
					expanded ? 'w-[200px]' : 'md:w-[70px]'
				} `}
			>
				<Flex
					direction={'column'}
					height={'calc(100vh - 35px)'}
					overflowY={'auto'}
					paddingBottom={'1rem'}
					flexGrow={1}
				>
					<Box flexGrow={'1'}>
						<Flex flexDirection={'column'} paddingY={'0.5rem'} paddingX={'0.85rem'} gap={'0.25rem'}>
							<MenuButton
								setDrawerExpanded={setDrawerExpanded}
								route={NAVIGATION.DASHBOARD}
								icon={MdOutlineDashboard}
								name='Dashboard'
							/>
							<MenuButton
								setDrawerExpanded={setDrawerExpanded}
								route={NAVIGATION.PHONEBOOK}
								icon={RiContactsBook2Line}
								name='Phonebook'
							/>
							<MenuButton
								setDrawerExpanded={setDrawerExpanded}
								route={NAVIGATION.TEMPLATES}
								icon={TbTemplate}
								name='Templates'
							/>
							{permissions.create_broadcast && (
								<MenuButton
									setDrawerExpanded={setDrawerExpanded}
									route={NAVIGATION.BROADCAST}
									icon={TbMessage2Plus}
									name='Broadcast'
								/>
							)}
							{permissions.create_recurring_broadcast && (
								<MenuButton
									setDrawerExpanded={setDrawerExpanded}
									route={NAVIGATION.RECURRING}
									icon={BiCake}
									name='Recurring'
								/>
							)}
							{permissions.view_broadcast_reports && (
								<MenuButton
									setDrawerExpanded={setDrawerExpanded}
									route={NAVIGATION.BROADCAST_REPORT}
									icon={TbReportSearch}
									name='Report'
								/>
							)}
							<MenuButton
								setDrawerExpanded={setDrawerExpanded}
								route={NAVIGATION.INBOX}
								icon={BiConversation}
								name='Conversations'
							/>
							<MenuButton
								setDrawerExpanded={setDrawerExpanded}
								route={NAVIGATION.MEDIA}
								icon={MdOutlinePermMedia}
								name='Media'
							/>
							<MenuButton
								setDrawerExpanded={setDrawerExpanded}
								route={NAVIGATION.CONTACT}
								icon={MdContacts}
								name='Contacts'
							/>
							{permissions.manage_chatbot && (
								<MenuButton
									setDrawerExpanded={setDrawerExpanded}
									route={NAVIGATION.CHATBOT}
									icon={BiBot}
									name='Chat Bot'
								/>
							)}
							{permissions.manage_chatbot_flows && (
								<MenuButton
									setDrawerExpanded={setDrawerExpanded}
									route={NAVIGATION.CHATBOT_FLOW}
									icon={RiFlowChart}
									name='Chatbot Flow'
								/>
							)}
						</Flex>
					</Box>
					<VStack
						alignItems={'flex-start'}
						justifyContent={'flex-start'}
						flexDirection={'column'}
						paddingY={'0.5rem'}
						paddingX={'0.85rem'}
						gap={'0.25rem'}
					>
						<Flex
							className={`cursor-pointer overflow-hidden
										transition-all duration-300 ease-in-out`}
							padding={'0.3rem'}
							rounded={'lg'}
							gap={'0.5rem'}
							onClick={handleDevicesDialog}
							width={'full'}
							alignItems={'center'}
						>
							<Avatar
								size={'sm'}
								name={deviceList.find((device) => device.id === selected_device_id)?.verifiedName}
							/>
							<Text fontSize={'sm'} whiteSpace={'nowrap'}>
								{deviceList.find((device) => device.id === selected_device_id)?.verifiedName ??
									'No Devices'}
							</Text>
						</Flex>
						<Flex
							className={`cursor-pointer overflow-hidden
										transition-all duration-300 ease-in-out`}
							padding={'0.45rem'}
							rounded={'lg'}
							gap={'0.5rem'}
							onClick={() => navigate(`${NAVIGATION.AGENT}`)}
							width={'full'}
							alignItems={'center'}
						>
							<Icon as={BiSupport} width={5} height={5} />
							<Text ml={'0.5rem'} fontSize={'sm'} whiteSpace={'nowrap'}>
								Agents
							</Text>
						</Flex>
						<Flex
							className={`cursor-pointer overflow-hidden
										transition-all duration-300 ease-in-out`}
							padding={'0.6rem'}
							rounded={'lg'}
							gap={'1.1rem'}
							onClick={handleLogout}
							width={'full'}
							alignItems={'center'}
						>
							<Icon as={TbLogout2} width={5} height={5} className='rotate-180' />
							<Text fontSize={'sm'} whiteSpace={'nowrap'}>
								Logout
							</Text>
						</Flex>
						<Flex
							className={`cursor-pointer overflow-hidden
										transition-all duration-300 ease-in-out`}
							padding={'0.6rem'}
							rounded={'lg'}
							gap={'1.1rem'}
							onClick={() => settingsDrawer.current?.open()}
							width={'full'}
							alignItems={'center'}
						>
							<Icon as={MdSettings} width={5} height={5} className='rotate-180' />
							<Text fontSize={'sm'} whiteSpace={'nowrap'}>
								Settings
							</Text>
						</Flex>
					</VStack>
				</Flex>
			</Flex>
			<DevicesDialog ref={DevicesRef} />
			<SettingsDrawer ref={settingsDrawer} />
		</Box>
	);
}

type MenuButtonProps = {
	route: string;
	icon: IconType;
	name: string;
	setDrawerExpanded: {
		on: () => void;
		off: () => void;
		toggle: () => void;
	};
};

function MenuButton({ route, icon, name, setDrawerExpanded }: MenuButtonProps) {
	const navigate = useNavigate();
	const handleButtonClick = () => {
		navigate(route);
		setDrawerExpanded.off();
	};
	return (
		<Flex
			className={`cursor-pointer overflow-hidden
hover:!shadow-xl  hover:!drop-shadow-lg hover:!bg-green-100 hover:!font-medium 
${
	isActiveTab(route, location.pathname) &&
	'shadow-xl  drop-shadow-lg bg-green-200  text-green-900 font-bold'
} transition-all duration-300 ease-in-out`}
			padding={'0.6rem'}
			rounded={'lg'}
			gap={'1.1rem'}
			onClick={handleButtonClick}
			whiteSpace={'nowrap'}
		>
			<Icon as={icon} color={'green.400'} width={5} height={5} />
			<Text fontSize={'sm'}>{name}</Text>
		</Flex>
	);
}
