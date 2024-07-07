import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../store';

export default function usePermissions() {
	const {
		user_details: { permissions },
	} = useSelector((state: StoreState) => state[StoreNames.USER]);

	return permissions;
}
