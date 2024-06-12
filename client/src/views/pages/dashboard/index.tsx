import { Box } from '@chakra-ui/react';
import { useOutlet } from 'react-router-dom';

export default function Dashboard() {
	const outlet = useOutlet();
	return (
		<Box width={'full'} p='1rem'>
			{/* <Box className='w-full md:max-w-fit'>
				<Devices />
			</Box> */}
			{outlet}
		</Box>
	);
}
