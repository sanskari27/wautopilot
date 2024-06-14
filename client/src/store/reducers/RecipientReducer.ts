import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { RecipientsState } from '../types/RecipientsState';

const initialState: RecipientsState = {
	list: [],
	uiDetails: {
		loading: false,
	},
	selected_recipient_id: '',
	selected_recipient: {
		_id: '',
		recipient: '',
		profile_name: '',
		origin: '',
        expiration_timestamp: '',
	},
};

const Slice = createSlice({
	name: StoreNames.RECIPIENT,
	initialState,
	reducers: {
		setRecipientsList: (state, action: PayloadAction<typeof initialState.list>) => {
			state.list = action.payload;
		},
		setRecipientsLoading: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.loading = action.payload;
		},
		setSelectedRecipientId: (state, action: PayloadAction<string>) => {
			state.selected_recipient_id = action.payload;
		},
		setSelectedRecipient: (
			state,
			action: PayloadAction<typeof initialState.selected_recipient>
		) => {
			state.selected_recipient = action.payload;
		},
	},
});

export const {
	setRecipientsList,
	setRecipientsLoading,
	setSelectedRecipientId,
	setSelectedRecipient,
} = Slice.actions;

export default Slice.reducer;
