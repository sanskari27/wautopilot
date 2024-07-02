import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { BiWallet } from 'react-icons/bi';

export default function Dashboard() {
	return (
		<Flex
			direction={'column'}
			gap={'1rem'}
			className='custom-scrollbar'
			justifyContent={'center'}
			p={'1rem'}
		>
			<Text fontSize={'2xl'} fontWeight={'bold'}>
				Dashboard
			</Text>
			<Flex gap={'1rem'} className='flex-col md:flex-row'>
				<Box
					shadow={'lg'}
					rounded={'3xl'}
					p={'1rem'}
					height={'420px'}
					className='md:w-3/4 w-full'
					bgColor={'#eee'}
				></Box>
				<Flex className='md:w-1/4 w-full flex-col md:flex-col' gap={'1rem'}>
					<Flex
						direction={'column'}
						shadow={'lg'}
						rounded={'3xl'}
						p={'1rem'}
						height={'200px'}
						bgColor={'#eee'}
						gap={'1rem'}
					>
						<Text
							fontSize={'1.5rem'}
							backgroundColor={'lightskyblue'}
							rounded={'xl'}
							py={'0.25rem'}
							px={'1.5rem'}
							w={'fit-content'}
							color={'steelblue'}
						>
							<Icon as={BiWallet} /> ₹120
						</Text>
						<Text>Plan Validity: </Text>
						<Text>You are currently subscribed to </Text>
					</Flex>
					<Flex
						direction={'column'}
						shadow={'lg'}
						rounded={'3xl'}
						p={'1rem'}
						height={'200px'}
						bgColor={'#eee'}
						gap={'1rem'}
					>
						<Text
							fontSize={'1.5rem'}
							backgroundColor={'lightskyblue'}
							rounded={'xl'}
							py={'0.25rem'}
							px={'1.5rem'}
							w={'fit-content'}
							color={'steelblue'}
						>
							<Icon as={BiWallet} /> ₹120
						</Text>
						<Text>Plan Validity: </Text>
						<Text>You are currently subscribed to </Text>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
}
