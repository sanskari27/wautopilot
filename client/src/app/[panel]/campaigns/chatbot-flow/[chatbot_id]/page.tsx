'use client';

import Show from '@/components/containers/show';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { parseToObject } from '@/lib/utils';
import { ChatbotFlowSchema } from '@/schema/chatbot-flow';
import ChatbotFlowService from '@/services/chatbot-flow.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeftIcon } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const DEFAULT_VALUE = {
	id: '',
	name: '',
	trigger: '',
	options: 'INCLUDES_IGNORE_CASE',
	isActive: false,
};

export default function CreateChatbotFlow() {
	const router = useRouter();
    const params = useParams();

	const raw = parseToObject(useSearchParams().get('data'));
	const isEditing = !!raw;

	const form = useForm<z.infer<typeof ChatbotFlowSchema>>({
		resolver: zodResolver(ChatbotFlowSchema),
		mode: 'onChange',
		defaultValues: raw || DEFAULT_VALUE,
	});

	const handleSubmit = (data: z.infer<typeof ChatbotFlowSchema>) => {
		const promise = isEditing
			? ChatbotFlowService.editChatbotFlow({ botId: data.id, details: data })
			: ChatbotFlowService.createChatbotFlow(data);
		toast.promise(promise, {
			loading: 'Saving...',
			success: ()=>{
                router.replace(`/${params.panel}/campaigns/chatbot-flow/${data.id}/customize`);
                return 'Saved'},
			error: 'Failed to save',
		});
	};

	return (
		<div className='custom-scrollbar flex flex-col gap-2 justify-center p-4'>
			{/*--------------------------------- TRIGGER SECTION--------------------------- */}
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className='flex flex-col rounded-xl mb-4 gap-8'
				>
					<div className='flex flex-col gap-2'>
						<Button className='self-start' variant={'link'} onClick={() => router.back()}>
							<ChevronLeftIcon className='w-6 h-6' />
						</Button>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem className='space-y-0 flex-1'>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder='eg. Fanfest' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='flex justify-between items-center'>
							<p>Trigger</p>
							<div className='flex gap-2 items-center'>
								<FormField
									control={form.control}
									name='trigger'
									render={({ field }) => (
										<FormItem className='space-y-0 flex-1 inline-flex items-center gap-2'>
											<FormControl>
												<Checkbox
													checked={field.value === ''}
													onCheckedChange={(checked) => checked && field.onChange('')}
												/>
											</FormControl>
											<div className='text-sm'>Default Message</div>
										</FormItem>
									)}
								/>
							</div>
						</div>
                        
						<FormField
							control={form.control}
							name='trigger'
							render={({ field }) => (
								<FormItem className='space-y-0 flex-1'>
									<FormControl>
										<Textarea placeholder='eg. Fanfest' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/*--------------------------------- RECIPIENTS SECTION--------------------------- */}

					<div className='grid grid-cols-1 gap-4'>
						<FormField
							control={form.control}
							name='options'
							render={({ field }) => (
								<FormItem className='space-y-0 flex-1'>
									<FormLabel>Conditions</FormLabel>
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='INCLUDES_IGNORE_CASE'>Includes Ignore Case</SelectItem>
												<SelectItem value='INCLUDES_MATCH_CASE'>Includes Match Case</SelectItem>
												<SelectItem value='EXACT_IGNORE_CASE'>Exact Ignore Case</SelectItem>
												<SelectItem value='EXACT_MATCH_CASE'>Exact Match Case</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='flex gap-4'>
						<Show.ShowIf condition={isEditing}>
							<Button
								className='flex-1'
								variant={'outline'}
								type='button'
								onClick={() => router.back()}
							>
								Cancel
							</Button>
						</Show.ShowIf>
						<Button className='flex-1' type='submit'>
							Save
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
