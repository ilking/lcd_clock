import moment from 'moment-holiday';

export default class FedHolidayWrapper {
  constructor() {
    this.holidays = moment().holidays(
      [
        'New Years',
        'Memorial Day',
        'Martin Luther King',
        'July 4th',
        'Labor Day',
        'Veterans Day',
        'Christmas Eve',
        'Christmas',
        'New Years Eve',
      ],
      true
    );
  }

  getCurrentHoliday() {
    const today = moment();
    const currentHoliday = Object.keys(this.holidays).find(holiday => this.holidays[holiday].isSame(today, 'day'));

    return currentHoliday;
  }
}
