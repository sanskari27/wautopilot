import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	Center,
	Flex,
	Grid,
	GridItem,
	Heading,
	Image,
	Text,
} from '@chakra-ui/react';
import { FaPhoneAlt, FaRobot } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';
import { MdContactMail } from 'react-icons/md';
import { PiBroadcastFill } from 'react-icons/pi';
import { RiInbox2Line } from 'react-icons/ri';
import { TbMessageCheck } from 'react-icons/tb';
import { HERO_IMG } from '../../../assets/Images';
import { WHO } from '../../../config/const';
import Footer from '../../components/footer';
import HomeNavbar from '../../components/navbar/homeNavbar';
import Each from '../../components/utils/Each';

const FAQs = [
	{
		title: 'What is WhatsApp Business API?',
		info: 'WhatsApp Business API is a solution that allows businesses to communicate with their customers on the WhatsApp platform at scale. It provides advanced features and capabilities for businesses to send notifications, provide customer support, and engage with users.',
	},
	{
		title: 'What types of payment do you accept?',
		info: 'We accept payments from all credit cards enabled for international online transactions. You can also pay through bank transfers if you choose an annual plan.',
	},
	{
		title: 'How do I get started with WhatsApp Business API?',
		info: 'To get started with WhatsApp Business API, you need to sign up for a Wautopilot account. Once you have signed up, you can create a WhatsApp Business API account and start sending messages to your customers.',
	},
	{
		title: 'Are there any hidden fees in your pricing structure?',
		info: 'We believe in transparency, and there are no hidden fees in our pricing structure. What you see is what you get. Our pricing is straightforward, and we provide detailed information about the costs associated with each plan.',
	},
	{
		title: 'Do you have any cancellation fees?',
		info: 'No, Watopilot is a pay-as-you-go service, and we do not have any cancellation fees. You can cancel your plan at any time. However, we do not provide any refunds on payments made for your existing subscription or credits',
	},
	{
		title:
			'Are there any limitations on the number of contacts I can reach with the basic pricing plan?',
		info: 'Our pricing plans come with different contact limits to cater to businesses of all sizes. The basic plan has a specified contact limit, but if your needs exceed that, we offer scalable options and can discuss a tailored plan to accommodate your specific requirements.',
	},
	{
		title: 'What does WhatsApp conversational-based pricing mean if WhatsApp is free?',
		info: "While regular WhatsApp usage is free, businesses using WhatsApp Business API to grow their business will incur charges for sending customer messages. WhatsApp conversation pricing depends on your customer's country code and your message template.",
	},
];

export default function Home() {
	return (
		<Box className='h-screen overflow-x-hidden overflow-y-scroll pt=[70px]'>
			<HomeNavbar />
			<main className='px-6 md:px-[5%]'>
				<section id='home' className='min-h-[70vh]'>
					<Grid
						className='grid-cols-1 md:grid-cols-2 gap-x-16 items-center justify-center md:mt-[15%]'
						gridAutoRows={'1fr'}
					>
						<GridItem>
							<Box className='text-center md:text-left mt-[20%] md:mt-0'>
								<Text fontWeight={'medium'} className='text-[2rem] md:text-[2.5rem]'>
									<Box as='span' className='text-primary-dark'>
										Transform
									</Box>{' '}
									Your Business
								</Text>
								<Text fontWeight={'medium'} className='text-[2rem] md:text-[2.5rem]'>
									with{' '}
									<Box as='span' className='text-primary-dark'>
										Wautopilot's{' '}
									</Box>
									Official{' '}
									<Box as='span' className='text-primary-dark'>
										WhatsApp{' '}
									</Box>
									API
								</Text>
								<Text className='text-[1rem] md:text-[1.25rem] mt-4'>
									Revolutionize customer engagement with seamless bulk messaging and personalized
									chatbots—join Wautopilot today!
								</Text>
								<Button
									rightIcon={<FaArrowRightLong />}
									className='!bg-primary-dark !text-white'
									rounded={'full'}
									marginTop={'2rem'}
									fontSize={'1.25rem'}
								>
									Try Now
								</Button>
							</Box>
						</GridItem>
						<GridItem marginX={'auto'}>
							<Image
								src={HERO_IMG}
								alt='Hero Image'
								className='h-[90%]  max-h-[500px] w-[100%]  max-w-[500px] mt-[5%] md:mt-0'
							/>
						</GridItem>
					</Grid>
				</section>
				<section id='works' className='py-[7%] md:py-[4%]'>
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
									Enhance engagement with chatbots that handle inquiries, provide instant responses,
									and ensure 24/7 support without manual intervention.
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
				<section id='who' className='py-[7%] md:py-[4%] md:px-[5%]'>
					<Heading className='text-center text-primary-dark'>Who We are</Heading>
					<Box marginTop={'5%'}>
						<Flex
							width={'full'}
							justifyContent={'space-between'}
							alignItems={'center'}
							className='flex-col md:flex-row'
						>
							<Box className='w-1/2 md:w-1/3'>
								<Image src={WHO} alt='Who we are' width={400} height={400} />
							</Box>
							<Box className='text-left md:text-right'>
								<Heading className='text-3xl md:text-5xl mt-4 text-black'>
									We Provide <span className='text-primary-dark'>Whatsapp</span>
								</Heading>
								<Heading className='text-3xl md:text-5xl mt-2 text-primary-dark'>
									Business API
								</Heading>

								<ul className='end_dot text-sm md:text-lg mt-[2rem] flex flex-col gap-2 ml-3 md:ml-0'>
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
				<section id='faq' className='py-[7%] md:py-[4%] px-0 md:px-[7%] hidden'>
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
