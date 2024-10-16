import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import MediaSelectorDialog from './dialogs/media-selector';

export default function TemplateHeaderInput({
	template_header,
	setTemplateHeader,
	phonebook_fields,
}: {
	template_header: {
		type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'NONE';
		link?: string;
		media_id?: string;
		text?: {
			custom_text: string;
			phonebook_data?: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value?: string;
		}[];
	};
	phonebook_fields: {
		label: string;
		value: string;
	}[];
	setTemplateHeader: (header: {
		type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'NONE';
		link?: string;
		media_id?: string;
		text?: {
			custom_text: string;
			phonebook_data?: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value?: string;
		}[];
	}) => void;
}) {
	return (
		<>
			<Show.ShowIf
				condition={
					(!!template_header && template_header.type === 'IMAGE') ||
					template_header.type === 'VIDEO' ||
					template_header.type === 'DOCUMENT'
				}
			>
				<div className='flex items-center gap-6'>
					<p className='font-medium'>
						Header Media<span className='mr-[0.2rem] text-red-800'>*</span>:{' '}
					</p>
					<MediaSelectorDialog
						singleSelect
						selectedValue={template_header?.media_id ? [template_header?.media_id] : []}
						onConfirm={(media) => {
							setTemplateHeader({
								...template_header,
								media_id: media[0],
							});
						}}
						returnType='media_id'
						type={template_header.type.toLowerCase() as 'image' | 'video' | 'document'}
					>
						<Button variant={'outline'}>Select Media</Button>
					</MediaSelectorDialog>

					<span>{template_header?.media_id ? 'Media selected' : 'No media selected'}</span>
				</div>
			</Show.ShowIf>
			<Show.ShowIf condition={(template_header.text ?? []).length > 0}>
				<div className='border-2 p-2 rounded-lg border-dashed'>
					<div className='text-md text-center font-bold'>Header Variables</div>
					<Each
						items={template_header.text ?? []}
						render={(item, index) => (
							<div className='flex flex-col'>
								<Label>
									Variable value {index + 1}
									<span className='ml-[0.2rem] text-red-800'>*</span>
								</Label>
								<div className='flex gap-3 flex-col md:flex-row'>
									<div className='w-[150px]'>
										<Select
											onValueChange={(value) =>
												setTemplateHeader({
													...template_header,
													text: (template_header.text ?? []).map((text, i) => {
														if (i === index) {
															return {
																...text,
																variable_from: value as 'custom_text' | 'phonebook_data',
															};
														}
														return text;
													}),
												})
											}
											defaultValue={item.variable_from}
										>
											<SelectTrigger>
												<SelectValue placeholder='Data From' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='phonebook_data'>Phonebook Data</SelectItem>
												<SelectItem value='custom_text'>Custom Text</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<Show.ShowIf condition={item.variable_from === 'phonebook_data'}>
										<Select
											onValueChange={(value) =>
												setTemplateHeader({
													...template_header,
													text: (template_header.text ?? []).map((text, i) => {
														if (i === index) {
															return {
																...text,
																phonebook_data: value as string,
															};
														}
														return text;
													}),
												})
											}
											defaultValue={item.phonebook_data}
										>
											<SelectTrigger>
												<SelectValue placeholder='Select Fields' />
											</SelectTrigger>
											<SelectContent>
												<Each
													items={phonebook_fields}
													render={(field) => (
														<SelectItem value={field.value}>{field.label}</SelectItem>
													)}
												/>
											</SelectContent>
										</Select>
										<Input
											placeholder='Fallback Value'
											value={item.fallback_value}
											onChange={(e) =>
												setTemplateHeader({
													...template_header,
													text: (template_header.text ?? []).map((text, i) => {
														if (i === index) {
															return {
																...text,
																fallback_value: e.target.value,
															};
														}
														return text;
													}),
												})
											}
										/>
									</Show.ShowIf>

									<Show.ShowIf condition={item.variable_from === 'custom_text'}>
										<Input
											placeholder='Value'
											value={item.custom_text}
											onChange={(e) =>
												setTemplateHeader({
													...template_header,
													text: (template_header.text ?? []).map((text, i) => {
														if (i === index) {
															return {
																...text,
																custom_text: e.target.value,
															};
														}
														return text;
													}),
												})
											}
										/>
									</Show.ShowIf>
								</div>
							</div>
						)}
					/>
				</div>
			</Show.ShowIf>
		</>
	);
}
