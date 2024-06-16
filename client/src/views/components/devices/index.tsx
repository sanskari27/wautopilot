import { DeleteIcon } from '@chakra-ui/icons';
import {
	Button,
	Checkbox,
	IconButton,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useBoolean,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DeviceService from '../../../services/device.service';
import { StoreNames, StoreState } from '../../../store';
import { setDevicesList } from '../../../store/reducers/DevicesReducers';
import { setSelectedDeviceId } from '../../../store/reducers/UserReducers';
import AddDevice, { AddDeviceHandle } from '../addDevice';
import DeleteAlert, { DeleteAlertHandle } from '../delete-alert';
import Each from '../utils/Each';

export type DevicesHandle = {
	open: () => void;
};

const DevicesDialog = forwardRef<DevicesHandle>((_, ref) => {
	const confirmationAlertDialogRef = useRef<DeleteAlertHandle>(null);
	const addDeviceDialogRef = useRef<AddDeviceHandle>(null);
	const [open, setIsOpen] = useBoolean(false);
	const dispatch = useDispatch();

	const {
		list,
		uiDetails: { loadingDevices },
	} = useSelector((state: StoreState) => state[StoreNames.DEVICES]);

	const {
		selected_device_id,
		user_details: { no_of_devices },
	} = useSelector((state: StoreState) => state[StoreNames.USER]);

	useImperativeHandle(ref, () => ({
		open: () => {
			setIsOpen.on();
		},
	}));

	// useEffect(() => {
	// 	DeviceService.listDevices()
	// 		.then((devices) => {
	// 			setDevices(devices);
	// 			if (devices.length > 0) {
	// 				dispatch(setSelectedDeviceId(devices[0].id ?? '')); // TODO
	// 			}
	// 		})
	// 		.finally(() => setLoading(false));
	// }, []);

	const handleChangeSelectedDeviceId = (id: string) => {
		dispatch(setSelectedDeviceId(id));
	};

	const handleRemoveDevice = (id: string) => {
		DeviceService.removeDevice(id).then((res) => {
			res && DeviceService.listDevices().then((res) => dispatch(setDevicesList(res)));
		});
	};

	return (
		<>
			<Modal isOpen={open} onClose={setIsOpen.off} size={'5xl'}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontWeight={'bold'} fontSize={'2xl'} textAlign={'center'}>
						Devices
					</ModalHeader>
					<ModalBody>
						<TableContainer width={'full'}>
							<Table variant='striped' colorScheme='gray'>
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
									{loadingDevices && (
										<Tr>
											<Td colSpan={5} textAlign={'center'}>
												Loading...
											</Td>
										</Tr>
									)}
									{list.length > 0 ? (
										<Each
											items={list}
											render={(device, index) => (
												<Tr key={index}>
													<Td>
														<Checkbox
															colorScheme='green'
															mr={'5px'}
															isChecked={selected_device_id === device.id}
															onChange={() => {
																handleChangeSelectedDeviceId(device.id);
															}}
														/>
														{device.verifiedName}
													</Td>
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
									) : (
										<Tr>
											<Td colSpan={4} textAlign={'center'}>
												No Devices Found
											</Td>
										</Tr>
									)}
								</Tbody>
							</Table>
						</TableContainer>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='blue' mr={3} onClick={setIsOpen.off}>
							Close
						</Button>

						<Button
							hidden={no_of_devices <= list.length}
							colorScheme='green'
							onClick={addDeviceDialogRef.current?.open}
						>
							Add Device
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<DeleteAlert ref={confirmationAlertDialogRef} onConfirm={handleRemoveDevice} type='Device' />
			<AddDevice ref={addDeviceDialogRef} />
		</>
	);
});

export default DevicesDialog;
