import {
	Avatar,
	Box,
	Button,
	Flex,
	HStack,
	Icon,
	Tag,
	TagLabel,
	Text,
	Wrap,
	WrapItem,
	useBoolean,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useOutlet } from 'react-router-dom';
import AgentService from '../../../services/agent.service';
import { StoreNames, StoreState } from '../../../store';
import DateTime from '../../components/dateTime';
import Each from '../../components/utils/Each';
import AssignTask from './components/AssignTask';

type Task = {
	id: string;
	hidden: boolean;
	message: string;
	due_date: string;
};

export default function Tasks() {
	const outlet = useOutlet();
	const [showHidden, setShowHidden] = useBoolean();
	const [tasks, setTasks] = useState<Task[]>([]);

	const [dateStart, setDateStart] = useState(
		new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString()
	);
	const [dateEnd, setDateEnd] = useState(new Date().toISOString());

	const [selectedAgent, setSelectedAgent] = useState('me');

	const { list: agents } = useSelector((state: StoreState) => state[StoreNames.AGENT]);

	const filteredList = tasks.filter((item) => showHidden || item.hidden === showHidden);

	useEffect(() => {
		setTasks([]);
		AgentService.getAssignedTasks(selectedAgent, {
			date_from: dateStart,
			date_to: dateEnd,
		}).then(setTasks);
	}, [selectedAgent, agents, dateStart, dateEnd]);

	const hideTask = (id: string) => {
		AgentService.hideAssignedTask(id).then(() => {
			setTasks((prev) => prev.map((item) => (item.id === id ? { ...item, hidden: true } : item)));
		});
	};

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
					Tasks
				</Text>
				<AssignTask />
			</HStack>

			<Box border='1px dashed gray' padding={'0.5rem'} rounded='full'>
				<Wrap spacing='1rem'>
					<Each
						items={agents}
						render={(item) => (
							<WrapItem>
								<Tag
									size='lg'
									borderRadius='full'
									cursor={'pointer'}
									bgColor={selectedAgent === item.id ? 'green.500' : 'gray.300'}
									color={selectedAgent === item.id ? 'white' : 'black'}
									onClick={() => setSelectedAgent(item.id)}
								>
									<Avatar size='xs' name={item.name} ml={-1} mr={2} />
									<TagLabel>{item.name}</TagLabel>
								</Tag>
							</WrapItem>
						)}
					/>
				</Wrap>
			</Box>

			<Flex justifyContent={'space-between'} alignItems={'center'}>
				<Text
					textAlign={'right'}
					fontWeight={'medium'}
					fontSize={'sm'}
					textDecoration={'underline'}
					onClick={setShowHidden.toggle}
					cursor={'pointer'}
					userSelect={'none'}
				>
					{showHidden ? 'Hide Completed' : 'Show Completed'}
				</Text>
				<Flex alignItems={'center'} gap={'0.75rem'}>
					<DateTime onChange={setDateStart} />
					<Icon as={FaArrowRight} />
					<DateTime onChange={setDateEnd} />
				</Flex>
			</Flex>

			<Text textAlign={'center'} fontSize={'sm'} textDecoration={'underline'} mt={'-1rem'}>
				From {new Date(dateStart).toDateString()} to {new Date(dateEnd).toDateString()}
			</Text>
			<Box width={'full'} border={'1px dashed black'} rounded={'xl'} py={'1rem'} mt={'-1rem'}>
				<Text
					textAlign={'center'}
					fontWeight={'medium'}
					fontSize={'2xl'}
					textDecoration={'underline'}
				>
					Assigned Tasks
				</Text>

				<Flex direction={'column'} gap='1rem' mx={'1rem'} marginTop={'1rem'}>
					{filteredList.length === 0 && (
						<Text textAlign={'center'} fontWeight={'medium'}>
							No tasks assigned .
						</Text>
					)}
					<Each
						items={filteredList}
						key={'id'}
						render={(item) => <TaskItem {...item} onHide={() => hideTask(item.id)} />}
					/>
				</Flex>
			</Box>
			<Box>
				<Text textAlign={'center'}>Mark completed by clicking completed button.</Text>
			</Box>

			{outlet}
		</Flex>
	);
}

function TaskItem({
	message,
	onHide,

	hidden,
	due_date,
}: Task & { onHide: () => void }) {
	const [isChecked, setIsChecked] = useBoolean();

	return (
		<Box
			paddingX={'0.75rem'}
			paddingY={'0.5rem'}
			bg={'gray.100'}
			rounded={'xl'}
			whiteSpace={'pre-wrap'}
		>
			<CustomCheckbox
				isChecked={isChecked}
				onChange={() => {
					setIsChecked.toggle();
				}}
			/>
			<span className='font-medium'>{due_date}</span> {message}
			<Button size='xs' colorScheme='green' ml={'1rem'} onClick={onHide} isDisabled={hidden}>
				{hidden ? 'Completed' : 'Mark Completed'}
			</Button>
		</Box>
	);
}

function EmptyDot({ onClick }: { onClick?: () => void }) {
	return (
		<Box
			width={'0.85rem'}
			height={'0.85rem'}
			border={'1px solid green'}
			rounded={'full'}
			marginRight={'0.5rem'}
			onClick={onClick}
			display={'inline-flex'}
			justifyContent={'center'}
			alignItems={'center'}
		>
			<Box
				width={'0.35rem'}
				height={'0.35rem'}
				bg={'white'}
				rounded={'full'}
				display={'inline-block'}
			/>
		</Box>
	);
}

function Dot({ onClick }: { onClick?: () => void }) {
	return (
		<Box
			width={'0.85rem'}
			height={'0.85rem'}
			bg={'green'}
			rounded={'full'}
			marginRight={'0.5rem'}
			onClick={onClick}
			display={'inline-flex'}
			justifyContent={'center'}
			alignItems={'center'}
		>
			<Box
				width={'0.35rem'}
				height={'0.35rem'}
				bg={'white'}
				rounded={'full'}
				display={'inline-block'}
			/>
		</Box>
	);
}

function CustomCheckbox({
	isChecked,
	onChange,
}: {
	isChecked: boolean;
	onChange?: (checked: boolean) => void;
}) {
	const toggle = () => {
		if (onChange) {
			onChange(!isChecked);
		}
	};

	return isChecked ? <Dot onClick={toggle} /> : <EmptyDot onClick={toggle} />;
}
