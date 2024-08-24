import ChatbotFlowService from '@/services/chatbot-flow.service';
import { notFound } from 'next/navigation';
import RenderFlow from './_components/RenderFlow';

export default async function CustomizeChatbotFlow({
	params: { chatbot_id },
}: {
	params: {
		chatbot_id: string;
	};
}) {
	const data = await ChatbotFlowService.getNodesAndEdges(chatbot_id);

	if (!data) {
		return notFound();
	}

	const { nodes, edges } = data;

	return <RenderFlow id={chatbot_id} nodes={nodes} edges={edges} />;
}
