import HebCalWrapper from './HebCalWrapper.mjs';
import LcdWrapper, { LINE } from './LcdWrapper.mjs';
import moment from 'moment';
import cron from 'node-cron';
import AudioManager from './AudioManager.mjs';
import FedHolidayWrapper from './FedHolidayWrapper.mjs';

const WAKE_UP_TIME = '10 7 * * 1-5';
const RESET_TIME = '15 7 * * *';
const SCREEN_OFF_TIME = '20 7 * * *';

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

    this.lcd.writeLine(LINE.FOUR, this.hebCal.getTodaysCandle().padEnd(20, ''));
  }

  clearFourthLine() {
    this.lcd.writeLine(LINE.FOUR, ''.padStart(20));
  }

  releaseFourthLine() {
    this.clearFourthLine();

    this.fourthLineMode = FourthLineMode.DAILY;
  }

  screenOff() {
    this.lcd.displayOff();
  }

  runWakeUpLine() {
    if (this.fedHoliday.getCurrentHoliday() || this.hebCal.isYuntif()) {
      console.log("Skipping alarm because holiday or yuntuf");
      return;
    }

    this.lcd.displayOn();

    this.fourthLineMode = FourthLineMode.ALARM;

    this.audioManager.queueAudio();

    this.clearFourthLine();

    const greeter = this.audioManager.getAudioName();
    this.lcd.writeLine(LINE.FOUR, `From ${greeter}`);

    this.audioManager.playAudio();
  }

  run() {
    this.screenOff();
    cron.schedule(WAKE_UP_TIME, () => this.runWakeUpLine());
    cron.schedule(RESET_TIME, () => this.releaseFourthLine());
    cron.schedule(SCREEN_OFF_TIME, () => this.screenOff());
    
    setInterval(() => {
      this.writeStaticLines();
    }, 1000);
  }

  run_test() {
    // this.screenOff();
    // cron.schedule(WAKE_UP_TIME, () => this.runWakeUpLine());
    // cron.schedule(RESET_TIME, () => this.releaseFourthLine());
    // cron.schedule(SCREEN_OFF_TIME, () => this.screenOff());
    this.lcd.displayOn();
    // this.runWakeUpLine();

    this.writeStaticLines();
    setInterval(() => {
      this.writeStaticLines();
    }, 3000);
  }
}
