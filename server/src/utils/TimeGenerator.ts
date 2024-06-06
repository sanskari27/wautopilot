import DateUtils from '../utils/DateUtils';

export default class TimeGenerator implements IterableIterator<Date> {
	private currentDate: moment.Moment;
	private startTime: moment.Moment;
	private endTime: moment.Moment;
	private calculated_delay: number;
	private daily_count: number;
	private count: number;

	constructor(
		details: Partial<{
			startDate: string;
			startTime: string;
			endTime: string;
			daily_count: number;
		}> = {}
	) {
		const startDate = DateUtils.getMoment(details.startDate ?? DateUtils.getDate(), 'YYYY-MM-DD');
		this.startTime = DateUtils.getMoment(details.startTime ?? '10:00', 'HH:mm');
		this.endTime = DateUtils.getMoment(details.endTime ?? '18:00', 'HH:mm');
		this.count = 0;
		this.daily_count = details.daily_count ?? 100;
		this.calculated_delay = this.endTime.diff(this.startTime, 'seconds') / this.daily_count;

		const calculated_date = startDate
			.hours(this.startTime.hours())
			.minutes(this.startTime.minutes())
			.seconds(this.startTime.seconds());

		const timeNow = DateUtils.getMomentNow();
		if (timeNow.isBefore(calculated_date)) {
			this.currentDate = calculated_date;
		} else {
			this.currentDate = timeNow;
		}
	}

	public setStartTime(startTime: string) {
		this.startTime = DateUtils.getMoment(startTime, 'HH:mm');
		return this;
	}

	public setEndTime(endTime: string) {
		this.endTime = DateUtils.getMoment(endTime, 'HH:mm');
		return this;
	}

	public next(custom_delay?: number): IteratorResult<Date, Date> {
		this.count++;

		if (custom_delay !== undefined) {
			this.currentDate.add(custom_delay, 'seconds');
			return { value: this.currentDate.toDate(), done: false };
		}

		if (this.count % this.daily_count === 0) {
			this.currentDate
				.add(1, 'day')
				.hours(this.startTime.hours())
				.minutes(this.startTime.minutes());
		} else {
			this.currentDate.add(this.calculated_delay, 'seconds');
		}

		if (!DateUtils.isTimeBetween(this.startTime, this.endTime, this.currentDate)) {
			this.currentDate
				.add(1, 'day')
				.hours(this.startTime.hours())
				.minutes(this.startTime.minutes())
				.seconds(this.startTime.seconds() + 1);
		}
		return { value: this.currentDate.toDate(), done: false };
	}

	[Symbol.iterator](): IterableIterator<Date> {
		return this;
	}
}
