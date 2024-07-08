import {
	IconButton,
	Input,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
} from '@chakra-ui/react';
import { useState } from 'react';
import { SlCalender } from 'react-icons/sl';
export default function DateTime({ onChange }: { onChange: (date: string) => void }) {
	const [date, setDate] = useState(new Date().toISOString());

	return (
		<>
			<Popover>
				<PopoverTrigger>
					<IconButton aria-label='Open Calender' icon={<SlCalender />} />
				</PopoverTrigger>
				<PopoverContent>
					<PopoverArrow />
					<PopoverCloseButton />
					<PopoverHeader>Pick Date</PopoverHeader>
					<PopoverBody>
						<Input
							placeholder='Select Date and Time'
							value={date}
							onChange={(e) => {
								setDate(e.target.value);
								onChange(e.target.value);
							}}
							type='datetime-local'
						/>
					</PopoverBody>
				</PopoverContent>
			</Popover>
		</>
	);
}
