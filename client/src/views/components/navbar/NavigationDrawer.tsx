import { Box, Flex, Icon, IconButton, Text, VStack } from '@chakra-ui/react';
import { IconType } from 'react-icons/lib';
import { TbLogout2 } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { MenuItems } from '../../../config/const';
import Each from '../utils/Each';

function isActiveTab(tab: string, path: string): boolean {
	if (path.includes(tab)) return true;
	return false;
}

export default function NavigationDrawer({ expanded }: { expanded: boolean }) {
	const handleLogout = async () => {
		// logout();
	};

	const theme = 'light';

	return (
		<Box>
			<Flex
				direction={'column'}
				userSelect={'none'}
				position={'fixed'}
				height={'calc(100vh -50px)'}
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
					height={'calc(100vh - 50px)'}
					overflowY={'auto'}
					paddingBottom={'1rem'}
					flexGrow={1}
				>
					<Box flexGrow={'1'}>
						<Flex flexDirection={'column'} paddingY={'0.5rem'} paddingX={'0.85rem'} gap={'0.25rem'}>
							<Each
								items={MenuItems}
								render={(item, index) => (
									<MenuButton key={index} route={item.route} icon={item.icon} name={item.title} />
								)}
							/>
						</Flex>
					</Box>
					<VStack alignItems={'flex-start'} pl={4}>
						<IconButton
							aria-label='Logout'
							color={theme === 'light' ? 'black' : 'white'}
							icon={<TbLogout2 />}
							onClick={handleLogout}
							className='focus:outline-none focus:border-none rotate-180'
							backgroundColor={'transparent'}
							_hover={{
								backgroundColor: 'transparent',
								border: 'none',
								outline: 'none',
							}}
						/>
					</VStack>
				</Flex>
			</Flex>
		</Box>
	);
}

type MenuButtonProps = {
	route: string;
	icon: IconType;
	name: string;
};

function MenuButton({ route, icon, name }: MenuButtonProps) {
	const navigate = useNavigate();
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
			onClick={() => navigate(route)}
		>
			<Icon as={icon} color={'green.400'} width={5} height={5} />
			<Text fontSize={'sm'}>{name}</Text>
		</Flex>
	);
}