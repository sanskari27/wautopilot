import { Box, Heading, Link, Text } from '@chakra-ui/react';
import HomeNavbar from '../../components/navbar/homeNavbar';

export default function Privacy() {
	return (
		<Box className='h-screen w-screen overflow-x-hidden overflow-y-scroll pt=[70px]'>
			<HomeNavbar />
			<main className='p-6 md:px-[5%]'>
				<section id='heading' className=' pt-[70px]'>
					<Heading>Privacy Policy</Heading>
				</section>
				<section id='terms'>
					<Text fontSize={'1.25rem'} pt={'1rem'}>
						Welcome to Wautopilot! We value your privacy and want you to feel secure when using our
						website,{' '}
						<Box as='span'>
							<Link href='https://wautopilot.com/'>https://wautopilot.com/</Link>
						</Box>
						. This Privacy Policy outlines the information we collect, how we use it, and your
						rights regarding your personal data. If you have any questions or need further
						clarification, please reach out to us. This policy is specific to our online activities
						and doesn’t cover offline data collection.
					</Text>
				</section>
				<section id='use' className='pt-6'>
					<Text fontSize={'1.5rem'} fontWeight={'medium'}>
						Your Consent
					</Text>
					<Text fontSize={'1.25rem'} pt={'1rem'}>
						By using our website, you agree to the terms of this Privacy Policy. We appreciate your
						trust in us.
					</Text>
				</section>
                <section id='cookies' className='pt-6'>
                    <Text fontSize={'1.5rem'} fontWeight={'medium'}>
                        Information Collection
                    </Text>
                    <Text fontSize={'1.25rem'} pt={'1rem'}>
                        We collect personal information when you provide it voluntarily. This information may
                        include your name, email address, phone number, and other details necessary for
                        communication. Additionally, when you register for an account, we may request contact
                        information such as your name, company name, address, email, and phone number.
                    </Text>
                </section>
                <section id='cookies' className='pt-6'>
                    <Text fontSize={'1.5rem'} fontWeight={'medium'}>
                        How We Use Your Information
                    </Text>
                    <Text fontSize={'1.25rem'} pt={'1rem'}>
                        We use the information we collect to:
                        <ul>
                            <li>Maintain and operate our website</li>
                            <li>Enhance and personalize your browsing experience</li>
                            <li>Analyze website usage for improvements</li>
                            <li>Develop new features and functionalities</li>
                            <li>Communicate directly with you for customer service, updates, and marketing</li>
                            <li>Send emails</li>
                            <li>Detect and prevent fraud</li>
                        </ul>
                    </Text>
                </section>
                <section id='cookies' className='pt-6'>
                    <Text fontSize={'1.5rem'} fontWeight={'medium'}>
                        Log Files
                    </Text>
                    <Text fontSize={'1.25rem'} pt={'1rem'}>
                        Like many websites, Wautopilot employs log files to gather information on visitors. This
                        data includes IP addresses, browser type, ISP, date and time stamps, and page navigation.
                        None of this information is personally identifiable; it’s used for analyzing trends, site
                        administration, and demographics.
                    </Text>
                </section>
                <section id='cookies' className='pt-6'>
                    <Text fontSize={'1.5rem'} fontWeight={'medium'}>
                        Third-Party Privacy Policies
                    </Text>
                    <Text fontSize={'1.25rem'} pt={'1rem'}>
                        Our Privacy Policy does not extend to other advertisers or websites. Consult the
                        respective privacy policies of these third parties for information on their practices and
                        opt-out options. You can manage cookies through your browser settings.
                    </Text>
                </section>
			</main>
		</Box>
	);
}
