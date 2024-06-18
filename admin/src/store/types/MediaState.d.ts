export type MediaState = {
	list: Media[];
	uiDetails: {
		isSaving: boolean;
		isFetching: boolean;
		error: string;
	};
	details: Media;
	file: File | null;
	size: string;
	url: string;
	type: string;
};

export type Media = {
	id: string;
	filename: string;
	file_length: number;
	mime_type: string;
	media_id: string;
	media_url: string;
};
