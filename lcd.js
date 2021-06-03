const moment = require('moment');
const LCD = require('raspberrypi-liquid-crystal');
const Hebcal = require('hebcal');
const player = require('play-sound')((opts = {}));
const cron = require('node-cron');
const fedHolidays = require('@18f/us-federal-holidays');

const AUDIO_FILE_BASE = '/home/pi/clock_scripts/audios';
const WAKE_UP_TIME = '51 22 * * 1-5';
const HEBCAL_COORDS = [41.849648, -71.395652];

const fed_holiday_options = {
  shiftSaturdayHolidays: true,
  shiftSundayHolidays: true,
  utc: false,
};

const lcd = new LCD(1, 0x27, 20, 4);

const audio_files = [
  { name: 'Meri King', path: `${AUDIO_FILE_BASE}/Meri_King.mp4` },
  { name: 'Ed King', path: `${AUDIO_FILE_BASE}/Ed_King.mp4` },
];

function init() {
  lcd.beginSync();
  lcd.clearSync();

  Hebcal.HDate.defaultLocation = HEBCAL_COORDS;
}

function writeDateLines() {
  const hebDate = new Hebcal.HDate();

  lcd.printLineSync(0, `${moment().format('hh:mm:ss A')} `);
  lcd.printLineSync(1, moment().format('ddd MMM Do, YYYY'));
  lcd.printLineSync(2, hebDate.toString().padStart(20));
}

function handleFourthLine() {
  // Dont play on secular or jewish holidays.
  if (fedHolidays.isAHoliday(new Date(), fed_holiday_options)) {
    return;
  }

  const hebDate = new Hebcal.HDate();
  const hebHolidays = hebDate.holidays();

  const { name, path } = audio_files[Math.floor(Math.random() * audio_files.length)];

  lcd.printLineSync(3, `From ${name} ${hebHolidays.length}`);

  player.play(path, err => {
    if (err) {
      lcd.printLineSync(3, `Error`);
      logger.error(err);
    }
  });
}

function main() {
  init();

  cron.schedule(WAKE_UP_TIME, () => {
    handleFourthLine();
  });

  setInterval(() => {
    writeDateLines();
  }, 1000);
}

main();

process.on('SIGINT', () => {
  lcd.close();
  process.exit();
});
