import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export default function TemplateBodyInput({
	template_body,
	phonebook_fields,
	setTemplateBody,
}: {
	template_body: {
		custom_text: string;
		phonebook_data?: string;
		variable_from: 'custom_text' | 'phonebook_data';
		fallback_value?: string;
	}[];
	phonebook_fields: {
		label: string;
		value: string;
	}[];
	setTemplateBody: (
		template_body: {
			custom_text: string;
			phonebook_data?: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value?: string;
		}[]
	) => void;
}) {
	return (
		<Each
			items={template_body}
			render={(item, index) => (
				<div className='flex flex-col'>
					<Label>
						Variable value {index + 1}
						<span className='ml-[0.2rem] text-red-800'>*</span>
					</Label>
					<div className='flex gap-3 flex-col md:flex-row'>
						<div>
							<Select
								onValueChange={(value) =>
									setTemplateBody(
										template_body.map((body, bodyIndex) => {
											if (bodyIndex === index) {
												return {
													...body,
													variable_from: value as 'custom_text' | 'phonebook_data',
												};
											}
											return body;
										})
									)
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
									setTemplateBody(
										template_body.map((body, bodyIndex) => {
											if (bodyIndex === index) {
												return {
													...body,
													phonebook_data: value as string,
												};
											}
											return body;
										})
									)
								}
								defaultValue={item.phonebook_data}
							>
								<SelectTrigger>
									<SelectValue placeholder='Select Fields' />
								</SelectTrigger>
								<SelectContent>
									<Each
										items={phonebook_fields}
										render={(field) => <SelectItem value={field.value}>{field.label}</SelectItem>}
									/>
								</SelectContent>
							</Select>
							<Input
								placeholder='Fallback Value'
								value={item.fallback_value}
								onChange={(e) =>
									setTemplateBody(
										template_body.map((body, bodyIndex) => {
											if (bodyIndex === index) {
												return {
													...body,
													fallback_value: e.target.value as string,
												};
											}
											return body;
										})
									)
								}
							/>
						</Show.ShowIf>

						<Show.ShowIf condition={item.variable_from === 'custom_text'}>
							<Input
								placeholder='Value'
								value={item.custom_text}
								onChange={(e) =>
									setTemplateBody(
										template_body.map((body, bodyIndex) => {
											if (bodyIndex === index) {
												return {
													...body,
													custom_text: e.target.value as string,
												};
											}
											return body;
										})
									)
								}
							/>
						</Show.ShowIf>
					</div>
				</div>
			)}
		/>
	);
}
