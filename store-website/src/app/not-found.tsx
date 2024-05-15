import { Box, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
	return (
		<Box>
			<Box width='full'>
				<Flex className='min-h-screen flex-col  justify-center items-center'>
					<Image
						src={'abc.com'}
						alt='Keeth Logo'
						width={200}
						height={60}
						className='animate-pulse'
					/>
					<Text fontWeight={'medium'} fontSize={'lg'} mt={'1rem'}>
						The page you are requesting for doesn't exists.
					</Text>
					<Link href='/'>
						<Text
							fontWeight={'medium'}
							fontSize={'md'}
							mt={'0.5rem'}
							className='text-primary-marron'
						>
							Continue Shopping
						</Text>
					</Link>
				</Flex>
			</Box>
		</Box>
	);
}
