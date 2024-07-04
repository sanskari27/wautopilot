import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import FAQPage from './components/FAQ';

export default function ExtrasPage() {
	return (
		<Box width={'full'} p={'1rem'}>
			<Text fontSize={'xl'} fontWeight={'bold'}>
				Extras
			</Text>
			<Tabs isFitted variant='enclosed'>
				<TabList mb='1em'>
					<Tab>FAQ</Tab>
					<Tab>Testimonials</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<FAQPage />
					</TabPanel>
					<TabPanel>
						<p>two!</p>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
}
