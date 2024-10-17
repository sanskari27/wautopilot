'use client';

import { Template } from '@/schema/template';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import DataForm from '../_components/data-form';
import { editTemplate, removeTemplate } from '../action';

export default function TemplateForm({ id, template }: { id: string; template: Template }) {
	const router = useRouter();
	function handleSave(details: Template) {
		toast.promise(editTemplate(details, id), {
			success: () => {
				router.replace('/panel/campaigns/templates');
				return 'Template saved successfully';
			},
			error: (err) => {
				return 'Failed to save template';
			},
			loading: 'Saving Template',
		});
	}

	async function handleDelete() {
		toast.promise(removeTemplate(id, template.name), {
			loading: 'Deleting Template...',
			success: () => {
				router.replace('/panel/campaigns/templates');
				return 'Successfully Deleted Template...';
			},
			error: 'Error deleting Template',
		});
	}

	return <DataForm onSave={handleSave} onDelete={handleDelete} defaultValues={template} />;
}
