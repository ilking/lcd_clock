const moment = require('moment');
const LCD = require('raspberrypi-liquid-crystal');
const Hebcal = require('hebcal');

const AUDIO_FILE_BASE = '/hom/pi/clock_scripts/audios';

const [lattitude, longitude] = [41.849648, -71.395652];

const lcd = new LCD(1, 0x27, 20, 4);

const audio_files = [
  { name: 'Meri King', path: `${AUDIO_FILE_BASE}/Meri_King.mp4` },
  { name: 'Ed King', path: `${AUDIO_FILE_BASE}/Ed_King.mp4` },
];

function init() {
  lcd.beginSync();
  lcd.clearSync();

  Hebcal.HDate.defaultLocation = [41.849648, -71.395652];
}

function writeDateLines() {
  const hebDate = new Hebcal.HDate();

  lcd.printLineSync(0, `${moment().format('hh:mm:ss A')} `);
  lcd.printLineSync(1, moment().format('ddd MMM Do, YYYY'));
  lcd.printLineSync(2, hebDate.toString().padStart(20));
}

function handleFourthLine() {}

function main() {
  init();

  setInterval(() => {
    writeDateLines();
    handleFourthLine();
  }, 1000);
}

main();

process.on('SIGINT', () => {
  lcd.close();
  process.exit();
});
