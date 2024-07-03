export type DashboardState = {
	details: {
		conversations: {
			month: number;
			year: number;
			count: number;
		}[];
		health: string;
		mediaSize: number;
		messages: {
			day: number;
			month: number;
			count: number;
		}[];
		pendingToday: number;
		phoneRecords: number;
	};
	ui: {
		isLoading: boolean;
	};
};
