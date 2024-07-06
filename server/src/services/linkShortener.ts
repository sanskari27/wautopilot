import { Types } from 'mongoose';
import { ShortenLinkDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import IShortenLink from '../../mongo/types/shortenLink';
import { SHORT_LINK_REDIRECT } from '../config/const';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import { filterUndefinedKeys } from '../utils/ExpressUtils';
import UserService from './user';

function processDocs(docs: IShortenLink[]) {
	return docs.map((doc) => {
		const isWhatsappLink = doc.link.startsWith('https://wa.me/');
		return {
			id: doc._id.toString(),
			shorten_link: `${SHORT_LINK_REDIRECT}${doc.key}`,
			title: doc.title,
			link: doc.link,
			base64: doc.qrString,
			isWhatsappLink,
			...(isWhatsappLink && {
				number: doc.link.split('?')[0].split('/').pop(),
				message: decodeURIComponent(doc.link.split('?')[1].split('=')[1]),
			}),
		};
	});
}

export default class LinkShortenerService extends UserService {
	public constructor(account: IAccount) {
		super(account);
	}

	public static async findShortenLink(id: string) {
		return await ShortenLinkDB.findOne({
			key: id,
		});
	}

	public async shortenLink(title: string, link: string) {
		const doc = await ShortenLinkDB.create({
			linked_to: this.userId,
			link,
			title,
		});
		return processDocs([doc])[0];
	}

	public async shortenWhatsappLink(title: string, opts: { phoneNumber: string; message: string }) {
		const doc = await ShortenLinkDB.create({
			linked_to: this.userId,
			link: `https://wa.me/${opts.phoneNumber}?text=${opts.message}`,
			title,
		});
		return processDocs([doc])[0];
	}

	public async deleteShortenLink(id: Types.ObjectId) {
		await ShortenLinkDB.deleteOne({
			_id: id,
			linked_to: this.userId,
		});
	}

	public async updateWhatsappLink(
		id: Types.ObjectId,
		opts: { title?: string; phoneNumber: string; message: string }
	) {
		const link = `https://wa.me/${opts.phoneNumber}?text=${opts.message}`;

		await ShortenLinkDB.updateOne(
			{
				_id: id,
				linked_to: this.userId,
			},
			{
				$set: {
					...(opts.title && { title: opts.title }),
					link,
				},
			}
		);

		return await this.getShortenLink(id);
	}

	public async updateShortenLink(id: Types.ObjectId, opts: { title?: string; link?: string }) {
		await ShortenLinkDB.updateOne(
			{
				_id: id,
				linked_to: this.userId,
			},
			{
				$set: filterUndefinedKeys(opts),
			}
		);
		return await this.getShortenLink(id);
	}

	public async getShortenLinks() {
		const docs = await ShortenLinkDB.find({
			linked_to: this.userId,
		});
		return processDocs(docs);
	}

	public async getShortenLink(id: Types.ObjectId) {
		const doc = await ShortenLinkDB.findOne({
			_id: id,
			linked_to: this.userId,
		});
		if (!doc) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		return processDocs([doc])[0];
	}
}
