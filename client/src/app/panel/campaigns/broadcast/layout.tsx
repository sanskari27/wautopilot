import { MediaProvider } from '@/components/context/media';
import { TemplatesProvider } from '@/components/context/templates';
import Loading from '@/components/elements/loading';
import MediaService from '@/services/media.service';
import TemplateService from '@/services/template.service';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Broadcast • Wautopilot',
};

const templates = [
	{
		id: '3837455136535795',
		name: 'product_catalog',
		status: 'APPROVED',
		category: 'MARKETING',
		components: [
			{
				type: 'BODY',
				text: "Explore our carefully curated selection of high-quality products below. Each item comes with detailed descriptions, real-time stock availability, and competitive pricing to help you make an informed decision. Don't miss out on these great deals!",
			},
			{
				type: 'CAROUSEL',
				cards: [
					{
						components: [
							{
								type: 'HEADER',
								format: 'IMAGE',
								example: {
									header_handle: [
										'https://scontent.whatsapp.net/v/t61.29466-34/446073988_1210008903538570_2804296722040795242_n.jpg?ccb=1-7&_nc_sid=a80384&_nc_ohc=nHNGzoeMHKsQ7kNvgHndxdn&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=AUaC8NQtjJzE_U8wsJ_bdU4&oh=01_Q5AaID0soVjhIAYTYTZxqruD3uMRLXVRJi-Vz5JCYZUY5Ena&oe=672E0BE6',
									],
								},
							},
							{
								type: 'BODY',
								text: 'Wireless Noise-Cancelling Headphones, Experience rich sound and block out noise. {{1}} units available costs only ₹{{2}}',
								example: { body_text: [['72', '2000']] },
							},
							{ type: 'BUTTONS', buttons: [{ type: 'QUICK_REPLY', text: 'Add to cart' }] },
						],
					},
					{
						components: [
							{
								type: 'HEADER',
								format: 'IMAGE',
								example: {
									header_handle: [
										'https://scontent.whatsapp.net/v/t61.29466-34/421860779_424150463688037_3597448108766093855_n.jpg?ccb=1-7&_nc_sid=a80384&_nc_ohc=IGCtt3BnAKgQ7kNvgGZOniK&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=AUaC8NQtjJzE_U8wsJ_bdU4&oh=01_Q5AaIHPus3eE9gffb7Zt7guS8I9QVni6hPIfvHD7RQXnEz4T&oe=672E06EF',
									],
								},
							},
							{
								type: 'BODY',
								text: 'Smart LED Desk Lamp. Stylish, adjustable brightness lamp perfect for any workspace. {{1}} units available, costs only ₹{{2}}',
								example: { body_text: [['48', '1899']] },
							},
							{ type: 'BUTTONS', buttons: [{ type: 'QUICK_REPLY', text: 'Add to cart' }] },
						],
					},
				],
			},
		],
	},
	{
		id: '513710704705824',
		name: 'carousel_with_template_test',
		status: 'REJECTED',
		category: 'MARKETING',
		components: [
			{
				type: 'BODY',
				text: 'Hello {{1}},\nWe have the following options available with us.',
				example: { body_text: [['Prashant']] },
			},
			{
				type: 'CAROUSEL',
				cards: [
					{
						components: [
							{
								type: 'HEADER',
								format: 'IMAGE',
								example: {
									header_handle: [
										'https://scontent.whatsapp.net/v/t61.29466-34/324787553_400342233116192_1465130658499341589_n.jpg?ccb=1-7&_nc_sid=a80384&_nc_ohc=HY6K29LIAp0Q7kNvgGnrWkm&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=AUaC8NQtjJzE_U8wsJ_bdU4&oh=01_Q5AaIE9AurInRPvm9FZ6WxV7covwPGfe7v7pcWarEdmlFQwC&oe=672E0BA3',
									],
								},
							},
							{
								type: 'BODY',
								text: 'This is product 1: {{1}}\nprice: {{2}}\nstock: {{3}}',
								example: { body_text: [['Golden earring', '1200', '10']] },
							},
							{ type: 'BUTTONS', buttons: [{ type: 'QUICK_REPLY', text: 'Order' }] },
						],
					},
					{
						components: [
							{
								type: 'HEADER',
								format: 'IMAGE',
								example: {
									header_handle: [
										'https://scontent.whatsapp.net/v/t61.29466-34/461551605_1915328278986597_2475890395404126401_n.jpg?ccb=1-7&_nc_sid=a80384&_nc_ohc=7RV5V6C9X48Q7kNvgEYg-Im&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=AUaC8NQtjJzE_U8wsJ_bdU4&oh=01_Q5AaIE869O8fc5aIrz2qauX5GPoqcI7_p8wA21Af_fp_Gxgw&oe=672E04E2',
									],
								},
							},
							{
								type: 'BODY',
								text: 'This is product 1: {{1}}\nprice: {{2}}\nstock: {{3}}',
								example: { body_text: [['Golden bracelet', '3000', '5']] },
							},
							{ type: 'BUTTONS', buttons: [{ type: 'QUICK_REPLY', text: 'Order' }] },
						],
					},
				],
			},
		],
	},
	{
		id: '526083146723033',
		name: 'carousel_with_variables',
		status: 'REJECTED',
		category: 'MARKETING',
		components: [
			{ type: 'BODY', text: 'this is a sample body with variables in cards' },
			{
				type: 'CAROUSEL',
				cards: [
					{
						components: [
							{
								type: 'HEADER',
								format: 'IMAGE',
								example: {
									header_handle: [
										'https://scontent.whatsapp.net/v/t61.29466-34/399451586_3680279535557579_4114434768510071561_n.jpg?ccb=1-7&_nc_sid=a80384&_nc_ohc=PUNV-K5Tv84Q7kNvgHP7znu&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=AUaC8NQtjJzE_U8wsJ_bdU4&oh=01_Q5AaINeppvrXZPABtqj5tj6sCLSrbrR0wuOXGDoDHJFXElo3&oe=672E20FA',
									],
								},
							},
							{
								type: 'BODY',
								text: 'hello {{1}},\nwe got {{2}} number',
								example: { body_text: [['john', '1000']] },
							},
							{ type: 'BUTTONS', buttons: [{ type: 'QUICK_REPLY', text: 'Confirmed' }] },
						],
					},
					{
						components: [
							{
								type: 'HEADER',
								format: 'IMAGE',
								example: {
									header_handle: [
										'https://scontent.whatsapp.net/v/t61.29466-34/461521466_1278515989822224_2769067475939978712_n.jpg?ccb=1-7&_nc_sid=a80384&_nc_ohc=qM5WGpxbyNwQ7kNvgHdzU6q&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=AUaC8NQtjJzE_U8wsJ_bdU4&oh=01_Q5AaINm58D73C2uwo_nvMuNAOQfMwRE4T7py3FUrJsZQkXR4&oe=672E261C',
									],
								},
							},
							{
								type: 'BODY',
								text: 'hello {{1}},\nitems left {{2}}',
								example: { body_text: [['john', '20']] },
							},
							{ type: 'BUTTONS', buttons: [{ type: 'QUICK_REPLY', text: 'Order now' }] },
						],
					},
				],
			},
		],
	},
	{
		id: '1037848077881368',
		name: 'referral_partner_survey_digital_marketing',
		status: 'APPROVED',
		category: 'MARKETING',
		components: [
			{
				type: 'BODY',
				text: 'Good Morning BNI {{1}} Ji,\n\nThis is Prashant Varma from BNI Athena, Delhi South.\n\nGot your reference sometime back from a BNI Group.\n\nI recieved an enquiry for Digital Marketing Services in {{2}}\n\nDo you do Digital Marketing ?\n\nKindly confirm 👇',
				example: { body_text: [['First Name', 'City']] },
			},
			{ type: 'BUTTONS', buttons: [{ type: 'QUICK_REPLY', text: 'I Do Digital Marketing' }] },
		],
	},
	{
		id: '507357192088448',
		name: 'sample_carousel_template',
		status: 'APPROVED',
		category: 'MARKETING',
		components: [
			{ type: 'BODY', text: 'sample template body' },
			{
				type: 'CAROUSEL',
				cards: [
					{
						components: [
							{
								type: 'HEADER',
								format: 'IMAGE',
								example: {
									header_handle: [
										'https://scontent.whatsapp.net/v/t61.29466-34/421888823_567511462613872_7437168376234840126_n.jpg?ccb=1-7&_nc_sid=a80384&_nc_ohc=ZnHaW1KAXokQ7kNvgE5Qgmo&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=AUaC8NQtjJzE_U8wsJ_bdU4&oh=01_Q5AaIE9ekJ5mKCTW3OGTpG_9ImBI9c8QVyeDgywloeFyjJ5D&oe=672E09D4',
									],
								},
							},
							{ type: 'BODY', text: 'sample body 1' },
							{ type: 'BUTTONS', buttons: [{ type: 'QUICK_REPLY', text: 'test' }] },
						],
					},
					{
						components: [
							{
								type: 'HEADER',
								format: 'IMAGE',
								example: {
									header_handle: [
										'https://scontent.whatsapp.net/v/t61.29466-34/459394144_407668352169001_4302087050457900771_n.jpg?ccb=1-7&_nc_sid=a80384&_nc_ohc=MVgVOhFQgwgQ7kNvgHlfbH0&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=AUaC8NQtjJzE_U8wsJ_bdU4&oh=01_Q5AaIAJKeaKkj-TPqKDGp428FaXaBX9CbOOLPhbgLqI4vUI-&oe=672DF953',
									],
								},
							},
							{ type: 'BODY', text: 'sample body 2' },
							{ type: 'BUTTONS', buttons: [{ type: 'QUICK_REPLY', text: 'test 2' }] },
						],
					},
					{
						components: [
							{
								type: 'HEADER',
								format: 'IMAGE',
								example: {
									header_handle: [
										'https://scontent.whatsapp.net/v/t61.29466-34/417678085_1907693496404171_4670733992245415781_n.jpg?ccb=1-7&_nc_sid=a80384&_nc_ohc=Sx2TvHiKQJUQ7kNvgHdsVRi&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=AUaC8NQtjJzE_U8wsJ_bdU4&oh=01_Q5AaILAu_FizQWxsce_oc5DOAeAcw881Sb_0J-nUliYAFFhK&oe=672E20A0',
									],
								},
							},
							{ type: 'BODY', text: 'sample body 3' },
							{ type: 'BUTTONS', buttons: [{ type: 'QUICK_REPLY', text: 'test 3' }] },
						],
					},
				],
			},
		],
	},
	{
		id: '853831216850857',
		name: 'pv_linkedin_facebook_links_message',
		status: 'APPROVED',
		category: 'MARKETING',
		components: [
			{
				type: 'HEADER',
				format: 'IMAGE',
				example: {
					header_handle: [
						'https://scontent.whatsapp.net/v/t61.29466-34/459095902_853831223517523_6617838058198772727_n.png?ccb=1-7&_nc_sid=8b1bef&_nc_ohc=eU8yZDeoS4gQ7kNvgHKBhes&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=AUaC8NQtjJzE_U8wsJ_bdU4&oh=01_Q5AaIAl-23nLSc_SIruy2GicH6Xp7Gl85QEAAVov9T4hi547&oe=672E0D98',
					],
				},
			},
			{
				type: 'BODY',
				text: 'Lets connect on Social Media also.\n\nPlease click on the button below to connect.\n\n👇👇👇👇',
			},
			{
				type: 'BUTTONS',
				buttons: [
					{ type: 'URL', text: 'Linkedin', url: 'https://www.linkedin.com/in/coachprashantvarma/' },
					{ type: 'URL', text: 'Facebook', url: 'https://www.facebook.com/prashaant.varma' },
				],
			},
		],
	},
	{
		id: '406861508512098',
		name: 'task_wautopilot_status_update',
		status: 'APPROVED',
		category: 'UTILITY',
		components: [
			{
				type: 'BODY',
				text: 'Dear {{1}},\n\n{{2}} has updated the status of the task to *{{3}}*.\n\n*Remarks* - {{4}}\n\nHere are the task details:\n*Category* - {{5}}\n*Task* - {{6}}\n*Due Date* - {{7}}\n*Priority* - {{8}}',
				example: {
					body_text: [
						[
							'Prashant',
							'Prashant',
							'In Progress',
							'Working on this task',
							'Accounts',
							'Task 1',
							'05-Jul-24 10:00 AM',
							'High',
						],
					],
				},
			},
			{ type: 'FOOTER', text: 'This is a notification generated by task.wautopilot.com' },
			{
				type: 'BUTTONS',
				buttons: [
					{
						type: 'URL',
						text: 'Open Task',
						url: 'https://task.wautopilot.com/organizations{{1}}',
						example: ['task-id-1'],
					},
				],
			},
		],
	},
	{
		id: '8000423059997120',
		name: 'task_wautopilot_status_create',
		status: 'APPROVED',
		category: 'UTILITY',
		components: [
			{
				type: 'BODY',
				text: 'Dear {{1}},\n\n{{2}} has assigned a task with status *{{3}}*.\n\n*Remarks* - {{4}}\n\nHere are the task details:\n*Category* - {{5}}\n*Task* - {{6}}\n*Due Date* - {{7}}\n*Priority* - {{8}}',
				example: {
					body_text: [
						[
							'Prashant',
							'Prashant',
							'In Progress',
							'Working on this task',
							'Accounts',
							'Task 1',
							'05-Jul-24 10:00 AM',
							'High',
						],
					],
				},
			},
			{ type: 'FOOTER', text: 'This is a notification generated by task.wautopilot.com' },
			{
				type: 'BUTTONS',
				buttons: [
					{
						type: 'URL',
						text: 'Open Task',
						url: 'https://task.wautopilot.com/organizations{{1}}',
						example: ['task-id-1'],
					},
				],
			},
		],
	},
	{
		id: '560793779628355',
		name: 'sapin40549',
		status: 'REJECTED',
		category: 'MARKETING',
		components: [
			{ type: 'BODY', text: 'qwertyui {{1}}', example: { body_text: [['asda']] } },
			{
				type: 'CAROUSEL',
				cards: [
					{
						components: [
							{
								type: 'HEADER',
								format: 'IMAGE',
								example: {
									header_handle: [
										'https://scontent.whatsapp.net/v/t61.29466-34/442076712_1572018203737367_1757209097769204219_n.jpg?ccb=1-7&_nc_sid=a80384&_nc_ohc=58wWZJj9R1EQ7kNvgGdO-3G&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=AUaC8NQtjJzE_U8wsJ_bdU4&oh=01_Q5AaIILmB4saosz9WwbdTcnjFCdaJLRDQliZyHOQXcf96j9D&oe=672DF774',
									],
								},
							},
							{ type: 'BODY', text: 'qwrtyuiop {{1}}', example: { body_text: [['sdasd']] } },
							{
								type: 'BUTTONS',
								buttons: [
									{ type: 'QUICK_REPLY', text: 'Hello' },
									{ type: 'QUICK_REPLY', text: 'Hello 2' },
								],
							},
						],
					},
					{
						components: [
							{
								type: 'HEADER',
								format: 'IMAGE',
								example: {
									header_handle: [
										'https://scontent.whatsapp.net/v/t61.29466-34/456049695_868225658746647_2348372313416957380_n.jpg?ccb=1-7&_nc_sid=a80384&_nc_ohc=s02BB97EobsQ7kNvgGEmX_S&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=AUaC8NQtjJzE_U8wsJ_bdU4&oh=01_Q5AaIMDQMBcHQMtuCpqMoaT4eaFsVQYFqLelbTmb2ntW-CM6&oe=672E1085',
									],
								},
							},
							{ type: 'BODY', text: 'asdfghjkl {{1}}', example: { body_text: [['v fgs']] } },
							{
								type: 'BUTTONS',
								buttons: [
									{ type: 'QUICK_REPLY', text: 'Hello 3' },
									{ type: 'QUICK_REPLY', text: 'Hello 4' },
								],
							},
						],
					},
				],
			},
		],
	},
	{
		id: '499259179221320',
		name: 'task_wautopilot_reminder',
		status: 'APPROVED',
		category: 'UTILITY',
		components: [
			{
				type: 'BODY',
				text: 'Dear {{1}},\n\nThis is a friendly reminder about your upcoming task on Wautopilot. Please review the details below and ensure you complete it on time.\n\n*Remarks* - {{2}}\n\nHere are the task details:\n*Category* - {{3}}\n*Task* - {{4}}\n*Due Date* - {{5}}\n*Priority* - {{6}}',
				example: {
					body_text: [
						['Prashant', 'Completed', 'Update_ALL', 'Status Updates', '02nd Aug', 'High'],
					],
				},
			},
			{ type: 'FOOTER', text: 'This is a notification generated by task.wautopilot.com' },
			{
				type: 'BUTTONS',
				buttons: [
					{
						type: 'URL',
						text: 'Open Task',
						url: 'https://task.wautopilot.com/organizations{{1}}',
						example: ['task-id-1'],
					},
				],
			},
		],
	},
	{
		id: '703008418565758',
		name: 'bni_first_message',
		status: 'APPROVED',
		category: 'MARKETING',
		components: [
			{
				type: 'BODY',
				text: '*Good Morning BNI {{1}} Ji,*\n\nThis is Prashant Varma from BNI Athena, Delhi South.\n\nSaw your profile on BNIConnect sometime back.\n\nWhat would be the best way to communicate if I find some relevant referral for you. \n👇👇👇👇👇',
				example: { body_text: [['Name']] },
			},
			{
				type: 'BUTTONS',
				buttons: [
					{ type: 'QUICK_REPLY', text: 'Whatsappp' },
					{ type: 'QUICK_REPLY', text: 'Calll' },
					{ type: 'QUICK_REPLY', text: 'SMS' },
				],
			},
		],
	},
	{
		id: '1523000151653254',
		name: '234',
		status: 'APPROVED',
		category: 'MARKETING',
		components: [{ type: 'BODY', text: '234' }],
	},
	{
		id: '1547477319537802',
		name: 'referral_partner_survey',
		status: 'APPROVED',
		category: 'MARKETING',
		components: [
			{
				type: 'BODY',
				text: 'Good Morning BNI {{1}} {{2}} {{3}},\n\nThis is Prashant Varma from BNI Athena, Delhi South.\n\nSaw your profile some time back on BNI Connect.\n\nI recieved an enquiry for Digital Marketing Services in {{4}}\n\nDo you do Digital Marketing.  \n\nKindly confirm 👇',
				example: { body_text: [['First Name', 'Middle Name', 'Last Name', 'City Name']] },
			},
			{ type: 'BUTTONS', buttons: [{ type: 'QUICK_REPLY', text: 'I Do Digital Marketing' }] },
		],
	},
	{
		id: '1030943261773894',
		name: 'utility_test_message',
		status: 'APPROVED',
		category: 'UTILITY',
		components: [
			{
				type: 'BODY',
				text: 'You received a new notification, {{1}}',
				example: { body_text: [['Name']] },
			},
			{
				type: 'BUTTONS',
				buttons: [
					{ type: 'QUICK_REPLY', text: 'Yes' },
					{ type: 'QUICK_REPLY', text: 'No' },
				],
			},
		],
	},
	{
		id: '1747181659355758',
		name: 'prashant_real_estate_consultant',
		status: 'APPROVED',
		category: 'MARKETING',
		components: [
			{ type: 'HEADER', format: 'TEXT', text: 'Are you a Real Estate Consultant' },
			{
				type: 'BODY',
				text: 'Are you a {{1}} {{2}} Based Real Estate Consultant ?',
				example: { body_text: [['South', 'Delhi']] },
			},
			{
				type: 'BUTTONS',
				buttons: [
					{ type: 'QUICK_REPLY', text: 'Yes I am in South Delhi' },
					{ type: 'QUICK_REPLY', text: 'No I am Not in South Delh' },
				],
			},
		],
	},
	{
		id: '3369298416697493',
		name: 'propmatch_plot_requirement',
		status: 'APPROVED',
		category: 'MARKETING',
		components: [
			{
				type: 'BODY',
				text: 'Hi ,\n\nLooking for a plot or kothi in the following colony for a client.\n\nColony - {{1}} \nSize - {{2}}\n\nKindly confirm if you have something similar available',
				example: { body_text: [['Hauz Khas / Green Park / Safdarjung Enclave', '200 - 300 Sqyd']] },
			},
			{ type: 'FOOTER', text: 'www.propmatch.in' },
			{
				type: 'BUTTONS',
				buttons: [
					{ type: 'QUICK_REPLY', text: 'Plot Available 00001' },
					{ type: 'QUICK_REPLY', text: 'Not Available' },
				],
			},
		],
	},
	{
		id: '823852523056553',
		name: 'task_wautopilot_today_overview',
		status: 'APPROVED',
		category: 'UTILITY',
		components: [
			{
				type: 'BODY',
				text: 'Dear {{1}},\n\n{{2}} has updated the status of the task to *{{3}}*.\n\n*Remarks* - {{4}}\n\nHere are the task details:\n*Category* - {{5}}\n*Task* - {{6}}\n*Due Date* - {{7}}\n*Priority* - {{8}}',
				example: {
					body_text: [
						[
							'Prashant',
							'Prashant',
							'In Progress',
							'Working on this task',
							'Accounts',
							'Task 1',
							'05-Jul-24 10:00 AM',
							'High',
						],
					],
				},
			},
			{ type: 'FOOTER', text: 'This is a notification generated by task.wautopilot.com' },
			{
				type: 'BUTTONS',
				buttons: [
					{
						type: 'URL',
						text: 'Open Task',
						url: 'https://task.wautopilot.com/organizations{{1}}',
						example: ['task-id-1'],
					},
				],
			},
		],
	},
	{
		id: '950356093128522',
		name: 'lead_notification',
		status: 'APPROVED',
		category: 'MARKETING',
		components: [
			{ type: 'HEADER', format: 'TEXT', text: 'Notification from Save My V Card' },
			{
				type: 'BODY',
				text: 'Hi {{1}},\n\nThe following person has downloaded your contact card.\n\n*Name*: {{2}}\n*Contact Number*: {{3}}\n*Message Received*:  {{4}}\n\nRegards,\nSaveMyVCard',
				example: {
					body_text: [['Prashant', 'Manzar', '919718793635', 'Contact Card for Prashant Varma']],
				},
			},
			{ type: 'BUTTONS', buttons: [{ type: 'QUICK_REPLY', text: 'Get Contact Card' }] },
		],
	},
	{
		id: '7846637745396362',
		name: 'send_callback_button',
		status: 'APPROVED',
		category: 'MARKETING',
		components: [
			{ type: 'HEADER', format: 'TEXT', text: 'CALL BACK BUTTON TESTING' },
			{ type: 'BODY', text: 'Hi,\n\nThis is just to check the callback button on whatsapp.' },
			{ type: 'BUTTONS', buttons: [{ type: 'VOICE_CALL', text: 'Get in touch' }] },
		],
	},
	{
		id: '377289165329696',
		name: 'whatsapp_calling_butoon_testing',
		status: 'APPROVED',
		category: 'MARKETING',
		components: [
			{ type: 'BODY', text: 'whatsapp call testing from button' },
			{ type: 'BUTTONS', buttons: [{ type: 'VOICE_CALL', text: 'Whatsapp Call' }] },
		],
	},
	{
		id: '750640087231581',
		name: 'bni_requirement',
		status: 'APPROVED',
		category: 'MARKETING',
		components: [
			{
				type: 'BODY',
				text: 'Hi {{1}} ,\n\n{{2}}.\n\nKindly let me know if you deal in it or know another BNI member. \n\nRegards,\nPrashant Varma',
				example: { body_text: [['Name', 'Specific Ask']] },
			},
			{
				type: 'BUTTONS',
				buttons: [
					{ type: 'QUICK_REPLY', text: 'I deal in this' },
					{ type: 'QUICK_REPLY', text: "I don't deal in this" },
				],
			},
		],
	},
	{
		id: '780197390878909',
		name: 'bni_bniconnect_connection_request',
		status: 'APPROVED',
		category: 'MARKETING',
		components: [
			{
				type: 'BODY',
				text: '*Good Morning BNI* {{1}} ,\n\nSent you request on your BNIConnect Profile few days back , please accept it . \n\nAlso wanted to know the best way to stay connected with you .\n\nRegards,\nName - Prashant Varma\nCategory - Performance Coach\nUSP - Helping Businesses grow with the power of Whatsapp\nChapter - BNI Athena\nRegion - Delhi South',
				example: { body_text: [['Name']] },
			},
			{
				type: 'BUTTONS',
				buttons: [
					{ type: 'QUICK_REPLY', text: 'Whatsapp' },
					{ type: 'QUICK_REPLY', text: 'Connect on Linkedin' },
					{ type: 'QUICK_REPLY', text: 'I have left BNI' },
				],
			},
		],
	},
	{
		id: '1144349926608624',
		name: 'bni_group_joining_message1',
		status: 'APPROVED',
		category: 'MARKETING',
		components: [
			{
				type: 'BODY',
				text: 'Hi {{1}} ,\n\nBased on your request here is the group link based on your business address listed.\n\n{{2}}\n\nIf the above address is correct.\n\nPlease join Nearby Business Network Group  {{3}}',
				example: { body_text: [['Name', 'address', 'link']] },
			},
		],
	},
	{
		id: '724318373199783',
		name: 'mar_bni_pincode_message',
		status: 'APPROVED',
		category: 'MARKETING',
		components: [
			{
				type: 'BODY',
				text: 'Good Morning BNI {{1}} ,\n\nWhile going through BNIConnect a few days ago, I saw your office is in {{2}} .\n\nI visit {{2}} regularly, and would like to do 1-2-1 when I visit next time .\n\nPlease share your *Google Location of your Business* .\n\nRegards,\nPrashant Varma\nPerformance Coach\nBNI Athena, Delhi South',
				example: { body_text: [['Name', 'Colony']] },
			},
			{
				type: 'BUTTONS',
				buttons: [
					{ type: 'QUICK_REPLY', text: "Let's Connect" },
					{ type: 'QUICK_REPLY', text: 'I will connect later' },
				],
			},
		],
	},
	{
		id: '7228429823920445',
		name: 'thank_you_bni_message_vcard',
		status: 'APPROVED',
		category: 'MARKETING',
		components: [
			{
				type: 'BODY',
				text: 'Thank you for your response.\n\n*Please save my contact Card* for future reference.',
			},
		],
	},
];

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// const templates = (await TemplateService.listTemplates())!;
	const medias = await MediaService.getMedias()!;

	return (
		<Suspense fallback={<Loading />}>
			<section>
				<TemplatesProvider data={templates}>
					<MediaProvider data={medias}>{children}</MediaProvider>
				</TemplatesProvider>
			</section>
		</Suspense>
	);
}
