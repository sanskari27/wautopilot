import { PRASHANT_VARMA } from '@/lib/consts';
import { cn, replaceTextWithVariables } from '@/lib/utils';
import { Template } from '@/schema/template';
import { Link, MessageCircleReply, PhoneCall } from 'lucide-react';
import { FaVideo } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import { MdOutlinePermMedia } from 'react-icons/md';
import Each from '../containers/each';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
export default function TemplatePreview({
	template,
	bodyVariables,
	carouselVariables,
	headerVariables,
}: {
	template: Template | undefined;
	headerVariables?: string[];
	bodyVariables?: string[];
	carouselVariables?: string[][];
}) {
	if (!template) {
		return <></>;
	}

	return (
		<div className='shadow-lg drop-shadow-lg min-w-[350px] max-w-lg min-h-fit w-[95%] mx-auto my-1rem bg-white rounded-2xl p-2'>
			<div className='h-full bg-white rounded-2xl overflow-hidden'>
				<div className='bg-teal-900 h-5 rounded-t-2xl' />
				<div className='bg-teal-700 h-20 flex items-center px-4 gap-3'>
					<Avatar className='w-16 h-16 select-none'>
						<AvatarImage src={PRASHANT_VARMA} alt='PV' />
						<AvatarFallback>PV</AvatarFallback>
					</Avatar>
					{/* <Avatar name='Prashant Varma' src='https://bit.ly/dan-abramov' size={'lg'} /> */}
					<p className='text-white text-lg font-medium'>Prashant Varma</p>
				</div>
				<div className='p-4 max-h-[700px] min-h-[500px] pb-24 bg-[#ece9e2]'>
					<div className='bg-white rounded-2xl p-2'>
						<div hidden={!template?.header}>
							{template.header?.format === 'TEXT' && (
								<p className='font-medium'>
									{replaceTextWithVariables(
										template.header.text,
										headerVariables ?? template.header.example
									)}
								</p>
							)}
							{template.header?.format !== 'TEXT' && (
								<div className='flex justify-center items-center bg-gray-200 w-full aspect-video rounded-xl'>
									{template.header?.format === 'IMAGE' && (
										<MdOutlinePermMedia size={'2.5rem'} color='white' />
									)}
									{template.header?.format === 'VIDEO' && <FaVideo size={'2.5rem'} color='white' />}
									{template.header?.format === 'DOCUMENT' && (
										<IoDocumentText size={'2.5rem'} color='white' />
									)}
								</div>
							)}
						</div>
						<div className='mt-2' hidden={!template.body}>
							{template.body && template.body.text ? (
								<p className='whitespace-pre-line'>
									{replaceTextWithVariables(
										template.body.text,
										bodyVariables ?? template.body.example
									)}
								</p>
							) : null}
						</div>

						<div className='mt-2' hidden={!template.footer}>
							{template.footer && template.footer.text ? (
								<p className='text-xs text-gray-500'>{template.footer.text}</p>
							) : null}
						</div>
						<Separator
							className={cn(
								'my-2 bg-gray-400',
								(template.buttons ?? []).length === 0 ? 'hidden' : 'block'
							)}
						/>
						<Each
							items={template.buttons ?? []}
							render={(button: { text: string; type: string }) => (
								<div
									className='flex justify-center items-center text-teal-500  rounded-md border border-teal-500 p-1 gap-2 my-1'
									hidden={!button.text}
								>
									{button.type === 'QUICK_REPLY' && (
										<MessageCircleReply className='w-4 h-4 text-teal-500' />
									)}
									{button.type === 'PHONE_NUMBER' && (
										<PhoneCall className='w-4 h-4 text-teal-500' />
									)}
									{button.type === 'URL' && <Link className='w-4 h-4 text-teal-500' />}
									<p className='text-sm'>{button.text}</p>
								</div>
							)}
						/>

						<div className='flex justify-end text-xs mt-1'>
							<p className='font-medium'>
								{new Date().toLocaleTimeString('en-US', {
									hour: '2-digit',
									minute: '2-digit',
								})}
							</p>
						</div>
					</div>
					<div className='overflow-x-auto'>
						<div className='mt-2 flex gap-4 min-w-full' hidden={!template.carousel}>
							<Each
								items={template.carousel?.cards ?? []}
								render={(card, index) => (
									<div
										key={index}
										className='  mt-2 min-w-full w-[500px] max-w-[500px] bg-white p-2 rounded-2xl'
									>
										<div className='flex justify-center items-center bg-gray-200 w-full aspect-video rounded-xl'>
											{card.header.format === 'IMAGE' && (
												<MdOutlinePermMedia size={'2.5rem'} color='white' />
											)}
											{card.header.format === 'VIDEO' && <FaVideo size={'2.5rem'} color='white' />}
										</div>
										<div className='mt-2'>
											{card.body.text ? (
												<p className='whitespace-pre-line'>
													{replaceTextWithVariables(
														card.body.text,
														carouselVariables?.[index] ?? card.body.example
													)}
												</p>
											) : null}
										</div>
										<div className='mt-2'>
											<Each
												items={card.buttons}
												render={(button) => (
													<div
														className='flex justify-center items-center text-teal-500  rounded-md border border-teal-500 p-1 gap-2 my-1'
														hidden={!button.text}
													>
														{button.type === 'QUICK_REPLY' && (
															<MessageCircleReply className='w-4 h-4 text-teal-500' />
														)}
														{button.type === 'PHONE_NUMBER' && (
															<PhoneCall className='w-4 h-4 text-teal-500' />
														)}
														{button.type === 'URL' && <Link className='w-4 h-4 text-teal-500' />}
														<p className='text-sm'>{button.text}</p>
													</div>
												)}
											/>
										</div>
									</div>
								)}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
