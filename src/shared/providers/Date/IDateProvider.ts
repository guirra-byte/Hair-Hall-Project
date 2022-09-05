
export interface IDateProvider {

  compareInHour(end_date_return: Date): Promise<number>
  compareInDays(start_date: Date, end_date: Date): Promise<number>
  compareInMinutes(start_date: string, end_date: string): Promise<number>
  dateNow(): Promise<string>
  replaceToUTC(date: Date): Promise<string>
  addDays(days: number): Promise<Date>
  addHour(hours: number): Promise<Date>
  addMinutes(minutes: number): Promise<Date>
  compareIfBefore(start_date: string, end_date: string): Promise<boolean>
}