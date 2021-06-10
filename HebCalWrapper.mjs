import Hebcal from 'hebcal';
import _ from 'lodash';
import moment from 'moment';

const HEBCAL_COORDS = [41.849648, -71.395652];

Hebcal.HDate.defaultLocation = HEBCAL_COORDS;
Hebcal.holidays.Event.havdalah = 52;

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
    const holiday = this.getHoliday();

    if (!holiday) {
      return null;
    }

    const rawDesc = holiday.getDesc();
    const monthName = this.getHebDate().getMonthName();

    if (/rosh chodesh [1-2]/i.test(rawDesc)) {
      return `R"C ${monthName} ${rawDesc.includes('1') ? '1' : '2'}`;
    }

    return rawDesc;
  }

  isYuntif() {
    const holiday = this.getHoliday();

    if (!holiday) {
      return false;
    }

    return holiday.LIGHT_CANDLES_TZEIS || holiday.YOM_TOV_ENDS;
  }

  getTodaysCandle() {
    const hebrewDate = this.getHebDate();
    const candleDate = hebrewDate.candleLighting() || hebrewDate.havdalah();

    if (!candleDate) {
      return null;
    }

    const formatted = moment(candleDate).format('h:mm a');

    if (hebrewDate.candleLighting()) {
      return `Light: ${formatted}`;
    }

    return `Havdal: ${formatted}`;
  }
}
