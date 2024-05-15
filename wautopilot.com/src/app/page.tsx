import HomeNavbar from '@/components/navbar/homeNavbar';
import Each from '@/components/utils/Each';
import { LOGO_WHITE, WHO } from '@/lib/const';
import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Center,
	Flex,
	Grid,
	GridItem,
	Heading,
	Text,
	VStack,
} from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPhoneAlt, FaRobot } from 'react-icons/fa';
import { MdContactMail } from 'react-icons/md';
import { PiBroadcastFill } from 'react-icons/pi';
import { RiInbox2Line } from 'react-icons/ri';
import { TbMessageCheck } from 'react-icons/tb';

const FAQs = [
	{
		title: 'Title 1',
		info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
	},
];

export default async function Home() {
	return (
		<Box className='h-screen overflow-x-hidden overflow-y-scroll pt=[70px]'>
			<HomeNavbar />
			<main className='px-6 md:px-[5%] '>
				<section id='home' className='h-[50vh]'>
					<Box>Home Page</Box>
				</section>
				<section id='what' className='py-[7%] md:py-[4%]'>
					<Heading className='text-center text-primary-dark mb-[5rem] md:mb-0'>What we do</Heading>
					<Grid
						className='grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12'
						marginTop={'5%'}
						gridAutoRows={'1fr'}
					>
						<GridItem>
							<Box
								className='drop-shadow-mds shadow-md bg-gray-50 h-full'
								padding={'2rem'}
								rounded={'2xl'}
								position={'relative'}
							>
								<Box className='absolute -top-8 rounded-full border-[3px] p-1 border-primary-dark'>
									<PiBroadcastFill size={'3rem'} color='#0B826F' />
								</Box>
								<Heading fontSize={'2xl'} className='mt-4 text-primary-dark'>
									Bulk Marketing
									<br /> Broadcast Messages
								</Heading>
								<Text marginTop={'1rem'} fontSize={'lg'}>
									Send bulk WhatsApp message notifications to 1000s of phone numbers at once using
									one of your pre-approved message templates.
								</Text>
							</Box>
						</GridItem>
						<GridItem>
							<Box
								className='drop-shadow-mds shadow-md bg-gray-50 h-full'
								padding={'2rem'}
								rounded={'2xl'}
								position={'relative'}
							>
								<Box className='absolute -top-8 rounded-full border-[3px] p-2 border-primary-dark'>
									<FaRobot size={'2.5rem'} color='#0B826F' />
								</Box>
								<Heading fontSize={'2xl'} className='mt-4 text-primary-dark'>
									Automated Chat Bots
								</Heading>
								<Text marginTop={'1rem'} fontSize={'lg'}>
									Intuitive WhatsApp inbox for seamless 2-way communication with your contacts.
									Multi-agent support to allow you to add your team members
								</Text>
							</Box>
						</GridItem>
						<GridItem>
							<Box
								className='drop-shadow-mds shadow-md bg-gray-50 h-full'
								padding={'2rem'}
								rounded={'2xl'}
								position={'relative'}
							>
								<Box className='absolute -top-8 rounded-full border-[3px] p-2 border-primary-dark'>
									<RiInbox2Line size={'2.5rem'} color='#0B826F' />
								</Box>
								<Heading fontSize={'2xl'} className='mt-4 text-primary-dark'>
									WhatsApp Inbox
								</Heading>
								<Text marginTop={'1rem'} fontSize={'lg'}>
									Intuitive WhatsApp inbox for seamless 2-way communication with your contacts.
									Multi-agent support to allow you to add your team members
								</Text>
							</Box>
						</GridItem>
					</Grid>
				</section>
				<section id='who' className='py-[7%] md:py-[4%] md:px-[10%]'>
					<Heading className='text-center text-primary-dark mb-[5rem] md:mb-0'>Who We are</Heading>
					<Box marginTop={'5%'}>
						<Flex
							width={'full'}
							justifyContent={'space-between'}
							alignItems={'center'}
							className='flex-col md:flex-row'
						>
							<Box className='w-1/2 md:w-1/2'>
								<Image src={WHO} alt='Who we are' width={300} height={300} />
							</Box>
							<Box className='text-right'>
								<Heading className='text-3xl md:text-5xl mt-4 text-black'>
									We Provide <span className='text-primary-dark'>Whatsapp</span>
								</Heading>
								<Heading className='text-3xl md:text-5xl mt-2 text-primary-dark'>
									Business API
								</Heading>

								<ul className='end_dot text-base md:text-2xl font-medium mt-[2rem] flex flex-col gap-2'>
									<li>Share Great Deals with Everyone Instantly</li>
									<li>Template Messages Approvals</li>
									<li>Streamline Messaging with Automated Connections</li>
									<li>Boost Support Have Many Agents Help Customers in Live Chat</li>
									<li>Make Chatbots for Round-the-Clock Help and Engagement</li>
								</ul>
							</Box>
						</Flex>
					</Box>
				</section>
				<section id='how' className='py-[7%] md:py-[4%]'>
					<Heading className='text-center text-primary-dark mb-[5rem] md:mb-0'>
						How it works
					</Heading>

					<Grid className='grid-cols-1 md:grid-cols-4  gap-x-12 gap-y-6' marginTop={'5%'}>
						<GridItem>
							<Box>
								<Center>
									<FaPhoneAlt color='#0B826F' size={'3rem'} />
								</Center>
								<Heading
									marginTop={'2rem'}
									className='!text-lg !md:text-2xl text-primary-dark text-center'
								>
									Setup Your Phone <br /> Number
								</Heading>
								<Box className=' md:text-lg text-justify' marginTop={'1.25rem'}>
									Setup your phone number with the WhatsApp API using our simple embedded signup
									flow or generate your own custom API credentials on Meta portal to do the setup
								</Box>
							</Box>
						</GridItem>
						<GridItem>
							<Box>
								<Center>
									<TbMessageCheck color='#0B826F' size={'3rem'} />
								</Center>
								<Heading
									marginTop={'2rem'}
									className='!text-lg !md:text-2xl text-primary-dark text-center'
								>
									Create a Message <br /> Template
								</Heading>
								<Box fontSize='lg' className=' md:text-lg text-justify' marginTop={'1.25rem'}>
									Create a text-only or media-based message template and get it approved by
									WhatsApp. Once approved, your template will be ready to be sent to your contacts.
								</Box>
							</Box>
						</GridItem>
						<GridItem>
							<Box>
								<Center>
									<MdContactMail color='#0B826F' size={'3rem'} />
								</Center>
								<Heading
									marginTop={'2rem'}
									className='!text-lg !md:text-2xl text-primary-dark text-center'
								>
									Add or Import Your <br /> Contacts
								</Heading>
								<Box fontSize='lg' className=' md:text-lg text-justify' marginTop={'1.25rem'}>
									Manually add your contacts, import them in bulk using CSV file import or add them
									from any of your website or 3rd party app using our API feature.
								</Box>
							</Box>
						</GridItem>
						<GridItem>
							<Box>
								<Center>
									<PiBroadcastFill color='#0B826F' size={'3rem'} />
								</Center>
								<Heading
									fontSize={'2xl'}
									marginTop={'2rem'}
									className='text-primary-dark text-center'
								>
									Create & Send a <br /> Notification
								</Heading>
								<Box fontSize='lg' className='text-justify' marginTop={'1.25rem'}>
									Create a new bulk marketing notification or trigger based transactional
									notification and setup how you want the notification to be sent.
								</Box>
							</Box>
						</GridItem>
					</Grid>
				</section>
				<section id='faq' className='py-[7%] md:py-[4%] px-0 md:px-[7%]'>
					<Heading className='text-center text-primary-dark '>FAQ</Heading>
					<Box marginTop={'5%'}>
						<Accordion className='border-primary-dark' allowToggle>
							<Each
								items={FAQs}
								render={(item) => (
									<AccordionItem>
										<h2>
											<AccordionButton>
												<Box
													as='span'
													flex='1'
													textAlign='left'
													className='text-primary-dark font-medium'
												>
													{item.title}
												</Box>
												<AccordionIcon />
											</AccordionButton>
										</h2>
										<AccordionPanel pb={4}>{item.info}</AccordionPanel>
									</AccordionItem>
								)}
							/>
						</Accordion>
					</Box>
				</section>
			</main>
			<Footer />
		</Box>
	);
}

