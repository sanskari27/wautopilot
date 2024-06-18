import { useEffect, useState } from 'react';
import { singletonHook } from 'react-singleton-hook';

type InitialLocationType = {
	location: { latitude: number; longitude: number };
	isLocating: boolean;
};

const initStatus: InitialLocationType = {
	location: { latitude: 0, longitude: 0 },
	isLocating: false,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let globalSet: any = () => {
	throw new Error('you must useGeolocation before setting its state');
};

export const useGeoLocation = singletonHook(initStatus, () => {
	const [location, setLocation] = useState<InitialLocationType>(initStatus);
	globalSet = setLocation;

	useEffect(() => {
		if (!navigator.geolocation) {
			return;
		}
		setLocation({
			location: { latitude: 0, longitude: 0 },
			isLocating: true,
		});
		getPositionFunction()
			.then((position: { coords: { latitude: number; longitude: number } }) => {
				const { latitude, longitude } = position.coords;
				setLocation({
					location: { latitude, longitude },
					isLocating: false,
				});
			})
			.catch(() => {
				setLocation({
					location: { latitude: 0, longitude: 0 },
					isLocating: false,
				});
			});
	}, []);

	return location;
});

const getPositionFunction = function (options?: PositionOptions) {
	return new Promise(function (resolve: PositionCallback, reject) {
		navigator.geolocation.getCurrentPosition(resolve, reject, options);
	});
};

export const setLocation = (data: InitialLocationType) => globalSet(data);

export const refresh = () => {
	setLocation({
		location: { latitude: 0, longitude: 0 },
		isLocating: true,
	});
};
