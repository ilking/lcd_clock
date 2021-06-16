import HebCalWrapper from './HebCalWrapper.mjs';
import LcdWrapper, { LINE } from './LcdWrapper.mjs';
import moment from 'moment';
import cron from 'node-cron';
import AudioManager from './AudioManager.mjs';
import FedHolidayWrapper from './FedHolidayWrapper.mjs';

const WAKE_UP_TIME = '5 7 * * 1-5';
const RESET_TIME = '0 8 * * *';

const FourthLineMode = {
  ALARM: 0,
  DAILY: 1,
};

export default class Runner {
  constructor() {
    this.hebCal = new HebCalWrapper();
    this.lcd = new LcdWrapper();
    this.audioManager = new AudioManager();
    this.fedHoliday = new FedHolidayWrapper();

    this.fourthLineMode = FourthLineMode.DAILY;
  }

  writeStaticLines() {
    this.lcd.writeLine(LINE.ONE, `${moment().format('hh:mm:ss A')} `);

    const secondLine = this.fedHoliday.getCurrentHoliday() || moment().format('ddd MMM Do, YYYY');
    const thirdLine = this.hebCal.getHolidayName() || this.hebCal.getHebDateString().padStart(20);

    this.lcd.writeLine(LINE.TWO, secondLine);
    this.lcd.writeLine(LINE.THREE, thirdLine);

    if (this.fourthLineMode === FourthLineMode.ALARM) {
      return;
    }

    this.lcd.writeLine(LINE.FOUR, this.hebCal.getTodaysCandle());
  }

  clearFourthLine() {
    this.lcd.writeLine(LINE.FOUR, ''.padStart(20));
  }

  releaseFourthLine() {
    this.clearFourthLine();

    this.fourthLineMode = FourthLineMode.DAILY;
  }

  runWakeUpLine() {
    if (this.fedHoliday.getCurrentHoliday() || this.hebCal.isYuntif()) {
      return;
    }

    this.fourthLineMode = FourthLineMode.ALARM;

    this.audioManager.queueAudio();

    this.clearFourthLine();

    const greeter = this.audioManager.getAudioName();
    this.lcd.writeLine(LINE.FOUR, `From ${greeter}`);

    // this.audioManager.playAudio();
  }

  run() {
    cron.schedule(WAKE_UP_TIME, () => this.runWakeUpLine());
    cron.schedule(RESET_TIME, () => this.releaseFourthLine());

    setInterval(() => {
      this.writeStaticLines();
    }, 1000);
  }
}
