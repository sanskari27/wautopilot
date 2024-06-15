import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { ContactState } from '../types/ContactState';

const initialState: ContactState = {
	list: [],
	contact: {
		id: '',
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
	pagination: {
		page: 1,
		maxPage: 1,
	},
	selected: [],
	uiDetails: {
		fetchingContact: false,
		savingContact: false,
		errorMessage: '',
	},
};

const Slice = createSlice({
	name: StoreNames.CONTACT,
	initialState,
	reducers: {
		resetContactDetails: (state) => {
			state.contact = initialState.contact;
			state.selected = initialState.selected;
			state.pagination = initialState.pagination;
			state.uiDetails = initialState.uiDetails;
		},
		setContactList: (state, action: PayloadAction<typeof initialState.list>) => {
			state.list = action.payload;
		},
		setContact: (state, action: PayloadAction<typeof initialState.contact>) => {
			state.contact = action.payload;
		},

		setFirstName: (state, action: PayloadAction<string>) => {
			if (state.contact?.name) {
				state.contact.name.first_name = action.payload;
			}
		},
		setMiddleName: (state, action: PayloadAction<string>) => {
			if (state.contact?.name) {
				state.contact.name.middle_name = action.payload;
			}
		},
		setLastName: (state, action: PayloadAction<string>) => {
			if (state.contact?.name) {
				state.contact.name.last_name = action.payload;
			}
		},
		setJobTitle: (state, action: PayloadAction<string>) => {
			if (state.contact?.org) {
				state.contact.org.title = action.payload;
			}
		},
		setCurrentCompany: (state, action: PayloadAction<string>) => {
			if (state.contact?.org) {
				state.contact.org.company = action.payload;
			}
		},
		addEmptyEmail: (state) => {
			if (state.contact?.emails) {
				state.contact.emails.push({ email: '', type: '' });
			}
		},
		removeEmail: (state, action: PayloadAction<number>) => {
			if (state.contact?.emails) {
				state.contact.emails.splice(action.payload, 1);
			}
		},
		setEmail: (state, action: PayloadAction<{ index: number; email: string }>) => {
			if (state.contact?.emails) {
				state.contact.emails[action.payload.index].email = action.payload.email;
			}
		},
		setEmailType: (state, action: PayloadAction<{ index: number; type: string }>) => {
			if (state.contact?.emails) {
				state.contact.emails[action.payload.index].type = action.payload.type;
			}
		},
		addEmptyPhone: (state) => {
			if (state.contact?.phones) {
				state.contact.phones.push({ phone: '', type: '' });
			}
		},
		removePhone: (state, action: PayloadAction<number>) => {
			if (state.contact?.phones) {
				state.contact.phones.splice(action.payload, 1);
			}
		},
		setPhone: (state, action: PayloadAction<{ index: number; phone: string }>) => {
			if (state.contact?.phones) {
				state.contact.phones[action.payload.index].phone = action.payload.phone;
			}
		},
		setPhoneType: (state, action: PayloadAction<{ index: number; type: string }>) => {
			if (state.contact?.phones) {
				state.contact.phones[action.payload.index].type = action.payload.type;
			}
		},
		addEmptyAddress: (state) => {
			if (state.contact?.addresses) {
				state.contact.addresses.push({ city: '', country: '', state: '', street: '', zip: '' });
			}
		},
		removeAddress: (state, action: PayloadAction<number>) => {
			if (state.contact?.addresses) {
				state.contact.addresses.splice(action.payload, 1);
			}
		},
		setAddressCity: (state, action: PayloadAction<{ index: number; city: string }>) => {
			if (state.contact?.addresses) {
				state.contact.addresses[action.payload.index].city = action.payload.city;
			}
		},
		setAddressCountry: (state, action: PayloadAction<{ index: number; country: string }>) => {
			if (state.contact?.addresses) {
				state.contact.addresses[action.payload.index].country = action.payload.country;
			}
		},
		setAddressPostalCode: (state, action: PayloadAction<{ index: number; postalCode: string }>) => {
			if (state.contact?.addresses) {
				state.contact.addresses[action.payload.index].zip = action.payload.postalCode;
			}
		},
		setAddressState: (state, action: PayloadAction<{ index: number; state: string }>) => {
			if (state.contact?.addresses) {
				state.contact.addresses[action.payload.index].state = action.payload.state;
			}
		},
		setAddressStreet: (state, action: PayloadAction<{ index: number; street: string }>) => {
			if (state.contact?.addresses) {
				state.contact.addresses[action.payload.index].street = action.payload.street;
			}
		},
		setAddressCountryCode: (
			state,
			action: PayloadAction<{ index: number; countryCode: string }>
		) => {
			if (state.contact?.addresses) {
				state.contact.addresses[action.payload.index].country_code = action.payload.countryCode;
			}
		},
		addEmptyUrl: (state) => {
			if (state.contact?.urls) {
				state.contact.urls.push({ url: '', type: '' });
			}
		},
		removeUrl: (state, action: PayloadAction<number>) => {
			if (state.contact?.urls) {
				state.contact.urls.splice(action.payload, 1);
			}
		},
		setUrl: (state, action: PayloadAction<{ index: number; url: string }>) => {
			if (state.contact?.urls) {
				state.contact.urls[action.payload.index].url = action.payload.url;
			}
		},
		setUrlType: (state, action: PayloadAction<{ index: number; type: string }>) => {
			if (state.contact?.urls) {
				state.contact.urls[action.payload.index].type = action.payload.type;
			}
		},

		setSavingContact: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.savingContact = action.payload;
		},
		setErrorMessage: (state, action: PayloadAction<string>) => {
			state.uiDetails.errorMessage = action.payload;
		},

		setMaxPage: (state, action: PayloadAction<number>) => {
			state.pagination.maxPage = action.payload;
		},
		nextPage: (state) => {
			state.pagination.page = Math.min(state.pagination.page + 1, state.pagination.maxPage);
		},
		prevPage: (state) => {
			state.pagination.page = Math.max(state.pagination.page - 1, 1);
		},

		setFetchingContact: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.fetchingContact = action.payload;
		},
		addSelectedContact: (state, action: PayloadAction<string>) => {
			state.selected.push(action.payload);
		},
		removeSelectedContact: (state, action: PayloadAction<string>) => {
			state.selected = state.selected.filter((id) => id !== action.payload);
		},
	},
});

export const {
	setFirstName,
	setMiddleName,
	addSelectedContact,
	removeSelectedContact,
	resetContactDetails,
	setContactList,
	setContact,
	setSavingContact,
	setErrorMessage,
	nextPage,
	prevPage,
	setFetchingContact,
	setMaxPage,
	addEmptyAddress,
	addEmptyEmail,
	addEmptyPhone,
	addEmptyUrl,
	removeAddress,
	removeEmail,
	removePhone,
	removeUrl,
	setAddressCity,
	setAddressCountry,
	setAddressCountryCode,
	setAddressPostalCode,
	setAddressState,
	setAddressStreet,
	setEmail,
	setEmailType,
	setJobTitle,
	setPhone,
	setPhoneType,
	setUrl,
	setUrlType,
	setCurrentCompany,
	setLastName,
} = Slice.actions;

export default Slice.reducer;
