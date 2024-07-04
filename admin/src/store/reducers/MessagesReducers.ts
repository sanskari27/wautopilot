import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { MessageState } from '../types/MessageState';

const initialState: MessageState = {
	messageList: [],
	messageLabels: [],
	uiDetails: {
		messagesLoading: false,
		errorMessage: '',
		attachmentUploading: false,
		isMessageSending: false,
	},
	message: {
		attachment_id: [],
		textMessage: '',
		attachment: {
			file: null,
			name: '',
			size: '',
			id: '',
			type: '',
			url: '',
		},
		contactCard: [],
	},
};

const Slice = createSlice({
	name: StoreNames.MESSAGES,
	initialState,
	reducers: {
		reset: (state) => {
			state.messageList = [];
		},
		resetMessage: (state) => {
			state.message = initialState.message;
			state.uiDetails = initialState.uiDetails;
		},
		setMessageList: (state, action: PayloadAction<typeof initialState.messageList>) => {
			state.messageList = action.payload;
		},
		addMessageList: (state, action: PayloadAction<typeof initialState.messageList>) => {
			state.messageList.push(...action.payload);
		},
		addMessage: (state, action: PayloadAction<(typeof initialState.messageList)[0]>) => {
			const includes = state.messageList.some((msg) => msg._id === action.payload._id);
			if (!includes) {
				state.messageList = [action.payload, ...state.messageList];
			}
		},
		updateMessage: (
			state,
			action: PayloadAction<{
				messageId: string;
				message: (typeof initialState.messageList)[0];
			}>
		) => {
			state.messageList = state.messageList.map((msg) =>
				msg._id === action.payload.messageId ? action.payload.message : msg
			);
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
		setAttachmentUrl: (state, action: PayloadAction<string>) => {
			state.message.attachment.url = action.payload;
		},
		setAttachmentType: (state, action: PayloadAction<string>) => {
			state.message.attachment.type = action.payload;
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
		setMessageSending: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isMessageSending = action.payload;
		},

		setMessageLabels: (state, action: PayloadAction<string[]>) => {
			state.messageLabels = action.payload;
		},

		setNewMessageLabels: (
			state,
			action: PayloadAction<{ messageId: string; labels: string[] }>
		) => {
			state.messageList = state.messageList.map((msg) =>
				msg._id === action.payload.messageId
					? {
							...msg,
							labels: action.payload.labels,
							// eslint-disable-next-line no-mixed-spaces-and-tabs
					  }
					: msg
			);
		},
	},
});

export const {
	setMessageList,
	addMessageList,
	setMessagesLoading,
	reset,
	setTextMessage,
	setAttachmentId,
	removeAttachmentId,
	setErrorMessage,
	setMessageSending,
	setAttachmentFile,
	setAttachmentName,
	setAttachmentSize,
	setMetaAttachmentId,
	removeFile,
	setAttachmentUploading,
	setAttachmentType,
	setAttachmentUrl,
	addMessage,
	updateMessage,
	resetMessage,
	setMessageLabels,
	setNewMessageLabels,
} = Slice.actions;

export default Slice.reducer;
