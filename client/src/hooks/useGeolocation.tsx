import { useToast } from '@chakra-ui/react';
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

	const toast = useToast();

	useEffect(() => {
		if (!navigator.geolocation) {
			toast({
				title: 'Geolocation is not supported by your browser.',
				status: 'error',
				isClosable: false,
				duration: 5000,
				position: 'top',
			});
			return;
		}
		setLocation({
			location: { latitude: 0, longitude: 0 },
			isLocating: true,
		});
		getPositionFunction()
			.then((position: { coords: { latitude: number; longitude: number } }) => {
				toast({
					title: 'Location found',
					status: 'success',
					isClosable: true,
					duration: 4000,
					position: 'top',
				});
				const { latitude, longitude } = position.coords;
				setLocation({
					location: { latitude, longitude },
					isLocating: false,
				});
			})
			.catch((error: { message: string }) => {
				toast({
					title: 'Location not found',
					description: error.message,
					status: 'error',
					isClosable: true,
					duration: 4000,
					position: 'top',
				});
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
