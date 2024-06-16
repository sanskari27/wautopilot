import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { ContactState } from '../types/ContactState';

const initialState: ContactState = {
	list: [],
	contact: {
		id: '',
		formatted_name: '',
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
		reset: (state) => {
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
		resetContactDetails: (state) => {
			state.contact = initialState.contact;
		},
		setPrefix: (state, action: PayloadAction<string>) => {
			state.contact.name.prefix = action.payload;
		},
		setFirstName: (state, action: PayloadAction<string>) => {
			state.contact.name.first_name = action.payload;
		},
		setMiddleName: (state, action: PayloadAction<string>) => {
			state.contact.name.middle_name = action.payload;
		},
		setLastName: (state, action: PayloadAction<string>) => {
			state.contact.name.last_name = action.payload;
		},
		setFormattedName: (state, action: PayloadAction<string>) => {
			state.contact.name.formatted_name = action.payload;
		},
		setSuffix: (state, action: PayloadAction<string>) => {
			state.contact.name.suffix = action.payload;
		},
		setDepartment: (state, action: PayloadAction<string>) => {
			state.contact.org.department = action.payload;
		},
		setJobTitle: (state, action: PayloadAction<string>) => {
			state.contact.org.title = action.payload;
		},
		setCurrentCompany: (state, action: PayloadAction<string>) => {
			state.contact.org.company = action.payload;
		},
		addEmptyEmail: (state) => {
			state.contact.emails.push({ email: '', type: 'HOME' });
		},
		removeEmail: (state, action: PayloadAction<number>) => {
			state.contact.emails.splice(action.payload, 1);
		},
		setEmail: (state, action: PayloadAction<{ index: number; email: string }>) => {
			state.contact.emails[action.payload.index].email = action.payload.email;
		},
		setEmailType: (state, action: PayloadAction<{ index: number; type: string }>) => {
			state.contact.emails[action.payload.index].type = action.payload.type;
		},
		addEmptyPhone: (state) => {
			state.contact.phones.push({ phone: '', type: 'HOME', wa_id: '' });
		},
		removePhone: (state, action: PayloadAction<number>) => {
			state.contact.phones.splice(action.payload, 1);
		},
		setPhone: (state, action: PayloadAction<{ index: number; phone: string }>) => {
			//also allow + in phone
			state.contact.phones[action.payload.index].phone = action.payload.phone.replace(
				/[^0-9+]/g,
				''
			);
			state.contact.phones[action.payload.index].wa_id = action.payload.phone.replace(
				/[^0-9]/g,
				''
			);
		},
		setPhoneType: (state, action: PayloadAction<{ index: number; type: string }>) => {
			state.contact.phones[action.payload.index].type = action.payload.type;
		},
		addEmptyAddress: (state) => {
			state.contact.addresses.push({
				city: '',
				country: '',
				state: '',
				street: '',
				zip: '',
				country_code: '',
				type: 'HOME',
			});
		},
		removeAddress: (state, action: PayloadAction<number>) => {
			state.contact.addresses.splice(action.payload, 1);
		},
		setAddressType: (state, action: PayloadAction<{ index: number; type: string }>) => {
			state.contact.addresses[action.payload.index].type = action.payload.type;
		},
		setAddressCity: (state, action: PayloadAction<{ index: number; city: string }>) => {
			state.contact.addresses[action.payload.index].city = action.payload.city;
		},
		setAddressCountry: (state, action: PayloadAction<{ index: number; country: string }>) => {
			state.contact.addresses[action.payload.index].country = action.payload.country;
		},
		setAddressPostalCode: (state, action: PayloadAction<{ index: number; postalCode: string }>) => {
			state.contact.addresses[action.payload.index].zip = action.payload.postalCode;
		},
		setAddressState: (state, action: PayloadAction<{ index: number; state: string }>) => {
			state.contact.addresses[action.payload.index].state = action.payload.state;
		},
		setAddressStreet: (state, action: PayloadAction<{ index: number; street: string }>) => {
			state.contact.addresses[action.payload.index].street = action.payload.street;
		},
		setAddressCountryCode: (
			state,
			action: PayloadAction<{ index: number; countryCode: string }>
		) => {
			state.contact.addresses[action.payload.index].country_code = action.payload.countryCode;
		},
		addEmptyUrl: (state) => {
			state.contact.urls.push({ url: '', type: 'HOME' });
		},
		removeUrl: (state, action: PayloadAction<number>) => {
			state.contact.urls.splice(action.payload, 1);
		},
		setUrl: (state, action: PayloadAction<{ index: number; url: string }>) => {
			state.contact.urls[action.payload.index].url = action.payload.url;
		},
		setUrlType: (state, action: PayloadAction<{ index: number; type: string }>) => {
			state.contact.urls[action.payload.index].type = action.payload.type;
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
	setAddressType,
	setDepartment,
	setFormattedName,
	setSuffix,
	setPrefix,
	setFirstName,
	setMiddleName,
	addSelectedContact,
	removeSelectedContact,
	reset,
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
	resetContactDetails,
} = Slice.actions;

export default Slice.reducer;
