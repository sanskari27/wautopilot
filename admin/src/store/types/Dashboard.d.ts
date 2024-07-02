export type DashboardState = {
	conversations: {
		month: number;
		year: number;
		count: number;
	}[];
	health: string;
	mediaSize: number;
	messages: {
		month: number;
		year: number;
		count: number;
	}[];
	pendingToday: number;
	phoneRecords: number;
};
