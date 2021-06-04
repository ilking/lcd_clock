import LCD from 'raspberrypi-liquid-crystal';

export const LINE = {
  ONE: 0,
  TWO: 1,
  THREE: 2,
  FOUR: 3,
};

export default class LcdWrapper {
  constructor() {
    this.lcd = new LCD(1, 0x27, 20, 4);

    this.lcd.beginSync();
    this.lcd.clearSync();
  }

  writeLine(line, message) {
    this.lcd.printLineSync(line, message);
  }
}
