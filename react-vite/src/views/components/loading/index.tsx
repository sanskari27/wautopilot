import { Flex, Image, Text } from '@chakra-ui/react';
import Lottie from 'lottie-react';
import { LOGO } from '../../../assets/Images';
import { LOTTIE_LOADER } from '../../../assets/Lottie';

export default function Loading({ isLoaded }: { isLoaded: boolean }) {
	if (isLoaded) {
		return null;
	}
	return (
		<Flex
			justifyContent={'center'}
			alignItems={'center'}
			direction={'column'}
			position={'fixed'}
			gap={'3rem'}
			height={'100vh'}
			width={'100vw'}
			left={0}
			top={0}
			zIndex={99}
			userSelect={'none'}
			className='bg-black/50'
		>
			<Flex
				direction={'column'}
				justifyContent={'center'}
				alignItems={'center'}
				bg={'#f2f2f2'}
				paddingX={'4rem'}
				paddingTop={'4rem'}
				paddingBottom={'2rem'}
				aspectRatio={'1/1'}
				rounded={'lg'}
			>
				<Image src={LOGO} height={'100px'} mixBlendMode={'multiply'} />
				<Lottie animationData={LOTTIE_LOADER} loop={true} />
				<Text mt={'1rem'} className='text-black ' fontSize={'xs'}>
					Fetching Data
				</Text>
				<Text className='text-black ' fontSize={'xs'}>
					It may take some time depending on your network connection.
				</Text>
			</Flex>
		</Flex>
	);
}
