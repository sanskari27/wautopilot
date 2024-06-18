import { Box, Flex, Image, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { LOGO_WHITE } from '../../../config/const';

export default function Footer() {
	return (
		<footer className='bg-primary-dark text-accent'>
			<Box pt={'4rem'} pb='1rem' paddingX={'4%'}>
				<Flex
					width='full'
					className='flex-col md:flex-row text-center md:text-left gap-12 md:gap-8'
				>
					<Box className='w-full md:w-1/3'>
						<VStack width='full'>
							<Box width='full'>
								<Flex
									alignItems={'end'}
									className='justify-center md:justify-start'
									gap={'0.75rem'}
								>
									<Image src={LOGO_WHITE} alt='Logo' width={'40px'} className='h-[40px]' />
									<Text fontSize={'2xl'} className='text-accent font-bold text-2xl'>
										Wautopilot
									</Text>
								</Flex>
								<Box className='mx-auto md:mx-0 w-full md:w-[500px] pt-4'>
									<Box>WhatsApp Engagement Platform</Box>
									<Box paddingTop={2}>Made with ❤️ in India</Box>
								</Box>
							</Box>
						</VStack>
					</Box>
					<VStack className='w-full md:w-1/3 justify-start md:!items-end text-right'>
						<Text className='underline underline-offset-8 font-medium'>Support</Text>
						<Link className='hover:text-slate-300' to={'/terms'}>
							<Text>Terms & Conditions</Text>
						</Link>
						<Link className='hover:text-slate-300' to={'/privacy'}>
							<Text>Privacy Policy</Text>
						</Link>
						<Link className='hover:text-slate-300' to={'/disclaimer'}>
							<Text>Disclaimer</Text>
						</Link>
						<Link
							className='hover:text-slate-300'
							to='https://api.whatsapp.com/send/?phone=919654308000&text&type=phone_number&app_absent=0'
						>
							<Text>Contact Us</Text>
						</Link>
					</VStack>
					<VStack className='w-full md:w-1/3 justify-start md:!items-end text-center md:text-right !gap-0'>
						<Text className='underline underline-offset-8 font-medium'>Get in touch</Text>
						<Text mt={2}>Stellar Coaching & Consulting</Text>
						<Text>B-502, Sahara Apartment, Plot No. 11,</Text>
						<Text>Sector 6 Dwarka, Dwarka,</Text>
						<Text>New Delhi, Delhi 110075, India</Text>
					</VStack>
				</Flex>
				<Flex
					className='flex-col md:flex-row items-center '
					width={'full'}
					justifyContent={'center'}
					marginTop={'2rem'}
				>
					<Text className=' px-4 text-center'>© 2024 Wautopilot , All rights reserved.</Text>
				</Flex>
			</Box>
		</footer>
	);
}
