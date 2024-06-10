import { Document, Types } from 'mongoose';
import { MESSAGE_STATUS } from '../../src/config/const';

export default interface IConversationMessage extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;
	device_id: Types.ObjectId;
	conversation_id: Types.ObjectId;

	recipient: string;

	status: MESSAGE_STATUS;

	message_id: string;
	delivered_at: Date;
	read_at: Date;
	sent_at: Date;
	failed_at: Date;
	failed_reason: string;

	header_type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
	header_content_source: 'LINK' | 'MEDIA_ID' | 'TEXT';
	header_content: string;
	body: {
		body_type: 'TEXT' | 'MEDIA' | 'CONTACT' | 'LOCATION' | 'UNKNOWN';
		text: string;
		media_id: string;
		caption: string;
		contacts: {
			addresses: {
				type: string;
				street: string;
				city: string;
				state: string;
				zip: string;
				country: string;
				country_code: string;
			}[];
			birthday: string;
			emails: {
				email: string;
				type: string;
			}[];
			name: {
				formatted_name: string;
				first_name: string;
				last_name: string;
				middle_name: string;
				suffix: string;
				prefix: string;
			};
			org: {
				company: string;
				department: string;
				title: string;
			};
			phones: {
				phone: string;
				wa_id: string;
				type: string;
			}[];
			urls: {
				url: string;
				type: string;
			}[];
		}[];
		location: {
			latitude: number;
			longitude: number;
			name: string;
			address: string;
		};
	};
	footer_content: string;
	buttons: {
		button_type: 'URL' | 'PHONE_NUMBER' | 'QUICK_REPLY' | 'VOICE_CALL';
		button_content: string;
		button_data: string;
	};

	createdAt: Date;
	sendAt: Date;
}
