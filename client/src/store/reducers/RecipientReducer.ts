import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { Recipient, RecipientsState } from '../types/RecipientsState';

const initialState: RecipientsState = {
	list: [],
	uiDetails: {
		loading: false,
	},
	label_filter: [],
	selected_recipient: {
		_id: '',
		recipient: '',
		profile_name: '',
		origin: '',
		expiration_timestamp: '',
		labels: [],
	},
};

const Slice = createSlice({
	name: StoreNames.RECIPIENT,
	initialState,
	reducers: {
		setRecipientsList: (state, action: PayloadAction<typeof initialState.list>) => {
			const pinned = JSON.parse(localStorage.getItem('pinned') || '[]');
			const pinnedIds = pinned.map((item: Recipient) => item._id);
			const pinnedConversations = action.payload.filter((item) => pinnedIds.includes(item._id));
			const unpinnedConversations = action.payload.filter((item) => !pinnedIds.includes(item._id));
			state.list = [...pinnedConversations, ...unpinnedConversations];
		},
		setRecipientsLoading: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.loading = action.payload;
		},
		setSelectedRecipient: (
			state,
			action: PayloadAction<typeof initialState.selected_recipient>
		) => {
			state.selected_recipient = action.payload;
		},
		setRecipientLabels: (state, action: PayloadAction<{ labels: string[]; id: string }>) => {
			const { labels, id } = action.payload;
			console.log(labels, id);
			state.list = state.list.map((item) => {
				if (item._id === id) {
					return { ...item, labels };
				}
				return item;
			});
		},
	},
});

export const { setRecipientsList, setRecipientsLoading, setSelectedRecipient, setRecipientLabels } =
	Slice.actions;

export default Slice.reducer;
