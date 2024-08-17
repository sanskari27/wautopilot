import Each from '@/components/containers/each';
import { HomeNavbar } from '@/components/elements/Navbar';
import Footer from '@/components/elements/footer';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { InfiniteMovingCards } from '@/components/ui/testimonials';
import { WHO } from '@/lib/consts';
import ExtraService from '@/services/extra.service';
import Image from 'next/image';
import Link from 'next/link';
import { FaPhoneAlt, FaRobot } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';
import { MdContactMail } from 'react-icons/md';
import { PiBroadcastFill } from 'react-icons/pi';
import { RiInbox2Line } from 'react-icons/ri';
import { TbMessageCheck } from 'react-icons/tb';
import HERO_IMG from '../../public/images/hero_image.svg';

export default async function Home() {
	const faqList = await ExtraService.getFAQs();
	const testimonialList = await ExtraService.getTestimonials();

	return (
		<div className='h-screen overflow-x-hidden overflow-y-scroll pt=[70px] min-h-screen'>
			<HomeNavbar />
			<main className='px-6 md:px-[5%]'>
				<section id='home' className='min-h-[70vh]'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-x-16 items-center justify-center md:mt-[15%] auto-rows-fr'>
						<div>
							<div className='text-center md:text-left mt-[20%] md:mt-0'>
								<p className='text-[2rem] md:text-[2.5rem] font-medium'>
									<span className='text-primary'>Transform</span> Your Business
								</p>
								<p className='font-medium text-[2rem] md:text-[2.5rem]'>
									with <span className='text-primary'>Wautopilot&apos;s </span>
									Official <span className='text-primary'>WhatsApp </span>
									API
								</p>
								<p className='text-[1rem] md:text-[1.25rem] mt-4'>
									Revolutionize customer engagement with seamless bulk messaging and personalized
									chatbots—join Wautopilot today!
								</p>
								<Link href='auth/login'>
									<Button className='!bg-primary !text-white rounded-full mt-[2rem] text-[1.25rem]'>
										<FaArrowRightLong className='mr-4' />
										<span>Try Now</span>
									</Button>
								</Link>
							</div>
						</div>
						<div className='mx-auto'>
							<Image
								src={HERO_IMG}
								alt='Hero Image'
								className='h-[90%]  max-h-[500px] w-[100%]  max-w-[500px] mt-[5%] md:mt-0'
							/>
						</div>
					</div>
				</section>
				<section id='works' className='py-[7%] md:py-[4%]'>
					<p className='text-4xl text-center text-primary mb-[5rem] md:mb-0 font-bold'>
						What we do
					</p>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12 mt-[5%] auto-rows-fr'>
						<div>
							<div className='drop-shadow-mds shadow-md bg-gray-50 h-full p-8 rounded-2xl relative'>
								<div className='absolute -top-8 rounded-full border-[3px] p-1 border-primary-dark'>
									<PiBroadcastFill size={'3rem'} color='#0B826F' />
								</div>
								<p className='text-2xl mt-4 text-primary'>
									Bulk Marketing
									<br /> Broadcast Messages
								</p>
								<p className='mt-4 text-lg'>
									Send bulk WhatsApp message notifications to 1000s of phone numbers at once using
									one of your pre-approved message templates.
								</p>
							</div>
						</div>
						<div>
							<div className='drop-shadow-mds shadow-md bg-gray-50 h-full p-8 rounded-2xl relative'>
								<div className='absolute -top-8 rounded-full border-[3px] p-2 border-primary-dark'>
									<FaRobot size={'2.5rem'} color='#0B826F' />
								</div>
								<p className='mt-4 text-primary text-2xl'>Automated Chat Bots</p>
								<p className='mt-4 text-lg'>
									Enhance engagement with chatbots that handle inquiries, provide instant responses,
									and ensure 24/7 support without manual intervention.
								</p>
							</div>
						</div>
						<div>
							<div className='drop-shadow-mds shadow-md bg-gray-50 h-full p-8 rounded-2xl relative'>
								<div className='absolute -top-8 rounded-full border-[3px] p-2 border-primary-dark'>
									<RiInbox2Line size={'2.5rem'} color='#0B826F' />
								</div>
								<p className='text-2xl mt-4 text-primary'>WhatsApp Inbox</p>
								<p className='mt-4 text-lg'>
									Intuitive WhatsApp inbox for seamless 2-way communication with your contacts.
									Multi-agent support to allow you to add your team members
								</p>
							</div>
						</div>
					</div>
				</section>
				<section id='who' className='py-[7%] md:py-[4%] md:px-[5%]'>
					<p className='text-4xl font-bold text-center text-primary'>Who We are</p>
					<div className='mt-[5%]'>
						<div className='flex-col md:flex-row flex items-center justify-between w-full'>
							<div className='w-1/2 md:w-1/3'>
								<Image src={WHO} alt='Who we are' width={400} height={400} />
							</div>
							<div className='text-left md:text-right'>
								<p className='text-3xl md:text-5xl mt-4 text-black'>
									We Provide <span className='text-primary'>Whatsapp</span>
								</p>
								<p className='text-3xl md:text-5xl mt-2 text-primary'>Business API</p>

								<ul className='end_dot text-sm md:text-lg mt-[2rem] flex flex-col gap-2 ml-3 md:ml-0'>
									<li>Share Great Deals with Everyone Instantly</li>
									<li>Template Messages Approvals</li>
									<li>Streamline Messaging with Automated Connections</li>
									<li>Boost Support Have Many Agents Help Customers in Live Chat</li>
									<li>Make Chatbots for Round-the-Clock Help and Engagement</li>
								</ul>
							</div>
						</div>
					</div>
				</section>
				<section id='how' className='py-[7%] md:py-[4%]'>
					<p className='text-center text-primary mb-[5rem] md:mb-0 text-4xl font-bold'>
						How it works
					</p>

					<div className='grid grid-cols-1 md:grid-cols-4  gap-x-12 gap-y-6 mt-[5%]'>
						<div>
							<div>
								<div className='flex justify-center'>
									<FaPhoneAlt color='#0B826F' size={'3rem'} />
								</div>
								<p className='!text-lg !md:text-2xl text-primary text-center mt-[2rem]'>
									Setup Your Phone <br /> Number
								</p>
								<div className='mt-[1.25rem] md:text-lg text-justify'>
									Setup your phone number with the WhatsApp API using our simple embedded signup
									flow or generate your own custom API credentials on Meta portal to do the setup
								</div>
							</div>
						</div>
						<div>
							<div>
								<div className='flex justify-center'>
									<TbMessageCheck color='#0B826F' size={'3rem'} />
								</div>
								<p className='!text-lg !md:text-2xl text-primary text-center mt-[2rem]'>
									Create a Message <br /> Template
								</p>
								<div className='text-lg mt-[1.25rem] md:text-lg text-justify'>
									Create a text-only or media-based message template and get it approved by
									WhatsApp. Once approved, your template will be ready to be sent to your contacts.
								</div>
							</div>
						</div>
						<div>
							<div>
								<div className='flex justify-center'>
									<MdContactMail color='#0B826F' size={'3rem'} />
								</div>
								<p className='!text-lg !md:text-2xl text-primary text-center mt-[2rem]'>
									Add or Import Your <br /> Contacts
								</p>
								<div className='text-lg mt-5 md:text-lg text-justify'>
									Manually add your contacts, import them in bulk using CSV file import or add them
									from any of your website or 3rd party app using our API feature.
								</div>
							</div>
						</div>
						<div>
							<div>
								<div className='flex justify-center'>
									<PiBroadcastFill color='#0B826F' size={'3rem'} />
								</div>
								<p className=' text-2xl text-primary text-center mt-[2rem]'>
									Create & Send a <br /> Notification
								</p>
								<div className='text-lg mt-5 text-justify'>
									Create a new bulk marketing notification or trigger based transactional
									notification and setup how you want the notification to be sent.
								</div>
							</div>
						</div>
					</div>
				</section>
				<section hidden={(testimonialList ?? []).length === 0} id='testimonials'>
					<div className='h-[40rem] rounded-md flex flex-col antialiased bg-transparent items-center justify-center relative overflow-hidden'>
						<InfiniteMovingCards items={testimonialList ?? []} direction='right' speed='slow' />
					</div>
				</section>
				<section></section>
				<section
					hidden={(faqList ?? []).length === 0}
					id='faq'
					className='py-[7%] md:py-[4%] px-0 md:px-[7%]'
				>
					<p className='text-center text-primary text-4xl font-bold'>FAQ</p>
					<div className='mt-[5%]'>
						<Accordion type={'single'} collapsible className='w-full'>
							<Each
								items={faqList ?? []}
								render={(item, index) => (
									<AccordionItem value={index.toString()}>
										<AccordionTrigger className='text-xl'>{item.title}</AccordionTrigger>
										<AccordionContent>{item.info}</AccordionContent>
									</AccordionItem>
								)}
							/>
						</Accordion>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
