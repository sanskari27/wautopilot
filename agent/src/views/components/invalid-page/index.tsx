import { Box, Center, Flex, Image, Text } from '@chakra-ui/react';
import { Color, LOGO_PRIMARY, NOT_FOUND } from '../../../config/const';

export default function InvalidPage() {
	return (
		<Flex
			justifyContent={'center'}
			width={'100vw'}
			minHeight={'100vh'}
			bg={'white'}
			zIndex={9999}
			position={'absolute'}
			left={0}
			top={0}
			userSelect={'none'}
		>
			<Center>
				<Box className='w-[90vw] max-w-[500px]' rounded={'xl'} py={'1rem'} px={'2rem'}>
					<Flex alignItems={'center'} gap={'0.5rem'} justifyContent={'center'}>
						<Image src={LOGO_PRIMARY} height={'3.5rem'} />
						<Text color={Color.ACCENT_DARK} fontWeight={'bold'} fontSize={'5xl'}>
							Wautopilot
						</Text>
					</Flex>
					<Flex alignItems={'center'} gap={'0.5rem'} justifyContent={'center'} marginTop={'3rem'}>
						<Image src={NOT_FOUND} />
					</Flex>
					<Text textAlign={'center'} fontWeight={'medium'} fontSize={'3xl'} marginTop={'2rem'}>
						Page Not Found
					</Text>
				</Box>
			</Center>
		</Flex>
	);
}
