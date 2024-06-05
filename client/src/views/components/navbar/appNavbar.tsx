import { Box, Flex, Icon, Image } from '@chakra-ui/react';
import { HiMenu } from 'react-icons/hi';
import { LOGO_PRIMARY } from '../../../config/const';

type AppNavbarProps = {
	setFlag: {
		on: () => void;
		off: () => void;
		toggle: () => void;
	};
};

const AppNavbar = ({ setFlag }: AppNavbarProps) => {
	return (
		<Box>
			<Flex height={'50px'} borderBottomWidth={'thin'} borderBottomColor={'gray.300'}>
				<Box
					width={'70px'}
					height={'50px'}
					display={'flex'}
					alignItems={'center'}
					justifyContent={'flax-start'}
					pl={'1.5rem'}
				>
					<Image src={LOGO_PRIMARY} width={'36px'} className='hidden md:block shadow-lg' />
					<Box className='block md:hidden'>
						<Icon
							as={HiMenu}
							color={'black'}
							width={5}
							height={5}
							className='cursor-pointer'
							onClick={setFlag.toggle}
						/>
					</Box>
				</Box>
			</Flex>
		</Box>
	);
};

export default AppNavbar;
