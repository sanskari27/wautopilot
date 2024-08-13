import { LOGO_WHITE } from '@/lib/consts';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
	return (
		<footer className='bg-primary text-accent px-[5%]'>
			<div className='pt-16 pb-4 px-4%'>
				<div className='w-full flex flex-col md:flex-row text-center md:text-left gap-12 md:gap-8'>
					<div className='w-full md:w-1/3'>
						<div className='w-full flex flex-col items-center md:items-start'>
							<div className='w-full flex justify-center md:justify-start items-end gap-3'>
								<Image src={LOGO_WHITE} alt='Logo' className='w-10 h-10' width={40} height={40} />
								<p className='text-accent font-bold text-2xl'>Wautopilot</p>
							</div>
							<div className='mx-auto md:mx-0 w-full md:w-[500px] pt-4'>
								<p>WhatsApp Engagement Platform</p>
								<p className='pt-2'>Made with ❤️ in India</p>
							</div>
						</div>
					</div>
					<div className='w-full md:w-1/3 flex flex-col text-center items-center md:items-end md:text-right'>
						<p className='underline underline-offset-8 font-medium'>Support</p>
						<div className='mt-2'>
							<Link className='hover:text-slate-200' href='/terms'>
								<p>Terms & Conditions</p>
							</Link>
							<Link className='hover:text-slate-200' href='/privacy'>
								<p>Privacy Policy</p>
							</Link>
							<Link className='hover:text-slate-200' href='/disclaimer'>
								<p>Disclaimer</p>
							</Link>
							<Link
								className='hover:text-slate-200'
								href='https://api.whatsapp.com/send/?phone=919654308000&text&type=phone_number&app_absent=0'
							>
								<p>Contact Us</p>
							</Link>
						</div>
					</div>
					<div className='w-full md:w-1/3 flex flex-col items-center md:items-end text-center md:text-right gap-0'>
						<p className='underline underline-offset-8 font-medium'>Get in touch</p>
						<p className='mt-2'>Stellar Coaching & Consulting</p>
						<p>B-502, Sahara Apartment, Plot No. 11,</p>
						<p>Sector 6 Dwarka, Dwarka,</p>
						<p>New Delhi, Delhi 110075, India</p>
					</div>
				</div>
				<div className='flex flex-col md:flex-row items-center justify-center mt-8 w-full'>
					<p className='px-4 text-center'>© 2024 Wautopilot, All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
