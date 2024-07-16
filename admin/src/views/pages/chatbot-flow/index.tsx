import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, Text, useToast } from '@chakra-ui/react';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { Link, useOutlet } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import AllChatbotFlows from './components/AllChatbotFlows';
import ChatBotService from '../../../services/chatbot.service';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../store';

export default function ChatbotFlow() {
	const outlet = useOutlet();
	const toast = useToast();

	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);


	const handleDownloadWhatsappFlow = () => {
		toast.promise(ChatBotService.exportWhatsappFlowData(selected_device_id), {
			success: {
				title: 'Exported successfully',
			},
			error: {
				title: 'Failed to export',
			},
			loading: {
				title: 'Exporting...',
			},
		});
	};

	if (outlet) {
		return outlet;
	}
	return (
		<Flex
			direction={'column'}
			gap={'1rem'}
			className='custom-scrollbar'
			justifyContent={'center'}
			p={'1rem'}
		>
			<HStack justifyContent={'space-between'}>
				<Text fontSize={'2xl'} fontWeight={'bold'}>
					ChatBot Flow
				</Text>
				<Flex gap={'1rem'}>
					<Button
						variant='solid'
						size={'sm'}
						colorScheme='green'
						leftIcon={<FaCloudDownloadAlt />}
						onClick={handleDownloadWhatsappFlow}
					>
						Download Whatsapp Flow
					</Button>
					<Link to={`${NAVIGATION.APP}/${NAVIGATION.CHATBOT_FLOW}/new`}>
						<Button variant='outline' size={'sm'} colorScheme='green' leftIcon={<AddIcon />}>
							Create
						</Button>
					</Link>
				</Flex>
			</HStack>
			<AllChatbotFlows />
		</Flex>
	);
}
