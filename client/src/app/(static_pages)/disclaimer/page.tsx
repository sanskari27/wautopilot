import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Disclaimer • Wautopilot',
};

export default function Disclaimer() {
	return (
		<section id='disclaimer' className='my-[17%] px-6 md:px-[5%]'>
			<h1 className='text-primary text-2xl md:text-4xl font-bold'>Disclaimer</h1>
			<p className=' mt-6 text-md font-lg pt-4 text-justify'>
				This site is not a part of WhatsApp or Facebook / Meta. All mentioned names or logos are
				properties of their respective companies. The information provided on this website is for
				educational purposes only. We neither support nor can be held responsible for any misuse of
				this information. Wautopilot is not affiliated with any brand or website. Users must use the
				software responsibly and adhere to the terms of service and usage policies of WhatsApp.
				Wautopilot is a standalone tool designed to facilitate and extend certain functionalities
				within WhatsApp. It is not a spam tool and must not be used for spamming or violating
				WhatsApp policies. This tool automates natural human behaviors to save time in manually
				performing tasks and collecting data that is already publicly available. We do not take
				responsibility for how users employ this software. All users are expected to use Wautopilot
				in a lawful and ethical manner.
			</p>
		</section>
	);
}
