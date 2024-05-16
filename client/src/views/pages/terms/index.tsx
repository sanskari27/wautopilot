import { Box, Heading, Link, Text } from '@chakra-ui/react';
import HomeNavbar from '../../components/navbar/homeNavbar';

export default function Terms() {
	return (
		<Box className='h-screen w-screen overflow-x-hidden overflow-y-scroll pt=[70px]'>
			<HomeNavbar />
			<main className='p-6 md:px-[5%]'>
				<section id='heading' className=' pt-[70px]'>
					<Heading>Terms and Conditions</Heading>
					<Text pt={'1rem'} fontSize={'1.5rem'} fontWeight={'medium'}>
						Welcome to{' '}
						<Box as='span' className='text-primary-dark'>
							Wautopilot!
						</Box>
					</Text>
				</section>
				<section id='terms'>
					<Text fontSize={'1.25rem'} pt={'1rem'}>
						These terms and conditions govern your use of Wautopilot’s website, located at{' '}
						<Box as='span'>
							<Link href='https://wautopilot.com/'>https://wautopilot.com/</Link>
						</Box>
						. By accessing this website, you agree to abide by these terms and conditions. If you do
						not agree with any part of these terms, please refrain from using Wautopilot.
					</Text>
				</section>
				<section id='use' className='pt-6'>
					<Text fontSize={'1.5rem'} fontWeight={'medium'}>
						<Box as='span' className='text-primary-dark'>
							Interpretation
						</Box>
					</Text>
					<Text fontSize={'1.25rem'} pt={'1rem'}>
						The terms "Client," "You," and "Your" refer to the user of this website. "The Company,"
						"Ourselves," "We," "Our," and "Us" refer to Wautopilot. "Party," "Parties," or "Us"
						refer to both the Client and Wautopilot. Terms are interchangeable and include singular,
						plural, capitalization, and
					</Text>
				</section>
				<section id='cookies' className='pt-6'>
					<Text fontSize={'1.5rem'} fontWeight={'medium'}>
						<Box as='span' className='text-primary-dark'>
							Cookies
						</Box>
					</Text>
					<Text fontSize={'1.25rem'} pt={'1rem'}>
						We use cookies in accordance with Wautopilot’s Privacy Policy. Cookies enhance website
						functionality, making it easier for visitors. Some affiliate/advertising partners may
						also use cookies.
					</Text>
				</section>
				<section id='license' className='pt-6'>
					<Text fontSize={'1.5rem'} fontWeight={'medium'}>
						<Box as='span' className='text-primary-dark'>
							License
						</Box>
					</Text>
					<Text fontSize={'1.25rem'} pt={'1rem'}>
						Unless stated otherwise, Wautopilot and/or its licensors own the intellectual property
						rights for all content on Wautopilot. Access is granted for personal use, subject to
						restrictions outlined in these terms and conditions.
					</Text>
				</section>
				<section id='comments' className='pt-6'>
					<Text fontSize={'1.5rem'} fontWeight={'medium'}>
						<Box as='span' className='text-primary-dark'>
							Comments
						</Box>
					</Text>
					<Text fontSize={'1.25rem'} pt={'1rem'}>
						Certain areas allow users to post opinions. Wautopilot does not filter or review
						comments before posting, and comments reflect users' opinions. Wautopilot reserves the
						right to monitor and remove inappropriate, offensive, or policy-violating comments.
					</Text>
				</section>
				<section id='hyperlink' className='pt-6'>
					<Text fontSize={'1.5rem'} fontWeight={'medium'}>
						<Box as='span' className='text-primary-dark'>
							Hyperlinking to our Content
						</Box>
					</Text>
					<Text fontSize={'1.25rem'} pt={'1rem'}>
						Certain organizations may link to our website without written approval:
						<ul>
							<li>- Government agencies</li>
							<li>- Search engines</li>
							<li>- News organizations</li>
							<li>- Online directory distributors</li>
							<li>- Systemwide Accredited Businesses</li>
						</ul>
						Other organizations may request approval for linking. Approved organizations may
						hyperlink to our website using our corporate name or URL.
					</Text>
				</section>
				<section id='iframes' className='pt-6'>
					<Text fontSize={'1.5rem'} fontWeight={'medium'}>
						<Box as='span' className='text-primary-dark'>
							iFrames
						</Box>
					</Text>
					<Text fontSize={'1.25rem'} pt={'1rem'}>
						Creating frames around our webpages without prior approval is not allowed.
					</Text>
				</section>
				<section id='content-liability' className='pt-6'>
					<Text fontSize={'1.5rem'} fontWeight={'medium'}>
						<Box as='span' className='text-primary-dark'>
							Content Liability
						</Box>
					</Text>
					<Text fontSize={'1.25rem'} pt={'1rem'}>
						We are not responsible for content on external websites linking to us. You agree to
						defend us against claims arising from your website.
					</Text>
				</section>
				<section id='reservation' className='pt-6'>
					<Text fontSize={'1.5rem'} fontWeight={'medium'}>
						<Box as='span' className='text-primary-dark'>
							Reservation of Rights
						</Box>
					</Text>
					<Text fontSize={'1.25rem'} pt={'1rem'}>
						We reserve the right to request link removal or amend these terms at any time. Continued
						linking implies agreement with these terms.
					</Text>
				</section>
				<section id='removal' className='pt-6'>
					<Text fontSize={'1.5rem'} fontWeight={'medium'}>
						<Box as='span' className='text-primary-dark'>
							Removal of Links from our Website
						</Box>
					</Text>
					<Text fontSize={'1.25rem'} pt={'1rem'}>
						Requests to remove offensive links are welcome, but we’re not obligated to respond or
						comply.
					</Text>
				</section>
				<section id='disclaimer' className='pt-6'>
					<Text fontSize={'1.5rem'} fontWeight={'medium'}>
						<Box as='span' className='text-primary-dark'>
							Disclaimer
						</Box>
					</Text>
					<Text fontSize={'1.25rem'} pt={'1rem'}>
						To the maximum extent permitted by law, we exclude liability for the correctness,
						completeness, availability, or timeliness of the website and its content.
					</Text>
				</section>
			</main>
		</Box>
	);
}
