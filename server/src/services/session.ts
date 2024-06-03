import { SessionDB } from '../../mongo';
import ISession from '../../mongo/types/session';
import { CustomError, ERRORS } from '../errors';
import { IDType } from '../types';

type SessionDetails = {
	ipAddress?: string;
	platform?: string;
	browser?: string;
	latitude?: number;
	longitude?: number;
};

export default class SessionService {
	private _session: ISession;

	private constructor(session: ISession) {
		this._session = session;
	}

	static async findSessionById(id: IDType) {
		const history = await SessionDB.findById(id);
		if (!history) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}

		return new SessionService(history);
	}

	static async findSessionByRefreshToken(token: string) {
		const history = await SessionDB.findOne({
			refreshToken: token,
		});
		if (!history) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}

		return new SessionService(history);
	}

	static async createSession(account_id: IDType, sessionDetails: SessionDetails) {
		const session = await SessionDB.create({
			account: account_id,
			ipAddress: sessionDetails.ipAddress || '',
			platform: sessionDetails.platform || '',
			browser: sessionDetails.browser || '',
			latitude: sessionDetails.latitude || 0,
			longitude: sessionDetails.longitude || 0,
		});

		return new SessionService(session);
	}

	public get userId() {
		return this._session.account;
	}

	public get authToken() {
		return this._session.getAuthToken();
	}

	public get refreshToken() {
		return this._session.getRefreshToken();
	}
}
