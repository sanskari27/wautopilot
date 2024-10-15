'use client';
import * as React from 'react';

const BalanceAlertContext = React.createContext<{
	deviceAlert: boolean;
	setBalanceAlert: (value: boolean) => void;
}>({
	deviceAlert: false,
	setBalanceAlert: () => {},
});

export function BalanceReminder({
	children,
	balance,
}: {
	children: React.ReactNode;
	balance: number;
}) {
	const [showAlert, setShowAlert] = React.useState(false);
	React.useEffect(() => {
		if (balance <= 100) {
			setShowAlert(true);
		} else {
			setShowAlert(false);
		}
	}, [balance]);
	return (
		<BalanceAlertContext.Provider
			value={{
				deviceAlert: showAlert,
				setBalanceAlert: setShowAlert,
			}}
		>
			{children}
		</BalanceAlertContext.Provider>
	);
}

export const useBalanceAlert = () => React.useContext(BalanceAlertContext);
