const START = 'BEGIN:VCARD\nVERSION:3.0\n';
const END = 'END:VCARD';

type VCardDetails = {
	first_name: string;
	middle_name: string;
	last_name: string;

	title: string;
	company: string;
	department: string;

	phones: {
		text: string;
		type: 'HOME' | 'WORK' | 'OTHER';
	}[];
	emails: {
		text: string;
		type: 'HOME' | 'WORK' | 'OTHER';
	}[];
	urls: {
		text: string;
		type: 'HOME' | 'WORK' | 'OTHER';
	}[];

	street: string;
	city: string;
	state: string;
	country: string;
	zip: string;
};

export default class VCardBuilder {
	private first_name: string;
	private last_name: string;
	private middle_name: string;

	private title: string;
	private company: string;
	private department: string;

	private phones: {
		text: string;
		type: 'HOME' | 'WORK' | 'OTHER';
	}[];
	private emails: {
		text: string;
		type: 'HOME' | 'WORK' | 'OTHER';
	}[];
	private urls: {
		text: string;
		type: 'HOME' | 'WORK' | 'OTHER';
	}[];

	private street: string;
	private city: string;
	private state: string;
	private country: string;
	private zip: string;

	constructor(details: Partial<VCardDetails>) {
		this.first_name = details.first_name ?? '';
		this.middle_name = details.middle_name ?? '';
		this.last_name = details.last_name ?? '';

		this.title = details.title ?? '';
		this.department = details.department ?? '';
		this.company = details.company ?? '';

		this.phones = details.phones ?? [];
		this.emails = details.emails ?? [];
		this.urls = details.urls ?? [];

		this.street = details.street ?? '';
		this.city = details.city ?? '';
		this.state = details.state ?? '';
		this.country = details.country ?? '';
		this.zip = details.zip ?? '';
	}

	public build(): string {
		let vCardString = START;

		// Add Name to the card

		let full_name = '';
		if (this.first_name) {
			full_name = this.first_name.trim() + ' ';
		}

		if (this.middle_name) {
			full_name += this.middle_name.trim() + '';
		}
		if (this.last_name) {
			full_name += this.last_name.trim() + '';
		}

		vCardString += `FN:${full_name.trim()}\n`;
		vCardString += `N:${this.last_name};${this.first_name};${this.middle_name};;\n`;

		if (this.phones.length > 0) {
			for (const phone of this.phones) {
				vCardString += `TEL;TYPE=${phone.type};waid=${phone.text},VOICE:${phone.text}\n`;
			}
		}

		if (this.emails.length > 0) {
			for (const email of this.emails) {
				vCardString += `EMAIL;TYPE=${email.type}:${email.text}\n`;
			}
		}

		if (this.urls.length > 0) {
			for (const url of this.urls) {
				vCardString += `URL;TYPE=${url.type}:${url.text}\n`;
			}
		}

		if (this.street || this.city || this.state || this.zip || this.country) {
			vCardString += `ADR;type=WORK:;;`;
			vCardString += `${this.street};`;
			vCardString += `${this.city};`;
			vCardString += `${this.state};`;
			vCardString += `${this.zip};`;
			vCardString += `${this.country};`;
			vCardString += `\n`;
		}

		//Add Title and organization to vcard
		if (this.company) vCardString += `ORG:${this.company}\n`;
		if (this.department) vCardString += `ORGUNIT:${this.department}\n`;
		if (this.title) vCardString += `TITLE:${this.title}\n`;
		return vCardString + END;
	}

	public setFirstName(name: string) {
		this.first_name = name;
		return this;
	}

	public setLastName(name: string) {
		this.last_name = name;
		return this;
	}

	public setMiddleName(name: string) {
		this.middle_name = name;
		return this;
	}

	public setTitle(title: string) {
		this.title = title;
		return this;
	}

	public setCompany(company: string) {
		this.company = company;
		return this;
	}

	public setDepartment(department: string) {
		this.department = department;
		return this;
	}

	public addPhone(phone: string, type: 'HOME' | 'WORK' | 'OTHER') {
		this.phones.push({ text: phone, type });
		return this;
	}

	public addEmail(email: string, type: 'HOME' | 'WORK' | 'OTHER') {
		this.emails.push({ text: email, type });
		return this;
	}

	public addUrl(url: string, type: 'HOME' | 'WORK' | 'OTHER') {
		this.urls.push({ text: url, type });
		return this;
	}

	public setStreet(street: string) {
		this.street = street;
		return this;
	}

	public setCity(city: string) {
		this.city = city;
		return this;
	}
	public setState(state: string) {
		this.state = state;
		return this;
	}

	public setCountry(country: string) {
		this.country = country;
		return this;
	}

	public setZip(zip: string) {
		this.zip = zip;
		return this;
	}
}
