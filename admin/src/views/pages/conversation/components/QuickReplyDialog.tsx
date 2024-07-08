import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';

export type QuickReplyHandle = {
	open: () => void;
	close: () => void;
};

const QuickReplyDialog = forwardRef<QuickReplyHandle>((_, ref) => {
	const [isOpen, setIsOpen] = useState(false);

	useImperativeHandle(ref, () => ({
		open: () => setIsOpen(true),
		close: () => setIsOpen(false),
	}));

	return (
		<Modal variant={'outline'} isOpen={isOpen} onClose={() => setIsOpen(false)}>
			<ModalContent>
				<ModalHeader>Quick Reply</ModalHeader>
				<ModalBody>hello</ModalBody>
				<ModalFooter>
					<Button colorScheme='blue' onClick={() => setIsOpen(false)}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
});

export default QuickReplyDialog;
