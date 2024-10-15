import Message from './message';

export type MediaType = 'audio' | 'document' | 'image' | 'video';

export default class MediaMessage extends Message {
	private media_type: MediaType;
	private media_id?: string;
	private caption?: string;
	private filename?: string;

	constructor(recipient: string, media_type: MediaType) {
		super(recipient);
		this.media_type = media_type;
	}

	setMediaId(media_id: string) {
		if (!media_id) {
			return this;
		}
		this.media_id = media_id;
		return this;
	}

	setCaption(caption: string) {
		if (!caption) {
			return this;
		}
		this.caption = caption;
		return this;
	}

	toObject() {
		let obj = {
			id: this.media_id,
			caption: this.caption,
			filename: this.filename,
		};

		if (this.media_type === 'audio') {
			delete obj.filename;
			delete obj.caption;
		} else if (this.media_type === 'video' || this.media_type === 'image') {
			delete obj.filename;
		}

		return {
			recipient_type: 'individual',
			to: this.recipient,
			type: this.media_type,
			[this.media_type]: {
				id: this.media_id,
				...(this.caption && { caption: this.caption }),
				...(this.filename && { filename: this.filename }),
			},
			context: this.context,
		};
	}
}
