import Hebcal from 'hebcal';

const HEBCAL_COORDS = [41.849648, -71.395652];
const { HDate } = Hebcal;

Hebcal.HDate.defaultLocation = HEBCAL_COORDS;

export default class HebCalWrapper {
  constructor() {
    this.hebDate = new HDate();
  }

  getHebDate() {
    return this.hebDate.toString();
  }
}
