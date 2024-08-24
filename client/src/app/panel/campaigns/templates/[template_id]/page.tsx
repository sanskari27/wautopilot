import TemplateService from '@/services/template.service';
import { notFound } from 'next/navigation';
import TemplateForm from './form';

export default async function EditTemplate({
	params: { template_id },
}: {
	params: {
		template_id: string;
	};
}) {
	const template = await TemplateService.fetchTemplate(template_id);

	if (!template) {
		return notFound();
	}

	return (
		<div className='p-4'>
			<h2 className='font-bold text-2xl'>Meta Template</h2>
			<div className='mt-4'>
				<TemplateForm template={template} id={template_id} />
			</div>
		</div>
	);
}
