/**
 * @namespace ui5.cv.display.model
 */
export default class DateFormatter {
  public static formatInterval(startDate: Date, endDate: Date): string {
    const dateIntervalVals = [
      startDate.toLocaleString(undefined, { year: 'numeric', month: '2-digit' }),
      endDate.toLocaleString(undefined, { year: 'numeric', month: '2-digit' }),
    ];

    return dateIntervalVals.join(' - ');
  }

  public static formatDate(date: Date): string {
    return date.toLocaleString(undefined, { year: 'numeric', month: '2-digit' });
  }
}
