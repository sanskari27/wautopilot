'use client';
import * as React from 'react';

const DeviceAlertContext = React.createContext<{
	deviceAlert: boolean;
	setDeviceAlert: (value: boolean) => void;
}>({
	deviceAlert: false,
	setDeviceAlert: () => {},
});

export function DeviceAlertProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: number;
}) {
	const [showAlert, setShowAlert] = React.useState(false);
	React.useEffect(() => {
		if (data <= 0) {
			setShowAlert(true);
		} else {
			setShowAlert(false);
		}
	}, [data]);
	return (
		<DeviceAlertContext.Provider
			value={{
				deviceAlert: showAlert,
				setDeviceAlert: setShowAlert,
			}}
		>
			{children}
		</DeviceAlertContext.Provider>
	);
}

export const useDeviceAlert = () => React.useContext(DeviceAlertContext);
