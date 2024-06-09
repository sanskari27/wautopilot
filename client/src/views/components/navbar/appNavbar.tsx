import { Box, Flex, Icon, Image, Text } from '@chakra-ui/react';
import { HiMenu } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';
import { LOGO_PRIMARY } from '../../../config/const';

type AppNavbarProps = {
	expanded: boolean;
	setDrawerExpanded: {
		on: () => void;
		off: () => void;
		toggle: () => void;
	};
};

const AppNavbar = ({ expanded, setDrawerExpanded }: AppNavbarProps) => {
	return (
		<Box>
			<Flex
				height={'50px'}
				borderBottomWidth={'thin'}
				borderBottomColor={'gray.300'}
				alignItems={'center'}
			>
				<Box
					width={'70px'}
					height={'50px'}
					display={'flex'}
					alignItems={'center'}
					justifyContent={'flax-start'}
					pl={'1.5rem'}
				>
					<Image src={LOGO_PRIMARY} width={'36px'} className='hidden md:block ' />
					<Box className='block md:hidden'>
						<Icon
							as={expanded ? IoMdClose : HiMenu}
							color={'black'}
							width={5}
							height={5}
							className='cursor-pointer'
							onClick={setDrawerExpanded.toggle}
						/>
					</Box>
				</Box>
				<Text fontSize={'1.5rem'} fontWeight={'bold'} letterSpacing={'1px'}>
					Wautopilot
				</Text>
			</Flex>
		</Box>
	);
};

export default AppNavbar;
