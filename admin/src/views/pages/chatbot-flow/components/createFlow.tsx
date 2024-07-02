import { Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function CreateChatbotFlow() {
	const navigate = useNavigate();
	return (
		<Flex
			direction={'column'}
			gap={'1rem'}
			className='custom-scrollbar'
			justifyContent={'center'}
			p={'1rem'}
		>
			{/* <HStack>
				<Icon
                
					as={ChevronLeftIcon}
					onClick={() => navigate(`${NAVIGATION.APP}/${NAVIGATION.CHATBOT_FLOW}`)}
				/>
				<Text fontSize={'2xl'} fontWeight={'bold'}>
					ChatbotFlow
				</Text>
			</HStack> */}
		</Flex>
	);
}
