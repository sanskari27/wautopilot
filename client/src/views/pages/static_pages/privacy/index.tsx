import { Box, Heading, Text } from '@chakra-ui/react';
import Footer from '../../../components/footer';
import HomeNavbar from '../../../components/navbar/HomeNav';

export default function Privacy() {
	return (
		<Box className='h-screen w-screen overflow-x-hidden overflow-y-scroll pt=[70px]'>
			<HomeNavbar />
			<main className='p-6 md:px-[5%]'>
				<section id='heading' className=' pt-[70px]'>
					<Heading className='text-primary-dark'>Privacy Policy</Heading>
				</section>
				<section id='terms'>
					<Text fontSize={'large'} pt={'1rem'}>
						Welcome to Wautopilot! Your privacy is important to us, and we want you to feel secure
						when using our website, https://wautopilot.com/. This Privacy Policy explains the
						information we collect, how we use it, and your rights regarding your personal data. If
						you have any questions or need further clarification, please reach out to us. This
						policy applies solely to our online activities and does not cover offline data
						collection.
					</Text>
				</section>
				<section id='use' className='pt-6'>
					<Text fontSize={'larger'} fontWeight={'medium'}>
						Your Consent
					</Text>
					<Text fontSize={'large'} pt={'1rem'}>
						By using our website, you agree to the terms of this Privacy Policy. We appreciate your
						trust in us.
					</Text>
				</section>
				<section id='cookies' className='pt-6'>
					<Text fontSize={'larger'} fontWeight={'medium'}>
						Information We Collect
					</Text>
					<Text fontSize={'large'} pt={'1rem'}>
						We collect personal information that you provide voluntarily. This may include:
						<ul>
							<li>- Name, email address, and phone number for communication</li>
							<li>- Company name, address, and phone number during account registration</li>
							<li>- Payment information when you purchase our services</li>
						</ul>
					</Text>
				</section>
				<section id='cookies' className='pt-6'>
					<Text fontSize={'larger'} fontWeight={'medium'}>
						How We Use Your Information
					</Text>
					<Text fontSize={'large'} pt={'1rem'}>
						We use the information we collect to:
						<ul>
							<li>- Maintain and operate our website</li>
							<li>- Enhance and personalize your browsing experience</li>
							<li>- Analyze website usage for improvements</li>
							<li>- Develop new features and functionalities</li>
							<li>- Communicate directly with you for customer service, updates, and marketing</li>
							<li>- Send emails and newsletters</li>
							<li>- Detect and prevent fraud</li>
							<li>- Process transactions and send order confirmations</li>
						</ul>
					</Text>
				</section>
				<section id='cookies' className='pt-6'>
					<Text fontSize={'larger'} fontWeight={'medium'}>
						Log Files
					</Text>
					<Text fontSize={'large'} pt={'1rem'}>
						Like many websites, Wautopilot uses log files to collect information about visitors.
						This includes:
						<ul>
							<li>- IP addresses</li>
							<li>- Browser type</li>
							<li>- Internet Service Provider (ISP)</li>
							<li>- Date and time stamps</li>
							<li>- Referring/exit pages</li>
							<li>- Clickstream data</li>
						</ul>
						This information is not personally identifiable and is used for analyzing trends,
						administering the site, tracking users’ movements around the site, and gathering
						demographic information.
					</Text>
				</section>
				<section id='cookies' className='pt-6'>
					<Text fontSize={'larger'} fontWeight={'medium'}>
						Cookies and Web Beacons
					</Text>
					<Text fontSize={'large'} pt={'1rem'}>
						Wautopilot uses cookies to:
						<ul>
							<li>- Store information about visitors’ preferences</li>
							<li>- Record user-specific information on which pages users access or visit</li>
							<li>
								- Customize web page content based on visitors’ browser type or other information
								that the visitor sends
							</li>
						</ul>
					</Text>
				</section>
				<section id='cookies' className='pt-6'>
					<Text fontSize={'larger'} fontWeight={'medium'}>
						CCPA Privacy Rights (Do Not Sell My Personal Information)
					</Text>
					<Text fontSize={'large'} pt={'1rem'}>
						California consumers have the right to:
						<ul>
							<li>
								- Request disclosure of the categories and specific pieces of personal data
								collected
							</li>
							<li>- Request deletion of personal data</li>
							<li>- Opt-out of the sale of personal data</li>
						</ul>
						To exercise these rights, please contact us. We will respond within one month.
					</Text>
				</section>
				<section id='cookies' className='pt-6'>
					<Text fontSize={'larger'} fontWeight={'medium'}>
						GDPR Data Protection Rights
					</Text>
					<Text fontSize={'large'} pt={'1rem'}>
						Under GDPR, you have the right to:
						<ul>
							<li>- Access your personal data</li>
							<li>- Rectify inaccurate data</li>
							<li>- Request erasure of your data</li>
							<li>- Restrict processing of your data</li>
							<li>- Object to data processing</li>
							<li>- Data portability</li>
						</ul>
						To exercise these rights, please contact us. We will respond within one month.
					</Text>
				</section>
				<section id='cookies' className='pt-6'>
					<Text fontSize={'larger'} fontWeight={'medium'}>
						Data Security
					</Text>
					<Text fontSize={'large'} pt={'1rem'}>
						We take the security of your data seriously and have implemented measures to protect it.
						However, no method of transmission over the internet is 100% secure, and we cannot
						guarantee the security of your data.
					</Text>
				</section>
				<section id='cookies' className='pt-6'>
					<Text fontSize={'larger'} fontWeight={'medium'}>
						Data Retention
					</Text>
					<Text fontSize={'large'} pt={'1rem'}>
						We retain your personal information only for as long as necessary to provide you with
						our services and for other legitimate business purposes. We will delete your data when
						it is no longer needed.
					</Text>
				</section>
				<section id='cookies' className='pt-6'>
					<Text fontSize={'larger'} fontWeight={'medium'}>
						Children's Information
					</Text>
					<Text fontSize={'large'} pt={'1rem'}>
						We prioritize protecting children’s online privacy. If you believe that your child under
						13 has provided personal information on our website, please contact us immediately, and
						we will promptly take steps to remove such information.
					</Text>
				</section>
				<section id='cookies' className='pt-6'>
					<Text fontSize={'larger'} fontWeight={'medium'}>
						International Data Transfers
					</Text>
					<Text fontSize={'large'} pt={'1rem'}>
						Your information may be transferred to—and maintained on—computers located outside of
						your state, province, country, or other governmental jurisdiction where the data
						protection laws may differ from those of your jurisdiction. Your consent to this Privacy
						Policy followed by your submission of such information represents your agreement to that
						transfer.
					</Text>
				</section>

				<section id='cookies' className='pt-6'>
					<Text fontSize={'larger'} fontWeight={'medium'}>
						Changes to This Privacy Policy
					</Text>
					<Text fontSize={'large'} pt={'1rem'}>
						We may update this Privacy Policy from time to time. We will notify you of any changes
						by posting the new Privacy Policy on this page. Changes are effective immediately upon
						posting.
					</Text>
				</section>
				<section id='cookies' className='pt-6'>
					<Text fontSize={'larger'} fontWeight={'medium'}>
						Contact Us
					</Text>
					<Text fontSize={'large'} pt={'1rem'}>
						If you have any questions or concerns about our Privacy Policy, please contact us. Your
						privacy is important to us, and we are here to help.
					</Text>
				</section>
				<section id='cookies' className='pt-6'>
					<Text fontSize={'larger'} fontWeight={'medium'}>
						Effective Date
					</Text>
					<Text fontSize={'large'} pt={'1rem'}>
						This Privacy Policy is effective as of 17 May 2024.
					</Text>
				</section>
			</main>
			<Footer />
		</Box>
	);
}
