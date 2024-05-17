import { Box, Heading, Text } from '@chakra-ui/react';
import Footer from '../../components/footer';
import HomeNavbar from '../../components/navbar/homeNavbar';

export default function Disclaimer() {
	return (
		<Box className='h-screen overflow-x-hidden overflow-y-scroll pt=[70px]'>
			<HomeNavbar />
			<main className='px-6 md:px-[5%]'>
				<section id='disclaimer' className='my-[17%]'>
					<Heading className='text-primary-dark'>Disclaimer</Heading>
					<Text className=' mt-6 text-md' fontSize={'large'} pt={'1rem'}>
						This site is not a part of WhatsApp or Facebook / Meta. All mentioned names or logos are
						properties of their respective companies. The information provided on this website is
						for educational purposes only. We neither support nor can be held responsible for any
						misuse of this information. Wautopilot is not affiliated with any brand or website.
						Users must use the software responsibly and adhere to the terms of service and usage
						policies of WhatsApp. Wautopilot is a standalone tool designed to facilitate and extend
						certain functionalities within WhatsApp. It is not a spam tool and must not be used for
						spamming or violating WhatsApp policies. This tool automates natural human behaviors to
						save time in manually performing tasks and collecting data that is already publicly
						available. We do not take responsibility for how users employ this software. All users
						are expected to use Wautopilot in a lawful and ethical manner.
					</Text>
				</section>
			</main>
			<Footer />
		</Box>
	);
}
