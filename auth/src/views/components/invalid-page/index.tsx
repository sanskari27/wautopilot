import { Box, Center, Flex, Image, Text } from '@chakra-ui/react';
import { Color, LOGO_PRIMARY, NOT_FOUND } from '../../../config/const';

export default function InvalidPage() {
	return (
		<Flex justifyContent={'center'} width={'100vw'} minHeight={'100vh'}>
			<Center>
				<Box className='w-[90vw] max-w-[500px]' rounded={'xl'} py={'1rem'} px={'2rem'}>
					<Flex alignItems={'center'} gap={'0.5rem'} justifyContent={'center'}>
						<Image src={LOGO_PRIMARY} height={'2.5rem'} />
						<Text color={Color.ACCENT_DARK} fontWeight={'bold'} fontSize={'3xl'}>
							Wautopilot
						</Text>
					</Flex>
					<Flex alignItems={'center'} gap={'0.5rem'} justifyContent={'center'} marginTop={'2rem'}>
						<Image src={NOT_FOUND} />
					</Flex>
					<Text textAlign={'center'} fontWeight={'medium'} fontSize={'3xl'} marginTop={'2rem'}>
						Invalid Request.
					</Text>
				</Box>
			</Center>
		</Flex>
	);
}
