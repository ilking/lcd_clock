const moment = require('moment');
const LCD = require('raspberrypi-liquid-crystal');
const Hebcal = require('hebcal');
const encoding = require('encoding');

const [lattitude, longitude] = [41.849648, -71.395652];

const lcd = new LCD(1, 0x27, 20, 4);

function init() {
  lcd.beginSync();
  lcd.clearSync();

  Hebcal.defaultLocation = [41.849648, -71.395652];
}

function setFourthLine() {
  const currentDate = moment();
  const hebDate = new Hebcal.HDate(moment().toDate());
}

function writeDateLines() {
  const hebDate = new Hebcal.HDate(moment().toDate());

  lcd.printLineSync(0, `${moment().format('hh:mm:ss A')} `);
  lcd.printLineSync(1, moment().format('ddd MMM Do, YYYY'));
  lcd.printLineSync(2, hebDate.toString().padStart(20));
}

function main() {
  init();

  setInterval(() => {
    writeDateLines();
  }, 1000);
}

main();

process.on('SIGINT', () => {
  lcd.close();
  process.exit();
});
