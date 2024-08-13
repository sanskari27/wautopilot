import { Metadata } from "next";

export const metadata: Metadata = {
	title: 'Terms & Conditions • Wautopilot',
};

export default function Privacy() {
	return (
		<div className='p-6 md:px-[5%]'>
			<section id='heading' className=' pt-[70px]'>
				<h1 className='text-primary text-2xl md:text-4xl font-bold'>Terms and Conditions</h1>
			</section>
			<section id='terms'>
				<div className='font-lg pt-4'>
					<p className='text-lg font-medium'>Welcome to Wautopilot!</p>
					<p>
						These terms and conditions govern your use of the Wautopilot website, located at
						https://wautopilot.com/. By accessing or using this website, you agree to comply with
						these terms and conditions. If you disagree with any part of these terms, please do not
						use Wautopilot.
					</p>
				</div>
			</section>
			<section id='cookies'>
				<div className='font-lg pt-4'>
					<p className='text-lg font-medium'>Cookies</p>
					<p>
						We use cookies in accordance with Wautopilot’s Privacy Policy. Cookies are small files
						stored on your device that enhance the functionality and user experience of our website.
						They help us remember your preferences, understand how you use our site, and provide
						personalized content. Some of our affiliate and advertising partners may also use
						cookies.
					</p>
				</div>
			</section>
			<section id='license'>
				<div className='font-lg pt-4'>
					<p className='text-lg font-medium'>License</p>
					<p>
						Unless otherwise stated, Wautopilot and/or its licensors own the intellectual property
						rights for all content on Wautopilot. All intellectual property rights are reserved. You
						may access this from Wautopilot for your own personal use subjected to restrictions set
						in these terms and conditions.
					</p>
					<p>
						You must not:
						<ul>
							<li>- Republish material from Wautopilot</li>
							<li>- Sell, rent, or sub-license material from Wautopilot</li>
							<li>- Reproduce, duplicate, or copy material from Wautopilot</li>
							<li>- Redistribute content from Wautopilot</li>
						</ul>
					</p>
				</div>
			</section>
			<section id='user-accounts'>
				<div className='font-lg pt-4'>
					<p className='text-lg font-medium'>User Accounts</p>
					<p>
						When you create an account with us, you must provide accurate, complete, and current
						information at all times. Failure to do so constitutes a breach of the Terms, which may
						result in immediate termination of your account on our Service. You are responsible for
						safeguarding the password that you use to access the Service and for any activities or
						actions under your password, whether your password is with our Service or a third-party
						service.
					</p>
				</div>
			</section>
			<section id='hyperlinking'>
				<div className='font-lg pt-4'>
					<p className='text-lg font-medium'>Hyperlinking to Our Content</p>
					<p>
						The following organizations may link to our website without prior written approval:
						<ul>
							<li>- Government agencies</li>
							<li>- Search engines</li>
							<li>- News organizations</li>
							<li>- Online directory distributors</li>
							<li>
								- Systemwide Accredited Businesses except soliciting non-profit organizations,
								charity shopping malls, and charity fundraising groups which may not hyperlink to
								our website.
							</li>
						</ul>
					</p>
					<p>
						These organizations may link to our home page, to publications, or to other website
						information so long as the link: (a) is not in any way deceptive; (b) does not falsely
						imply sponsorship, endorsement, or approval of the linking party and its products or
						services; and (c) fits within the context of the linking party’s site.
					</p>
					<p>
						Other organizations may request approval to link to our website. Approved organizations
						may hyperlink to our website using our corporate name or URL.
					</p>
				</div>
			</section>
			<section id='iframes'>
				<div className='font-lg pt-4'>
					<p className='text-lg font-medium'>iFrames</p>
					<p>
						Without prior approval and written permission, you may not create frames around our
						Webpages that alter in any way the visual presentation or appearance of our website.
					</p>
				</div>
			</section>
			<section id='content-liability'>
				<div className='font-lg pt-4'>
					<p className='text-lg font-medium'>Content Liability</p>
					<p>
						We shall not be held responsible for any content that appears on your website. You agree
						to protect and defend us against all claims that are arising on your website. No link(s)
						should appear on any website that may be interpreted as libelous, obscene, or criminal,
						or which infringes, otherwise violates, or advocates the infringement or other violation
						of, any third-party rights.
					</p>
				</div>
			</section>
			<section id='user-generated-content'>
				<div className='font-lg pt-4'>
					<p className='text-lg font-medium'>User-Generated Content</p>
					<p>
						Users may post content on our website, including comments, feedback, and other
						information. By posting content, you grant Wautopilot a non-exclusive, worldwide,
						royalty-free, irrevocable license to use, reproduce, modify, publish, and distribute
						such content in any and all media. You are solely responsible for the content you post
						and must ensure that it does not violate any laws or infringe on any third-party rights.
					</p>
				</div>
			</section>
			<section id='prohibited-activities'>
				<div className='font-lg pt-4'>
					<p className='text-lg font-medium'>Prohibited Activities</p>
					<p>
						You agree not to use the website for any unlawful purpose or any purpose prohibited
						under this clause. You agree not to use the website in any way that could damage the
						website, the services, or the general business of Wautopilot. Prohibited activities
						include, but are not limited to:
						<ul>
							<li>- Hacking, phishing, or spamming</li>
							<li>- Distributing malware or other harmful software</li>
							<li>- Infringing on the intellectual property rights of Wautopilot or others</li>
							<li>- Engaging in fraudulent or misleading activities</li>
							<li>- Collecting personal information from other users without consent</li>
						</ul>
					</p>
				</div>
			</section>
			<section id='termination'>
				<div className='font-lg pt-4'>
					<p className='text-lg font-medium'>Termination</p>
					<p>
						We may terminate or suspend your account and bar access to the Service immediately,
						without prior notice or liability, under our sole discretion, for any reason whatsoever
						and without limitation, including but not limited to a breach of the Terms. If you wish
						to terminate your account, you may simply discontinue using the Service.
					</p>
				</div>
			</section>
			<section id='indemnification'>
				<div className='font-lg pt-4'>
					<p className='text-lg font-medium'>Indemnification</p>
					<p>
						You agree to indemnify, defend, and hold harmless Wautopilot, its officers, directors,
						employees, agents, and third parties, for any losses, costs, liabilities, and expenses
						(including reasonable attorney’s fees) relating to or arising out of your use of or
						inability to use the Service, any user postings made by you, your violation of any terms
						of this Agreement, your violation of any rights of a third party, or your violation of
						any applicable laws, rules or regulations.
					</p>
				</div>
			</section>
			<section id='limitation-of-liability'>
				<div className='font-lg pt-4'>
					<p className='text-lg font-medium'>Limitation of Liability</p>
					<p>
						In no event shall Wautopilot, nor its directors, employees, partners, agents, suppliers,
						or affiliates, be liable for any indirect, incidental, special, consequential, or
						punitive damages, including without limitation, loss of profits, data, use, goodwill, or
						other intangible losses, resulting from (i) your access to or use of or inability to
						access or use the Service; (ii) any conduct or content of any third party on the
						Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use,
						or alteration of your transmissions or content, whether based on warranty, contract,
						tort (including negligence) or any other legal theory, whether or not we have been
						informed of the possibility of such damage, and even if a remedy set forth herein is
						found to have failed of its essential purpose.
					</p>
				</div>
			</section>
			<section id='disclaimer'>
				<div className='font-lg pt-4'>
					<p className='text-lg font-medium'>Disclaimer</p>
					<p>
						Your use of the Service is at your sole risk. The Service is provided on an &quot;AS
						IS&quot; and &quot;AS AVAILABLE&quot; basis. The Service is provided without warranties
						of any kind, whether express or implied, including, but not limited to, implied
						warranties of merchantability, fitness for a particular purpose, non-infringement, or
						course of performance.
					</p>
					<p>
						Wautopilot does not warrant that (a) the Service will function uninterrupted, secure, or
						available at any particular time or location; (b) any errors or defects will be
						corrected; (c) the Service is free of viruses or other harmful components; or (d) the
						results of using the Service will meet your requirements.
					</p>
				</div>
			</section>
			<section id='changes-to-these-terms'>
				<div className='font-lg pt-4'>
					<p className='text-lg font-medium'>Changes to These Terms</p>
					<p>
						We reserve the right, at our sole discretion, to modify or replace these Terms at any
						time. If a revision is material, we will try to provide at least 30 days$apos; notice
						prior to any new terms taking effect. What constitutes a material change will be
						determined at our sole discretion. By continuing to access or use our Service after any
						revisions become effective, you agree to be bound by the revised terms. If you do not
						agree to the new terms, you are no longer authorized to use the Service.
					</p>
				</div>
			</section>
			<section id='effective-date'>
				<div className='font-lg pt-4'>
					<p className='text-lg font-medium'>Effective Date</p>
					<p>These Terms and Conditions are effective as of 17 May 2024.</p>
				</div>
			</section>
		</div>
	);
}
