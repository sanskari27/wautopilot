import { DeleteIcon } from '@chakra-ui/icons';
import {
	Button,
	IconButton,
	Table,
	TableCaption,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { NAVIGATION } from '../../../../config/const';
import DeviceService from '../../../../services/device.service';
import { setSelectedDeviceId } from '../../../../store/reducers/UserReducers';
import DeleteAlert, { DeleteAlertHandle } from '../../../components/delete-alert';
import Each from '../../../components/utils/Each';

export default function Devices() {
	const confirmationAlertDialogRef = useRef<DeleteAlertHandle>(null);
	const dispatch = useDispatch();
	const [devices, setDevices] = useState<
		{
			id: string;
			verifiedName: string;
			phoneNumber: string;
			phoneNumberId: string;
			waid: string;
		}[]
	>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		DeviceService.listDevices()
			.then((devices) => {
				setDevices(devices);
				if (devices.length > 0) {
					dispatch(setSelectedDeviceId(devices[0].id ?? '')); // TODO
				}
			})
			.finally(() => setLoading(false));
	}, []);

	const handleRemoveDevice = (id: string) => {
		DeviceService.removeDevice(id).then((res) => {
			res && DeviceService.listDevices().then(setDevices);
		});
	};

	return (
		<>
			<Text fontWeight={'bold'} fontSize={'2xl'}>
				Devices
			</Text>
			<TableContainer width={'full'} border={'1px dashed gray'} rounded={'2xl'}>
				<Table variant='striped' colorScheme='gray'>
					<TableCaption>
						<Link to={`${NAVIGATION.APP}/${NAVIGATION.DASHBOARD}/${NAVIGATION.ADD_DEVICE}`}>
							<Button colorScheme='green' leftIcon={<BiPlus color='white' fontSize={'1.2rem'} />}>
								Add Device
							</Button>
						</Link>
					</TableCaption>
					<Thead>
						<Tr>
							<Th>Verified Name</Th>
							<Th>Phone Number</Th>
							<Th>Phone Number ID</Th>
							<Th>WABA ID</Th>
							<Th></Th>
						</Tr>
					</Thead>
					<Tbody>
						{loading && (
							<Tr>
								<Td colSpan={4} textAlign={'center'}>
									Loading...
								</Td>
							</Tr>
						)}
						<Each
							items={devices}
							render={(device, index) => (
								<Tr key={index}>
									<Td>{device.verifiedName}</Td>
									<Td>{device.phoneNumber}</Td>
									<Td>{device.phoneNumberId}</Td>
									<Td>{device.waid}</Td>
									<Td>
										<IconButton
											aria-label='Remove Device'
											colorScheme='red'
											size={'sm'}
											icon={<DeleteIcon color='white' fontSize={'0.75rem'} />}
											onClick={() => confirmationAlertDialogRef.current?.open(device.id)}
										/>
									</Td>
								</Tr>
							)}
						/>
					</Tbody>
				</Table>
			</TableContainer>
			<DeleteAlert ref={confirmationAlertDialogRef} onConfirm={handleRemoveDevice} type='Device' />
		</>
	);
}
