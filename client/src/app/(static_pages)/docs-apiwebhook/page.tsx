import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Metadata } from 'next';
import Image from 'next/image';
import CodeBlocks from '../_components/codeBlock';

export const metadata: Metadata = {
	title: 'Privacy Policy • Wautopilot',
};

export default function APIWebhook() {
	return (
		<section className='p-6 md:px-[5%]'>
			<section id='heading' className=' pt-[70px]'>
				<h1 className='text-primary text-2xl md:text-4xl font-bold'>Wautopilot API</h1>
			</section>
			<Tabs defaultValue='API' className='mt-4'>
				<TabsList>
					<TabsTrigger value='API'>API</TabsTrigger>
					<TabsTrigger value='webhook'>Webhook</TabsTrigger>
				</TabsList>
				<TabsContent value='API'>
					<div>
						<p className='text-lg pt-4'>
							1. After logging in go to https://wautopilot.com/panel/home/api-webhook
						</p>
					</div>
					<section id='terms' className='grid grid-cols-1 md:grid-cols-2 justify-center items-end'>
						<div className='flex flex-col justify-between gap-4'>
							<p className='text-lg pt-4'>2. Generate an API key for your WhatsApp Business API.</p>
							<Image
								src='/images/create_api.jpg'
								alt='API'
								width={1200}
								height={1200}
								className='md:w-3/4 mx-auto'
							/>
						</div>
						<div className='flex flex-col justify-between gap-4'>
							<p className='text-lg pt-4'>3. Enter your name and select WhatsApp number..</p>
							<Image
								src='/images/details_api.png'
								alt='API'
								width={1200}
								height={1200}
								className='md:w-3/4 mx-auto'
							/>
						</div>
						<div className='md:col-span-2'>
							<p className='text-lg pt-4'>4. This token will be used for authentication.</p>
							<Image
								src='/images/Untitled design.png'
								alt='API'
								width={1200}
								height={1200}
								className='md:w-3/4 mx-auto'
							/>
							<p className='font-bold'>
								{' '}
								*You will not be able to view this token after the dialog is closed and thus it must
								be regenerated.
							</p>
						</div>
					</section>
					<section id='text-message'>
						<Separator className='w-full' />
						<div>
							<p className='text-2xl pt-4 font-medium'>Send Message</p>
						</div>
						<div>
							<div>
								<p className='text-lg pt-4 font-medium'>Text Message</p>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<Separator className='w-3/4' />
									<p className='mt-4'>Sends a service text message</p>
								</div>
								<CodeBlocks
									title='Request Example'
									code={`curl --location 'https://api.wautopilot.com/v1/message/send-message' 
--header 'Authorization: Bearer tokenxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' 
--header 'Content-Type: application/json' 
--data '{
    "message":{
        "type":"text",
        "text":"Hello There"
    },
    "recipient":"91XXXXXXXXXX"
}'`}
									language={'bash'}
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<p className='mt-4 text-lg'>Arguments:</p>
									<Separator className='w-3/4 my-4' />
									<p className=''>
										type: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										text: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<p>Message you want to send.</p>
									<Separator className='w-3/4 my-4' />
									<p>
										recipient: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<p>Recipient number with country code (without &lsquo;+&lsquo;).</p>
								</div>
								<CodeBlocks
									title='Request body example'
									code={`{
	"message":{
		"type":"text",
		"text":"Hello There"
		},
	"recipient":"91XXXXXXXXXX"
}`}
									language={'javascript'}
								/>
							</div>
						</div>
						<Separator className='w-full py-1 rounded-full my-4' />
						<div>
							<div>
								<p className='text-lg pt-4 font-medium'>Media Message</p>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<Separator className='w-3/4' />
									<p className='mt-4'>Sends a media (image, video, audio, document).</p>
								</div>
								<div>
									<CodeBlocks
										title='Request Example'
										code={`curl --location 'https://api.wautopilot.com/message/send-message'
--header 'Authorization: Bearer toknxxxxxxxxxxxxxxxxxxx' 
--header 'Content-Type: application/json' 
--data '{
    "message":{
        "type":"image", 
        "media_id":"729961535887623"
		},
		"recipient":"91XXXXXXXXXX"
		}'`}
										language={'bash'}
									/>
									<CodeBlocks
										title='Request Example'
										code={`curl --location 'https://api.wautopilot.com/message/send-message'
--header 'Content-Type: application/json'
--header 'Authorization: Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
--data '{
    "message":{
        "type": "image",
        "media_link": "https://________" 
    },
    "recipient" : "91XXXXXXXXXX"
}''`}
										language={'bash'}
									/>
								</div>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<p className='mt-4 text-lg'>Arguments</p>
									<Separator className='w-3/4 my-4' />
									<p className=''>
										type: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										media_id: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<p>Media id of the media you want to send.</p>
									<div className='flex items-center'>
										<Separator className='w-1/4 my-4' />
										OR
										<Separator className='w-1/4 my-4' />
									</div>
									<p>
										media_link: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<p>
										URL of media.
										<span className='text-destructive'> (any downloadable URL)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										recipient: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<p>Recipient number with country code (without &lsquo;+&lsquo;).</p>
									<Separator className='w-3/4 my-4' />
								</div>
								<div>
									<CodeBlocks
										title='Request body example (with media id)'
										code={`{
	"message":{
		"type":"image", //(image, video, document, audio)
		"media_id":"729961535887623"
		},
    "recipient":"91XXXXXXXXXX"
	}`}
										language={'javascript'}
									/>

									<CodeBlocks
										title='Request body example (with url)'
										code={`{
	"message":{
		"type":"image", //(image, video, document, audio)
		"media_link":"https://media.istockphoto.com/id/1500285927/photo/young-woman-a-university-student-studying-online.jpg?s=2048x2048&w=is&k=20&c=95BgS0lojrWD3QEmbec0nJv2DOHvUO4G6QoXF80S_9Y="
		},
    "recipient":"91XXXXXXXXXX"
	}`}
										language={'javascript'}
									/>
								</div>
							</div>
						</div>
						<Separator className='w-full py-1 rounded-full my-4' />
						<div>
							<div>
								<p className='text-lg pt-4 font-medium'>Location Message</p>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<Separator className='w-3/4' />
									<p className='mt-4'>Sends a location message</p>
								</div>
								<CodeBlocks
									title='Request Example'
									code={`curl --location 'https://api.wautopilot.com/message/send-message' 
--header 'Authorization: Bearer toknxxxxxxxxxxxxxxxxxxx' 
--header 'Content-Type: application/json' 
--data '{
    "message": {
        "type": "location",
        "location": {
            "name": "Central Park",
            "latitude": "40.785091",
            "longitude": "-73.968285",
            "address": "New York, NY 10024, USA"
        }
    },
    "recipient": "91XXXXXXXXXX"
}'`}
									language={'bash'}
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<p className='mt-4 text-lg'>Arguments</p>
									<Separator className='w-3/4 my-4' />
									<p className=''>
										type: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										name: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<p>Name of the place.</p>
									<Separator className='w-3/4 my-4' />
									<p>
										latitude: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<p>Latitude of the place.</p>
									<Separator className='w-3/4 my-4' />
									<p>
										longitude: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<p>Longitude of the place.</p>
									<Separator className='w-3/4 my-4' />
									<p>
										address: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<p>Full address of the place.</p>
									<Separator className='w-3/4 my-4' />
									<p>
										recipient: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<p>Recipient number with country code (without &lsquo;+&lsquo;).</p>
									<Separator className='w-3/4 my-4' />
								</div>
								<CodeBlocks
									title='Request body example'
									code={`{
    "message": {
        "type": "location",
        "location": {
            "name": "Central Park",
            "latitude": "40.785091",
            "longitude": "-73.968285",
            "address": "New York, NY 10024, USA"
        }
    },
    "recipient": "91XXXXXXXXXX"
}`}
									language={'javascript'}
								/>
							</div>
						</div>
						<Separator className='w-full py-1 rounded-full my-4' />
						<div>
							<div>
								<p className='text-lg pt-4 font-medium'>VCard Message</p>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<Separator className='w-3/4' />
									<p className='mt-4'>Sends a contact VCard</p>
								</div>
								<CodeBlocks
									title='Request Example'
									code={`curl --location 'https://api.wautopilot.com/message/send-message' --header 'Authorization: Bearer toknxxxxxxxxxxxxxxxxxxx' --header 'Content-Type: application/json' --data-raw '{
    "message": {
        "type": "contacts",
        "contacts": [{
                "name": {"formatted_name": "Dr. John A. Doe Jr.","first_name": "John","last_name": "Doe","middle_name": "Alexander","suffix": "Jr.","prefix": "Dr."},"addresses": [{"street": "1234 Elm Street","city": "Springfield","state": "IL","zip": "62704","country": "USA","country_code": "US","type": "HOME"},{"street": "5678 Oak Avenue","city": "Chicago","state": "IL","zip": "60605","country": "USA","country_code": "US","type": "WORK"}],"birthday": "1985-05-15","emails": [{"email": "john.doe@workemail.com","type": "WORK"},{"email": "john.doe@homeemail.com","type": "HOME"}],"org": {"company": "Doe Industries","department": "Engineering","title": "Senior Engineer"},"phones": [{"phone": "+11234567890","wa_id": "1234567890","type": "WORK"},{"phone": "+10987654321","wa_id": "0987654321","type": "HOME"}],"urls": [{"url": "http://www.doeindustries.com","type": "WORK"},{"url": "http://www.johndoeblog.com","type": "HOME"}]}]},
				"recipient": "91XXXXXXXXXX"
			}'`}
									language={'bash'}
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<p className='mt-4 text-lg'>Arguments</p>
									<Separator className='w-3/4 my-4' />
									<p className=''>
										type: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										formatted_name: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										first_name: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										last_name: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										middle_name: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										suffix: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>

									<Separator className='w-3/4 my-4' />
									<p>
										prefix: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										addresses: <span className='text-muted-foreground'>array</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										street: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										city: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										state: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										zip: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										country: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										country_code: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										type: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										birthday: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										emails: <span className='text-muted-foreground'>array</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										email: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										type: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										org: <span className='text-muted-foreground'>object</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										company: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										department: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										title: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										phones: <span className='text-muted-foreground'>array</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										phone: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										wa_id: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										type: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										urls: <span className='text-muted-foreground'>array</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										url: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										type: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										recipient: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<p>Recipient number with country code (without &lsquo;+&lsquo;).</p>
									<Separator className='w-3/4 my-4' />
								</div>
								<CodeBlocks
									title='Request body example'
									code={`{
    "message": {
        "type": "contacts",
        "contacts": [
            {
                "name": {
                    "formatted_name": "Dr. John A. Doe Jr.",
                    "first_name": "John",
                    "last_name": "Doe",
                    "middle_name": "Alexander",
                    "suffix": "Jr.",
                    "prefix": "Dr."
                },
                "addresses": [
                    {
                        "street": "1234 Elm Street",
                        "city": "Springfield",
                        "state": "IL",
                        "zip": "62704",
                        "country": "USA",
                        "country_code": "US",
                        "type": "HOME"
                    },
                    {
                        "street": "5678 Oak Avenue",
                        "city": "Chicago",
                        "state": "IL",
                        "zip": "60605",
                        "country": "USA",
                        "country_code": "US",
                        "type": "WORK"
                    }
                ],
                "birthday": "1985-05-15",
                "emails": [
                    {
                        "email": "john.doe@workemail.com",
                        "type": "WORK"
                    },
                    {
                        "email": "john.doe@homeemail.com",
                        "type": "HOME"
                    }
                ],
                "org": {
                    "company": "Doe Industries",
                    "department": "Engineering",
                    "title": "Senior Engineer"
                },
                "phones": [
                    {
                        "phone": "+11234567890",
                        "wa_id": "1234567890",
                        "type": "WORK"
                    },
                    {
                        "phone": "+10987654321",
                        "wa_id": "0987654321",
                        "type": "HOME"
                    }
                ],
                "urls": [
                    {
                        "url": "http://www.doeindustries.com",
                        "type": "WORK"
                    },
                    {
                        "url": "http://www.johndoeblog.com",
                        "type": "HOME"
                    }
                ]
            }
        ]
    },
    "recipient": "91XXXXXXXXXX"
}`}
									language={'javascript'}
								/>
							</div>
						</div>
						<Separator className='w-full py-1 rounded-full my-4' />
						<div>
							<div>
								<p className='text-lg pt-4 font-medium'>Button Message</p>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<Separator className='w-3/4' />
									<p className='mt-4'>Sends message with buttons</p>
								</div>
								<CodeBlocks
									title='Request Example'
									code={`curl --location 'https://api.wautopilot.com/message/send-message' --header 'Authorization: Bearer toknxxxxxxxxxxxxxxxxxxx' --header 'Content-Type: application/json' --data '{
    "message": {
        "type": "button",
        "text": "Choose an option:",
        "buttons": [{"id": "optionone", "text": "Option 1"},{"id": "optiontwo", "text": "Option 2"},{"id": "optionthree", "text": "Option 3"}
    		},
    	"recipient": "91XXXXXXXXXX"
	}'`}
									language={'bash'}
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<p className='mt-4 text-lg'>Arguments</p>
									<Separator className='w-3/4 my-4' />
									<p className=''>
										type: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										buttons: <span className='text-muted-foreground'>array</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										id: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
										<span className='text-destructive'> (should be lower case alphanumeric)</span>
									</p>
									<p>
										text: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										text: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>

									<Separator className='w-3/4 my-4' />
									<p>
										recipient: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<p>Recipient number with country code (without &lsquo;+&lsquo;).</p>
									<Separator className='w-3/4 my-4' />
								</div>
								<CodeBlocks
									title='Request body example'
									code={`{
    "message": {
        "type": "button",
        "text": "Choose an option:",
        "buttons": [
            {
                "id": "optionone", // id must be lowercase alphanumeric
                "text": "Option 1"
            },
            {
                "id": "optiontwo", // id must be lowercase alphanumeric
                "text": "Option 2"
            },
            {
                "id": "optionthree", // id must be lowercase alphanumeric
                "text": "Option 3"
            }
        ]
    },
    "recipient": "91XXXXXXXXXX"
}`}
									language={'javascript'}
								/>
							</div>
						</div>
						<Separator className='w-full py-1 rounded-full my-4' />
						<div>
							<div>
								<p className='text-lg pt-4 font-medium'>List Message</p>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<Separator className='w-3/4' />
									<p className='mt-4'>Sends list message.</p>
								</div>
								<CodeBlocks
									title='Request Example'
									code={`curl --location 'https://api.wautopilot.com/message/send-message' --header 'Authorization: Bearer toknxxxxxxxxxxxxxxxxxxx' --header 'Content-Type: application/json' --data '{
    "message": {
        "type": "list",
        "header": "Available Services",
        "body": "Please choose a service from the list below.",
        "footer": "Swipe up for more options.",
        "button_text": "Select Service",
        "sections": [
			{"title": "Financial Services","buttons": [{"id": "serviceone", "text": "Wealth Management"},{"id": "servicetwo", "text": "Tax Planning"}]},{"title": "Technical Support","buttons": [{"id": "servicethree", "text": "Software Installation"},{"id": "servicefour", "text": "Network Setup"}]},{"title": "Customer Care","buttons": [{"id": "servicefive", "text": "Account Issues"},{"id": "servicesix", "text": "Billing Inquiries"}]}
        ]
    },
    "recipient": "91XXXXXXXXXX"
}'`}
									language={'bash'}
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<p className='mt-4 text-lg'>Arguments</p>
									<Separator className='w-3/4 my-4' />
									<p className=''>
										type: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										header: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										body: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										footer: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										button_text: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										sections: <span className='text-muted-foreground'>array</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										title: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										buttons: <span className='text-muted-foreground'>array</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										id: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										text: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										recipient: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<p>Recipient number with country code (without &lsquo;+&lsquo;).</p>
									<Separator className='w-3/4 my-4' />
								</div>
								<CodeBlocks
									title='Request body example'
									code={`{
    "message": {
        "type": "list",
        "header": "Available Services",
        "body": "Please choose a service from the list below.",
        "footer": "Swipe up for more options.",
        "button_text": "Select Service",
        "sections": [
            {
                "title": "Financial Services",
                "buttons": [
                    {
                        "id": "serviceone", // Button ID must be lowercase alphabets only.
                        "text": "Wealth Management"
                    },
                    {
                        "id": "servicetwo", // Button ID must be lowercase alphabets only.
                        "text": "Tax Planning"
                    }
                ]
            },
            {
                "title": "Technical Support",
                "buttons": [
                    {
                        "id": "servicethree", // Button ID must be lowercase alphabets only.
                        "text": "Software Installation"
                    },
                    {
                        "id": "servicefour", // Button ID must be lowercase alphabets only.
                        "text": "Network Setup"
                    }
                ]
            },
            {
                "title": "Customer Care",
                "buttons": [
                    {
                        "id": "servicefive", // Button ID must be lowercase alphabets only.
                        "text": "Account Issues"
                    },
                    {
                        "id": "servicesix", // Button ID must be lowercase alphabets only.
                        "text": "Billing Inquiries"
                    }
                ]
            }
        ]
    },
    "recipient": "91XXXXXXXXXX"
}`}
									language={'javascript'}
								/>
							</div>
						</div>
						<Separator className='w-full py-1 rounded-full my-4' />
						<div>
							<div>
								<p className='text-lg pt-4 font-medium'>Whatsapp Flow Message</p>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<Separator className='w-3/4' />
									<p className='mt-4'>Sends flow Message</p>
								</div>
								<CodeBlocks
									title='Request Example'
									code={`curl --location 'https://api.wautopilot.com/message/send-message' --header 'Authorization: Bearer toknxxxxxxxxxxxxxxxxxxx' --header 'Content-Type: application/json' --data '{
    "message": {
        "type": "whatsapp_flow",
        "header": "Welcome to Our Service", 
        "body": "We are here to assist you. Please start the flow below to continue.",
        "footer": "Thank you for choosing us.", 
        "flow_id": "1140273103940962",
        "button_text": "Start Now"
    },
    "recipient": "91XXXXXXXXXX"
}'`}
									language={'bash'}
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<p className='mt-4 text-lg'>Arguments</p>
									<Separator className='w-3/4 my-4' />
									<p className=''>
										type: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										header: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										body: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										footer: <span className='text-muted-foreground'>string</span>
										<span className='text-gray-400'> (optional)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										flow_id: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<p>Flow id of the flow you want to send.</p>
									<Separator className='w-3/4 my-4' />
									<p>
										button_text: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										recipient: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<p>Recipient number with country code (without &lsquo;+&lsquo;).</p>
									<Separator className='w-3/4 my-4' />
								</div>
								<CodeBlocks
									title='Request body example'
									code={`{
    "message": {
        "type": "whatsapp_flow",
        "header": "Welcome to Our Service", // optional
        "body": "We are here to assist you. Please start the flow below to continue.",
        "footer": "Thank you for choosing us.", //optional
        "flow_id": "1140273103940962",
        "button_text": "Start Now"
    },
    "recipient": "91XXXXXXXXXX"
}`}
									language={'javascript'}
								/>
							</div>
						</div>
						<Separator className='w-full py-1 rounded-full my-4' />
						<div>
							<div>
								<p className='text-lg pt-4 font-medium'>Template Message (with custom message)</p>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<Separator className='w-3/4' />
									<p className='mt-4'>Sends a template Message</p>
								</div>
								<CodeBlocks
									title='Request Example'
									code={`curl --location 'https://api.wautopilot.com/message/send-message' --header 'Authorization: Bearer toknxxxxxxxxxxxxxxxxxxx' --header 'Content-Type: application/json' --data '{
    "message": {
        "type": "template",
        "template_id": "703008418565758",
        "template_name": "bni_first_message",
        "template_header": {"type": "IMAGE","media_id": "881697986671853"},
        "template_body": [
            {
                "custom_text": "User",
                "phonebook_data": "",
                "variable_from": "custom_text",
                "fallback_value": ""
            },
            {
                "custom_text": "2",
                "phonebook_data": "",
                "variable_from": "custom_text",
                "fallback_value": ""
            }
        ]
    },
    "recipient": "91XXXXXXXXXX"
}'`}
									language={'bash'}
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<p className='mt-4 text-lg'>Arguments</p>
									<Separator className='w-3/4 my-4' />
									<p className=''>
										type: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										template_id: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										template_name: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										template_header.type: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										media_id: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'>
											{' '}
											(required when &apos;type&apos; is &apos;IMAGE&apos; &apos;VIDEO&apos;
											&apos;AUDIO&apos; &apos;DOCUMENT&apos;)
										</span>
									</p>
									<p>or</p>
									<p>
										media_link: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'>
											{' '}
											(required when &apos;type&apos; is &apos;IMAGE&apos; &apos;VIDEO&apos;
											&apos;AUDIO&apos; &apos;DOCUMENT&apos;)
										</span>
									</p>
									<p>
										<span className='text-destructive'>
											NOTE: Any one of media_id or media_link is required
										</span>
									</p>
									<p>
										text: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'>
											{' '}
											(required when &apos;type&apos; is &apos;TEXT&apos;)
										</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										template_body: <span className='text-muted-foreground'>array</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										variable_from: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'>(required)</span>
									</p>
									<p>Variable from which the value will be fetched.</p>
									<Separator className='w-3/4 my-4' />
									<p>
										custom_text: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'>
											{' '}
											(required when &apos;variable_from&apos; is &apos;custom_text&apos;)
										</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										phonebook_data: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'>
											{' '}
											(required when &apos;variable_from&apos; is &apos;phonebook_data&apos;)
										</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										fallback_data: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'>
											{' '}
											(required when &apos;variable_from&apos; is &apos;phonebook_data&apos;)
										</span>
									</p>
									<Separator className='w-3/4 my-4' />

									<p>
										recipient: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<p>Recipient number with country code (without &lsquo;+&lsquo;).</p>
									<Separator className='w-3/4 my-4' />
								</div>
								<CodeBlocks
									title='Request body example'
									code={`{
    "message": {
        "type": "template",
        "template_id": "703008418565758",
        "template_name": "bni_first_message",
        "template_header": {
            "type": "IMAGE",
            "media_id": "881697986671853"
        },
        "template_body": [
            {
                "custom_text": "User",
                "phonebook_data": "",
                "variable_from": "custom_text",
                "fallback_value": ""
            },
            {
                "custom_text": "2",
                "phonebook_data": "",
                "variable_from": "custom_text",
                "fallback_value": ""
            }
        ]
    },
    "recipient": "91XXXXXXXXXX"
}`}
									language={'javascript'}
								/>
							</div>
						</div>
						<Separator className='w-full py-1 rounded-full my-4' />
						<div>
							<div>
								<p className='text-lg pt-4 font-medium'>Template Message (with phonebook data)</p>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<Separator className='w-3/4' />
									<p className='mt-4'>Sends a template Message</p>
								</div>
								<CodeBlocks
									title='Request Example'
									code={`curl --location 'https://api.wautopilot.com/message/send-message' --header 'Authorization: Bearer toknxxxxxxxxxxxxxxxxxxx' --header 'Content-Type: application/json' --data '{
    "message": {
        "type": "template",
        "template_id": "703008418565758",
        "template_name": "bni_first_message",
        "template_header": {"type": "IMAGE","media_id": "881697986671853"},
        "template_body": [
            {
                "custom_text": "",
                "phonebook_data": "first_name",
                "variable_from": "phonebook_data",
                "fallback_value": "User"
            },
            {
                "custom_text": "",
                "phonebook_data": "middle_name",
                "variable_from": "phonebook_data",
                "fallback_value": "dear"
            }
        ]
    },
    "recipient": "91XXXXXXXXXX"
}'`}
									language={'bash'}
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<p className='mt-4 text-lg'>Arguments</p>
									<Separator className='w-3/4 my-4' />
									<p className=''>
										type: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										template_id: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										template_name: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										template_header.type: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										media_id: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'>
											{' '}
											(required when &apos;type&apos; is &apos;IMAGE&apos; &apos;VIDEO&apos;
											&apos;AUDIO&apos; &apos;DOCUMENT&apos;)
										</span>
									</p>
									<p>or</p>
									<p>
										media_link: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'>
											{' '}
											(required when &apos;type&apos; is &apos;IMAGE&apos; &apos;VIDEO&apos;
											&apos;AUDIO&apos; &apos;DOCUMENT&apos;)
										</span>
									</p>
									<p>
										<span className='text-destructive'>
											NOTE: Any one of media_id or media_link is required
										</span>
									</p>
									<p>
										text: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'>
											{' '}
											(required when &apos;type&apos; is &apos;TEXT&apos;)
										</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										template_body: <span className='text-muted-foreground'>array</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										variable_from: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'>(required)</span>
									</p>
									<p>Variable from which the value will be fetched.</p>
									<Separator className='w-3/4 my-4' />
									<p>
										custom_text: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'>
											{' '}
											(required when &apos;variable_from&apos; is &apos;custom_text&apos;)
										</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										phonebook_data: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'>
											{' '}
											(required when &apos;variable_from&apos; is &apos;phonebook_data&apos;)
										</span>
									</p>
									<Separator className='w-3/4 my-4' />
									<p>
										fallback_data: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'>
											{' '}
											(required when &apos;variable_from&apos; is &apos;phonebook_data&apos;)
										</span>
									</p>
									<Separator className='w-3/4 my-4' />

									<p>
										recipient: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<p>Recipient number with country code (without &lsquo;+&lsquo;).</p>
									<Separator className='w-3/4 my-4' />
								</div>
								<CodeBlocks
									title='Request body example'
									code={`{
    "message": {
        "type": "template",
        "template_id": "703008418565758",
        "template_name": "bni_first_message",
        "template_header": {
            "type": "IMAGE",
            "media_id": "881697986671853"
        },
        "template_body": [
            {
                "custom_text": "",
                "phonebook_data": "first_name",
                "variable_from": "phonebook_data",
                "fallback_value": "User"
            },
            {
                "custom_text": "",
                "phonebook_data": "middle_name",
                "variable_from": "phonebook_data",
                "fallback_value": "dear"
            }
        ]
    },
    "recipient": "91XXXXXXXXXX"
}`}
									language={'javascript'}
								/>
							</div>
						</div>
					</section>
					<section id='media'>
						<Separator className='w-full' />
						<div>
							<p className='text-2xl pt-4 font-medium'>Media</p>
						</div>
						<div>
							<div>
								<p className='text-lg pt-4 font-medium'>List Media</p>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<Separator className='w-3/4' />
									<p className='mt-4'>Lists of media</p>
								</div>
								<CodeBlocks
									title='Request Example'
									code={`curl --location 'https://api.wautopilot.com/v1/media' \--header 'Authorization: ••••••' \}'`}
									language={'bash'}
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<p className='mt-4 text-lg'>Arguments:</p>
									<p>No args required.</p>
								</div>
								<CodeBlocks
									title='Request body example'
									code={`{
    "list": [
        {
            "id": "1064042408267933",
            "filename": "DP-8049E",
            "file_length": 922113,
            "mime_type": "image/jpeg"
        },
    ],
    "success": true
}`}
									language={'javascript'}
								/>
							</div>
						</div>
						<div>
							<div>
								<p className='text-lg pt-4 font-medium'>Download Media</p>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<Separator className='w-3/4' />
									<p className='mt-4'>Download media by media id</p>
								</div>
								<CodeBlocks
									title='Request Example'
									code={`curl --location 'https://api.wautopilot.com/v1/media/<MEDIA_ID>/download' \--header 'Authorization: ••••••' \}'`}
									language={'bash'}
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<p className='mt-4 text-lg'>Arguments:</p>
									<Separator className='w-3/4 my-4' />
									<p className=''>
										{`<MEDIA_ID>`}: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
								</div>
							</div>
						</div>
					</section>
					<section id='template'>
						<Separator className='w-full' />
						<div>
							<p className='text-2xl pt-4 font-medium'>Template</p>
						</div>
						<div>
							<div>
								<p className='text-lg pt-4 font-medium'>List templates</p>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<Separator className='w-3/4' />
									<p className='mt-4'>Lists of all template registered to meta.</p>
								</div>
								<CodeBlocks
									title='Request Example'
									code={`curl --location 'https://api.wautopilot.com/v1/templates' \--header 'Authorization: ••••••' \}'`}
									language={'bash'}
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<p className='mt-4 text-lg'>Arguments:</p>
									<p>No args required.</p>
								</div>
								<CodeBlocks
									title='Response body example'
									code={`{
    "templates": [
        {
            "id": "3837455136535795",
            "name": "product_catalog",
            "status": "APPROVED",
            "category": "MARKETING"
        },
    ],
    "success": true
}`}
									language={'javascript'}
								/>
							</div>
						</div>
						<div>
							<div>
								<p className='text-lg pt-4 font-medium'>Template Details</p>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<Separator className='w-3/4' />
									<p className='mt-4'>Details of the template.</p>
								</div>
								<CodeBlocks
									title='Request Example'
									code={`curl --location 'https://api.wautopilot.com/v1/templates/<TEMPLATE_ID>' \--header 'Authorization: ••••••' \}'`}
									language={'bash'}
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<p className='mt-4 text-lg'>Arguments:</p>
									<Separator className='w-3/4 my-4' />
									<p className=''>
										{`<TEMPLATE_ID>`}: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
								</div>
								<CodeBlocks
									title='Response body example'
									code={`{
    "template": {
        "id": "<TEMPLATE_ID>",
        "name": "mar_bni_pincode_message",
        "category": "MARKETING",
        "allow_category_change": true,
        "language": "en_US",
        "components": [
            {
                "type": "BODY",
                "text": "Good Morning {{1}} ,\n\nWhile going through my leads a few days ago, I saw your office is in {{2}} .\n\nI visit {{2}} regularly, and would like to do 1-2-1 when I visit next time .\n\nPlease share your *Google Location of your Business* .",
                "example": {
                    "body_text": [
                        [
                            "Name",
                            "Colony"
                        ]
                    ]
                }
            },
            {
                "type": "BUTTONS",
                "buttons": [
                    {
                        "type": "QUICK_REPLY",
                        "text": "Let's Connect"
                    },
                    {
                        "type": "QUICK_REPLY",
                        "text": "I will connect later"
                    }
                ]
            }
        ]
    },
    "success": true
}`}
									language={'javascript'}
								/>
							</div>
						</div>
						<div className='text-center font-medium'>
							Please refer to the meta documentation for more details on the template.
						</div>
					</section>
					<section id='flows'>
						<Separator className='w-full' />
						<div>
							<p className='text-2xl pt-4 font-medium'>Whatsapp Flows / Forms</p>
						</div>
						<div>
							<div>
								<p className='text-lg pt-4 font-medium'>List FLows</p>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<Separator className='w-3/4' />
									<p className='mt-4'>Lists all the flows registered to meta.</p>
								</div>
								<CodeBlocks
									title='Request Example'
									code={`curl --location 'https://api.wautopilot.com/v1/flows' \--header 'Authorization: ••••••' \}'`}
									language={'bash'}
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<p className='mt-4 text-lg'>Arguments:</p>
									<p>No args required.</p>
								</div>
								<CodeBlocks
									title='Response body example'
									code={`{
    "flows": [
        {
            "id": "505642542401463",
            "name": "Digital Marketing Expertise Survey",
            "status": "PUBLISHED",
            "categories": [
                "LEAD_GENERATION"
            ]
        }
    ],
    "success": true
}`}
									language={'javascript'}
								/>
							</div>
						</div>
						<div>
							<div>
								<p className='text-lg pt-4 font-medium'>Whatsapp Flow Details</p>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<Separator className='w-3/4' />
									<p className='mt-4'>Details of the flow.</p>
								</div>
								<CodeBlocks
									title='Request Example'
									code={`curl --location 'https://api.wautopilot.com/v1/flows/<FLOW_ID>' \--header 'Authorization: ••••••' \}'`}
									language={'bash'}
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2'>
								<div>
									<p className='mt-4 text-lg'>Arguments:</p>
									<Separator className='w-3/4 my-4' />
									<p className=''>
										{`<FLOW_ID>`}: <span className='text-muted-foreground'>string</span>
										<span className='text-destructive'> (required)</span>
									</p>
									<Separator className='w-3/4 my-4' />
								</div>
								<CodeBlocks
									title='Response body example'
									code={`{
    "screens": [
        {
            "id": "kindly_share_your_expertise_in_digital_marketing",
            "title": "Kindly share your expertise in Digital Marketing",
            "children": [
                {
                    "type": "CheckboxGroup",
                    "name": "multiple_choice",
                    "label": "Expert Area",
                    "required": false,
                    "data-source": [
                        "Social Media Marketing",
                        "Search Engine Marketing",
                        "SEO",
                        "Meta Whatsapp Business API"
                    ]
                },
                {
                    "type": "TextArea",
                    "name": "textarea",
                    "label": "Industries you cater",
                    "required": false,
                    "helper-text": "Kindly specify industries you specialize in generating leads for."
                },
                {
                    "type": "Footer",
                    "label": "Submit",
                    "on-click-action": {
                        "name": "complete",
                        "payload": {
                            "multiple_choice": "{form.multiple_choice}",
                            "textarea": "{form.textarea}"
                        }
                    }
                }
            ]
        }
    ],
    "success": true
}`}
									language={'javascript'}
								/>
							</div>
						</div>
						<div className='text-center font-medium'>
							Please refer to the meta documentation for more details on the flow.
						</div>
					</section>
				</TabsContent>
				<TabsContent value='webhook'>
					<div>
						<p className='text-lg pt-4'>
							1. After logging in go to https://wautopilot.com/panel/home/api-webhook
						</p>
					</div>
					<section id='terms' className='grid grid-cols-1 md:grid-cols-2 justify-center'>
						<div className='flex flex-col justify-between gap-4'>
							<p className='text-lg pt-4'>2. Generate an API key for your WhatsApp Business API.</p>
							<Image
								src='/images/webhook_create.png'
								alt='API'
								width={1200}
								height={1200}
								className='md:w-3/4 mx-auto'
							/>
						</div>
						<div className='flex flex-col justify-between gap-4'>
							<p className='text-lg pt-4'>
								3. Enter your name, select WhatsApp number and enter your webhook endpoint url to
								receive the message for your device.
							</p>
							<Image
								src='/images/details_webhook.png'
								alt='API'
								width={1200}
								height={1200}
								className='md:w-3/4 mx-auto'
							/>
						</div>
						<div className='md:col-span-2'>
							<p className='text-lg pt-4'>4. Validate your webhook.</p>
							<Image
								src='/images/validate_webhook.png'
								alt='API'
								width={1200}
								height={1200}
								className='mx-auto'
							/>
						</div>
					</section>
				</TabsContent>
			</Tabs>
		</section>
	);
}