function Footer() {
	return (
		<footer className='bg-primary-dark text-accent'>
			<Box pt={'4rem'} pb='1rem' paddingX={'4%'}>
				<Flex
					width='full'
					className='flex-col md:flex-row text-center md:text-left  gap-12 md:gap-0'
				>
					<Box width='full'>
						<VStack width='full'>
							<Box width='full'>
								<Flex
									alignItems={'end'}
									className='justify-center md:justify-start'
									gap={'0.75rem'}
								>
									<Image src={LOGO_WHITE} alt='Logo' width={40} height={40} className=' h-[40px]' />
									<Text fontSize={'2xl'} className='text-accent font-bold text-2xl'>
										Wautopilot
									</Text>
								</Flex>
								<Box className='mx-auto md:mx-0 w-full md:w-[350px]'>
									lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
									Ipsum
								</Box>
							</Box>
						</VStack>
					</Box>
					<VStack className='w-full md:w-2/5' justifyContent={'end'}>
						<Grid className='grid-cols-1 md:grid-cols-2  font-medium text-lg text-center md:text-right gap-y-1 gap-x-9'>
							<GridItem>
								<Link href={'/products'}>
									<Text>Products</Text>
								</Link>
							</GridItem>
							<GridItem>
								<Link href={'/terms'}>
									<Text>Terms & Conditions</Text>
								</Link>
							</GridItem>
							<GridItem>
								<Link href={'/about'}>
									<Text>About Keeth</Text>
								</Link>
							</GridItem>
							<GridItem>
								<Link href={'/privacy'}>
									<Text>Privacy Policy</Text>
								</Link>
							</GridItem>
							<GridItem>
								<Link href={'mailto:keethjewels@gmail.com'} target='_blank'>
									<Text>Contact us</Text>
								</Link>
							</GridItem>
							<GridItem>
								<Link href={'/returns'}>
									<Text>Return Policy</Text>
								</Link>
							</GridItem>
							<GridItem>
								<Link href={'/about'}>
									<Text>Connect via Whatsapp</Text>
								</Link>
							</GridItem>
							<GridItem>
								<Link href={'/shipping-policy'}>
									<Text>Shipping Policy</Text>
								</Link>
							</GridItem>
						</Grid>
					</VStack>
				</Flex>
				<Flex
					className='flex-col md:flex-row items-center '
					width={'full'}
					justifyContent={'center'}
					marginTop={'2rem'}
				>
					<Text className='border-r-0 md:border-r px-4'>© wautopilot 2024</Text>
					<Link
						href={'/terms'}
						className='underline px-4 border-r-0 md:border-r underline-offset-4'
					>
						<Text>Terms & Conditions</Text>
					</Link>
					<Link href={'/terms'} className='underline px-4 underline-offset-4'>
						<Text>Privacy Policy</Text>
					</Link>
				</Flex>
			</Box>
		</footer>
	);
}
