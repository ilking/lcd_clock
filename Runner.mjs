import HebCalWrapper from './HebCalWrapper.mjs';
import LcdWrapper, { LINE } from './LcdWrapper.mjs';
import moment from 'moment';
import cron from 'node-cron';
import AudioManager from './AudioManager.mjs';
import FedHolidayWrapper from './FedHolidayWrapper.mjs';

const WAKE_UP_TIME = '20 7 * * 1-5';
const RESET_TIME = '0 8 * * *';

export default class Runner {
  constructor() {
    this.hebCal = new HebCalWrapper();
    this.lcd = new LcdWrapper();
    this.audioManager = new AudioManager();
    this.fedHoliday = new FedHolidayWrapper();
  }

  writeStaticLines() {
    const secondLine = this.fedHoliday.getCurrentHoliday() || moment().format('ddd MMM Do, YYYY');
    const thirdLine = this.hebCal.getHolidayName() || this.hebCal.getHebDateString().padStart(20);

    this.lcd.writeLine(LINE.ONE, `${moment().format('hh:mm:ss A')} `);
    this.lcd.writeLine(LINE.TWO, secondLine);
    this.lcd.writeLine(LINE.THREE, thirdLine);
  }

  handleFourthLine() {
    this.lcd.writeLine(LINE.FOUR, ''.padStart(20));

    const jewishCandle = this.hebCal.getTodaysCandle();
    if (jewishCandle) {
      this.lcd.writeLine(LINE.FOUR, jewishCandle);

      return;
    }
  }

  runWakeUpLine() {
    if (this.fedHoliday.getCurrentHoliday() || this.hebCal.isYuntif()) {
      return;
    }

    this.audioManager.queueAudio();

    const greeter = this.audioManager.getAudioName();
    this.lcd.writeLine(LINE.FOUR, `From ${greeter}`);

    // this.audioManager.playAudio();
  }

  run() {
    cron.schedule(WAKE_UP_TIME, () => this.runWakeUpLine());
    cron.schedule(RESET_TIME, () => this.handleFourthLine());

    setInterval(() => {
      this.writeStaticLines();
    }, 500);
  }
}
