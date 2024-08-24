import ChatBotService from '@/services/chatbot.service';
import Form from './form';

export default async function UpdateAssets({
	params: { flow_id },
	searchParams,
}: {
	params: {
		flow_id: string;
	};
	searchParams: {
		can_edit: string;
	};
}) {
	const canEdit = searchParams.can_edit === 'true';
	const contents = await ChatBotService.whatsappFlowContents(flow_id);

	return <Form id={flow_id} contents={{ screens: contents || [] }} editable={canEdit} />;
}
