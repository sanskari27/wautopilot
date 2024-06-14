import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { MessageState } from '../types/MessageState.s';

const initialState: MessageState = {
	messageList: [],
	uiDetails: {
		messagesLoading: false,
		errorMessage: '',
		attachmentUploading: false,
	},
	message: {
		attachment_id: [],
		textMessage: '',
		attachment: {
			file: null,
			name: '',
			size: '',
			id: '',

		},
		contactCard: {
			addresses: [],
			birthday: '',
			emails: [],
			name: {
				formatted_name: '',
				first_name: '',
				last_name: '',
				middle_name: '',
				suffix: '',
				prefix: '',
			},
			org: {
				company: '',
				department: '',
				title: '',
			},
			phones: [],
			urls: [],
		},
	},
};

const Slice = createSlice({
	name: StoreNames.MESSAGES,
	initialState,
	reducers: {
		reset: (state) => {
			state.messageList = [];
		},
		setMessageList: (state, action: PayloadAction<typeof initialState.messageList>) => {
			state.messageList = action.payload;
		},
		setMessagesLoading: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.messagesLoading = action.payload;
		},
		setTextMessage: (state, action: PayloadAction<string>) => {
			state.message.textMessage = action.payload;
		},
		setAttachmentId: (state, action: PayloadAction<string[]>) => {
			state.message.attachment_id = action.payload;
		},
		removeAttachmentId: (state, action: PayloadAction<string>) => {
			state.message.attachment_id = state.message.attachment_id.filter(
				(id) => id !== action.payload
			);
		},
		setErrorMessage: (state, action: PayloadAction<string>) => {
			state.uiDetails.errorMessage = action.payload;
		},
		setAttachmentFile: (state, action: PayloadAction<File>) => {
			state.message.attachment.file = action.payload;
		},
		setAttachmentName: (state, action: PayloadAction<string>) => {
			state.message.attachment.name = action.payload;
		},
		setAttachmentSize: (state, action: PayloadAction<string>) => {
			state.message.attachment.size = action.payload;
		},
		setMetaAttachmentId: (state, action: PayloadAction<string>) => {
			state.message.attachment.id = action.payload;
		},
		removeFile: (state) => {
			state.message.attachment.file = null;
			state.message.attachment.name = '';
			state.message.attachment.size = '';
			state.message.attachment.id = '';
		},
		setAttachmentUploading: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.attachmentUploading = action.payload;
		},
	},
});

export const {
	setMessageList,
	setMessagesLoading,
	reset,
	setTextMessage,
	setAttachmentId,
	removeAttachmentId,
	setErrorMessage,
	setAttachmentFile,
	setAttachmentName,
	setAttachmentSize,
	setMetaAttachmentId,
	removeFile,
	setAttachmentUploading,
} = Slice.actions;

export default Slice.reducer;
