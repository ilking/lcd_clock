import Player from 'play-sound';

const AUDIO_FILE_BASE = '/home/pi/clock_scripts/audios';
const audio_files = [
  { name: 'Aba Groskin', path: `AbbaGroskin.mp3` },
  { name: 'Abby Figat', path: `AbbyFigat.mp3` },
  { name: 'Adir King', path: `AdirKing.mp3` },
  { name: 'Akiva Groskin', path: `Akiva.mp4` },
  { name: 'Ari King', path: `AriKing.mp3` },
  { name: 'Becca Levitan', path: `BeccaLevitan.mp3` },
  { name: 'Ed King', path: `Ed_King.mp4` },
  { name: 'Elchanan Groskin', path: `Elchanan.mp3` },
  { name: 'Elimelech Groskin', path: `Elimelech.mp3` },
  { name: 'Ita Fiet', path: 'ItaFiet.mp3' },
  // { name: 'Ezra Groskin', path: `EzraGroskin.mp3` },
  { name: 'Melissa Czinn', path: 'Melissa.mp3' },
  { name: 'Meri King', path: `Meri_King.mp4` },
  { name: 'Nachi King', path: `NachiKing.mp3` },
  { name: 'Shira Groskin', path: `ShiraGroskin.mp3` },
  { name: 'Sharon Groskin', path: `SharonGroskin.mp3` },
  { name: 'Yanai Groskin', path: `Yanai.mp4` },
];

const starterAudio = `IanStart.mp3`;

export default class AudioManager {
  constructor() {
    this.player = new Player();
    this.ready = false;
    this.queuedAudio = null;
  }

  queueAudio() {
    this.queuedAudio = audio_files[Math.floor(Math.random() * audio_files.length)];
    // this.queuedAudio = audio_files[1];
  }

  isReady() {
    return !!this.queuedAudio;
  }

  getAudioName() {
    return this.queuedAudio?.name || null;
  }

  playAudio() {
    if (!this.queuedAudio) {
      console.error('No audio file queued');
    }

    const { path } = this.queuedAudio;

    this.player.play(`${AUDIO_FILE_BASE}/${starterAudio}`, err => {
      if (err) {
        console.error(err);
      }
    });

    setTimeout(() => {
      this.player.play(`${AUDIO_FILE_BASE}/${path}`, err => {
        if (err) {
          console.error(err);
        }
      });
    }, 16000);

    this.queuedAudio = null;
  }
}
