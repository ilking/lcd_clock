import Hebcal from 'hebcal';
import _ from 'lodash';
import moment from 'moment';

const HEBCAL_COORDS = [41.849648, -71.395652];

Hebcal.HDate.defaultLocation = HEBCAL_COORDS;
Hebcal.holidays.Event.havdalah = 52;

// const test_date = '2021-06-18T11:30:00';

export default class HebCalWrapper {
  constructor() {}

  getHebDate() {
    const hebDate = new Hebcal.HDate(moment().toDate());

    if (moment().isSameOrAfter(hebDate.sunset(), 'second')) {
      return hebDate.next();
    }

    return hebDate;
  }

  getHebDateString() {
    return this.getHebDate().toString();
  }

  getHoliday() {
    const holidays = this.getHebDate().holidays();

    if (_.isEmpty(holidays)) {
      return null;
    }

    return holidays[0];
  }

  getHolidayName() {
    return this.getHoliday()?.getDesc() || null;
  }

  isYuntif() {
    // TODO: This needs to be better. Friday will never run.
    const holiday = this.getHoliday();

    if (!holiday) {
      return false;
    }

    return holiday.LIGHT_CANDLES_TZEIS || holiday.YOM_TOV_ENDS;
  }

  getTodaysCandle() {
    const hebrewDate = this.getHebDate();
    const candleDate = hebrewDate.candleLighting() || hebrewDate.havdalah();
    const shkiah = this.getHebDate().sunset();

    if (!candleDate) {
      return `Shkiah: ${moment(shkiah).format('h:mm a')}`;
    }

    const formatted = moment(candleDate).format('h:mm a');

    if (hebrewDate.candleLighting()) {
      return `Light: ${formatted}`;
    }

    return `Havdal: ${formatted}`;
  }
}
