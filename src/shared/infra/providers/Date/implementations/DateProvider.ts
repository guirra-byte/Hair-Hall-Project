import { IDateProvider } from "../IDateProvider";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export class DateProvider implements IDateProvider {

  async compareInHour(end_date_return: Date): Promise<number> {

    const endDate: string = await this
      .replaceToUTC(end_date_return);

    const dateNow: string = await this
      .dateNow();

    const compareDates = dayjs(endDate).diff(dateNow);
    return compareDates;
  }

  async replaceToUTC(date: Date): Promise<string> {

    const replaceDate: string = dayjs(date)
      .utc()
      .local()
      .format();

    return replaceDate;
  }

  async dateNow(): Promise<string> {

    const dateNow: string = dayjs()
      .utc()
      .local()
      .format();

    return dateNow;
  }

  async addDays(days: number): Promise<Date> {

    const addDays = dayjs()
      .add(days, "days")
      .toDate();

    return addDays;
  }

  async addHour(hours: number): Promise<Date> {

    const addHours = dayjs()
      .add(hours, "hours")
      .toDate();

    return addHours;
  }
  async addMinutes(minutes: number): Promise<Date> {

    const addMinutes = dayjs()
      .add(minutes, "minutes")
      .toDate();

    return addMinutes;
  }

  async compareIfBefore(
    start_date: string,
    end_date: string
  ): Promise<boolean> {

    const ensureIfBefore = dayjs(start_date)
      .isBefore(end_date);
    return ensureIfBefore;
  }

  async compareInDays(
    start_date: Date,
    end_date: Date
  ): Promise<number> {

    const startDateUTC = await this.replaceToUTC(start_date);
    const endDateUTC = await this.replaceToUTC(end_date);

    const compareDates = dayjs(startDateUTC)
      .diff(endDateUTC, 'days');

    return compareDates;
  }

  async compareInMinutes(start_date: string, end_date: string): Promise<number> {
    const compareDates = dayjs(start_date)
      .diff(end_date, 'minutes');

    return compareDates;
  }

}