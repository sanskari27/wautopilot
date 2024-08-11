'use client';
import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PRASHANT_VARMA } from '@/lib/consts';
import { cn } from '@/lib/utils';
import { TWhatsappFlow } from '@/schema/whatsapp-flow';

export default function PreviewFlowContents({
	screen,
}: {
	screen: TWhatsappFlow['screens'][0] | null;
}) {
	return (
		<div>
			<div className='shadow-lg drop-shadow-lg min-w-[200px] max-w-lg min-h-fit w-[95%] mx-auto my-1rem bg-white rounded-2xl p-2 '>
				<div className='h-full bg-white rounded-2xl overflow-hidden flex flex-col flex-1 relative'>
					<div className='w-full h-full bg-black/60 absolute top-0 left-0' />
					<div className='bg-teal-900 h-5 rounded-t-2xl' />
					<div className='bg-teal-700 h-20 flex items-center px-4 gap-3'>
						<Avatar className='w-16 h-16 select-none'>
							<AvatarImage src={PRASHANT_VARMA} alt='PV' />
							<AvatarFallback>PV</AvatarFallback>
						</Avatar>
						<p className='text-white text-lg font-medium'>Prashant Varma</p>
					</div>
					<div className='h-[700px]  bg-[#ece9e2] flex flex-col'>
						<div className='bg-white rounded-t-2xl p-2 mt-12 h-full  -mb-2 shadow-sm z-10 flex flex-col flex-1 '>
							<div className='h-[4px] w-1/4 mx-auto bg-gray-400 rounded-full' />
							<Show.ShowIf condition={!!screen}>
								<div className='mt-2 flex flex-col flex-1 overflow-y-auto'>
									<div className='text-center text-lg font-semibold'>{screen?.title}</div>
									<Each
										items={screen?.children ?? []}
										render={(content) => {
											if (
												content.type === 'TextHeading' ||
												content.type === 'TextSubheading' ||
												content.type === 'TextBody' ||
												content.type === 'TextCaption'
											) {
												return (
													<div
														className={cn(
															'mt-2',
															content.type === 'TextHeading' && 'text-2xl font-bold',
															content.type === 'TextSubheading' && 'text-lg font-semibold',
															content.type === 'TextBody' && 'text-base',
															content.type === 'TextCaption' && 'text-sm text-gray-500'
														)}
													>
														{content.text}
													</div>
												);
											} else if (content.type === 'Image') {
												return (
													<div className='mt-2 flex justify-center items-center'>
														<img
															src={content.src}
															alt='Image'
															style={{
																height: `${content.height}px`,
																width: `${content.height}px`,
																objectFit: content['scale-type'],
															}}
														/>
													</div>
												);
											} else if (content.type === 'TextInput') {
												return (
													<div className='flex flex-col gap-1.5 mt-3'>
														<Label>
															{content.label}
															{content.required && <span className='text-red-500 ml-1'>*</span>}
														</Label>
														<Input placeholder={content.label} type={content['input-type']} />
														<p className='text-xs text-gray-400 pl-3'>{content['helper-text']}</p>
													</div>
												);
											} else if (content.type === 'TextArea') {
												return (
													<div className='flex flex-col gap-1.5 mt-3'>
														<Label>
															{content.label}
															{content.required && <span className='text-red-500 ml-1'>*</span>}
														</Label>
														<Textarea className='!ring-0' placeholder={content.label} />
														<p className='text-xs text-gray-400 pl-3'>{content['helper-text']}</p>
													</div>
												);
											} else if (content.type === 'DatePicker') {
												return (
													<div className='flex flex-col gap-1.5 mt-3'>
														<Label>
															{content.label}
															{content.required && <span className='text-red-500 ml-1'>*</span>}
														</Label>
														<DatePicker onChange={() => {}} />
														<p className='text-xs text-gray-400 pl-3'>{content['helper-text']}</p>
													</div>
												);
											} else if (content.type === 'RadioButtonsGroup') {
												return (
													<div className='flex flex-col gap-1.5 mt-3'>
														<Label className='text-gray-500'>
															{content.label}
															{content.required && <span className='text-red-500 ml-1'>*</span>}
														</Label>
														<div className='flex flex-col gap-2.5 mt-3'>
															{content['data-source'].map((option) => (
																<div key={option} className='flex items-center gap-6'>
																	<Label className='w-full ' htmlFor={option}>
																		{option}
																	</Label>
																	<input type='radio' name={content.name} id={option} />
																</div>
															))}
														</div>
													</div>
												);
											} else if (content.type === 'CheckboxGroup') {
												return (
													<div className='flex flex-col gap-1.5 mt-3'>
														<Label className='text-gray-500'>
															{content.label}
															{content.required && <span className='text-red-500 ml-1'>*</span>}
														</Label>
														<div className='flex flex-col gap-2.5 mt-3'>
															{content['data-source'].map((option) => (
																<div key={option} className='flex items-center gap-6'>
																	<Label className='w-full ' htmlFor={option}>
																		{option}
																	</Label>
																	<input type='checkbox' />
																</div>
															))}
														</div>
													</div>
												);
											} else if (content.type === 'Dropdown') {
												return (
													<div className='flex flex-col gap-1.5 mt-3'>
														<Label className='text-gray-500'>
															{content.label}
															{content.required && <span className='text-red-500 ml-1'>*</span>}
														</Label>
														<div className='flex flex-col gap-2.5 mt-3'>
															<Select>
																<SelectTrigger>
																	<SelectValue placeholder={content.label} />
																</SelectTrigger>
																<SelectContent>
																	{content['data-source'].map((option) => (
																		<SelectItem key={option} value={option}>
																			{option}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
														</div>
													</div>
												);
											} else if (content.type === 'OptIn') {
												return (
													<div className='flex flex-col gap-1.5 mt-3'>
														<div className='flex items-center gap-6'>
															<input type='checkbox' />
															<Label className='w-full '>
																{content.label}
																{content.required && <span className='text-red-500 ml-1'>*</span>}
															</Label>
														</div>
													</div>
												);
											} else if (content.type === 'Footer') {
												return (
													<div className='flex-1 flex flex-col justify-end'>
														<Button className='mt-3 w-full mx-auto rounded-full mb-2'>
															{content.label}
														</Button>
														<p className='text-center mb-1 text-xs'>
															Managed by the business.{' '}
															<span className='text-primary'>Learn more</span>
														</p>
													</div>
												);
											}

											return <></>;
										}}
									/>
								</div>
							</Show.ShowIf>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
