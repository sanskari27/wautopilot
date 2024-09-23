'use client';

import * as React from 'react';

const SettingStateContext = React.createContext<{
	setting: boolean;
	setSetting: (b: boolean) => void;
}>({
	setting: false,
	setSetting: () => {},
});

export function SettingStateProvider({ children }: { children: React.ReactNode }) {
	const [setting, setSetting] = React.useState<boolean>(false);

	return (
		<SettingStateContext.Provider
			value={{
				setting,
				setSetting,
			}}
		>
			{children}
		</SettingStateContext.Provider>
	);
}

export const useSettingDialogState = () => React.useContext(SettingStateContext);
