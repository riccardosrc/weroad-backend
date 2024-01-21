const DAY_TO_MS_CONVERSION_RATE = 86400000;

export class Utils {
  /**
   * Add days to date
   * @param date target
   * @param days days to add
   * @returns date with added days
   */
  static addDaysToDate = (date: Date, days: number) => {
    const daysInMs = days * DAY_TO_MS_CONVERSION_RATE;
    return new Date(date.getTime() + daysInMs);
  };
}
