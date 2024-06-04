import IAccount from '../../mongo/types/account';
import UserService from './user';

export default class PhoneBookService extends UserService {
	public constructor(account: IAccount) {
		super(account);
	}

    public async addRecord() {
        
    }
}
