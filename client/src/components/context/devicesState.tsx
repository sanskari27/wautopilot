'use client';

import * as React from 'react';

const DevicesStateContext = React.createContext<{
	devices: boolean;
	addDevice: boolean;
	setDevices: (b: boolean) => void;
	setAddDevice: (b: boolean) => void;
}>({
	devices: false,
	addDevice: false,
	setDevices: () => {},
	setAddDevice: () => {},
});

export function DevicesStateProvider({ children }: { children: React.ReactNode }) {
	const [devices, setDevices] = React.useState<boolean>(false);
	const [addDevice, setAddDevice] = React.useState<boolean>(false);

	return (
		<DevicesStateContext.Provider
			value={{
				devices,
				addDevice,
				setDevices,
				setAddDevice,
			}}
		>
			{children}
		</DevicesStateContext.Provider>
	);
}

export const useDevicesDialogState = () => React.useContext(DevicesStateContext);
