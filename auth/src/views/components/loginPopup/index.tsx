import {
	Box,
	Center,
	Flex,
	Image,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from '@chakra-ui/react';
import { Color, LOGO_PRIMARY } from '../../../config/const';
import LoginTab from './login-tab';
import SignupTab from './signup-tab';

export default function LoginPopup() {
	return (
		<Flex justifyContent={'center'} width={'100vw'} minHeight={'100vh'}>
			<Center>
				<Box
					className='w-[90vw] max-w-[500px]'
					borderWidth={'2px'}
					rounded={'xl'}
					py={'1rem'}
					px={'2rem'}
				>
					<Flex alignItems={'center'} gap={'0.5rem'} justifyContent={'center'}>
						<Image src={LOGO_PRIMARY} height={'2.5rem'} />
						<Text color={Color.ACCENT_DARK} fontWeight={'bold'} fontSize={'3xl'}>
							Wautopilot
						</Text>
					</Flex>
					<Tabs
						width={'full'}
						isFitted
						variant='soft-rounded'
						size={'sm'}
						colorScheme='green'
						mt={'1rem'}
					>
						<TabList width={'200px'} margin={'auto'} bgColor={'whitesmoke'} rounded={'full'}>
							<Tab>Login</Tab>
							<Tab>Signup</Tab>
						</TabList>
						<TabPanels>
							<TabPanel>
								<LoginTab />
							</TabPanel>
							<TabPanel>
								<SignupTab />
							</TabPanel>
						</TabPanels>
					</Tabs>
				</Box>
			</Center>
		</Flex>
	);
}
