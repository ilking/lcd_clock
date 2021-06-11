import Player from 'play-sound';

const AUDIO_FILE_BASE = '/home/pi/clock_scripts/audios';
const audio_files = [
  { name: 'Abba Groskin', path: `${AUDIO_FILE_BASE}/AbbaGroskin.mp3` },
  { name: 'Adir King', path: `${AUDIO_FILE_BASE}/AdirKing.mp3` },
  { name: 'Akiva Groskin', path: `${AUDIO_FILE_BASE}/Akiva.mp4` },
  { name: 'Ari King', path: `${AUDIO_FILE_BASE}/AriKing.mp3` },
  { name: 'Becca Levitan', path: `${AUDIO_FILE_BASE}/BeccaLevitan.mp3` },
  { name: 'Ed King', path: `${AUDIO_FILE_BASE}/Ed_King.mp4` },
  { name: 'Elchanan Groskin', path: `${AUDIO_FILE_BASE}/Elchanan.mp3` },
  { name: 'Elimelech Groskin', path: `${AUDIO_FILE_BASE}/Elimelech.mp3` },
  { name: 'Ezra Groskin', path: `${AUDIO_FILE_BASE}/EzraGroskin.mp3` },
  { name: 'Meri King', path: `${AUDIO_FILE_BASE}/Meri_King.mp4` },
  { name: 'Nachi King', path: `${AUDIO_FILE_BASE}/NachiKing.mp3` },
  { name: 'Shira Groskin', path: `${AUDIO_FILE_BASE}/ShiraGroskin.mp3` },
  { name: 'Sharon Groskin', path: `${AUDIO_FILE_BASE}/SharonGroskin.mp3` },
  { name: 'Yanai Groskin', path: `${AUDIO_FILE_BASE}/Yanai.mp4` },
];

const starterAudio = `${AUDIO_FILE_BASE}/IanStart.mp3`;

export default class AudioManager {
  constructor() {
    this.player = new Player();
    this.ready = false;
    this.queuedAudio = null;
  }

  queueAudio() {
    this.queuedAudio = audio_files[Math.floor(Math.random() * audio_files.length)];
    // this.queuedAudio = audio_files[10];
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

    this.player.play(starterAudio, err => {
      if (err) {
        console.error(err);
      }
    });

    setTimeout(() => {
      this.player.play(path, err => {
        if (err) {
          console.error(err);
        }
      });
    }, 15000);

    this.queuedAudio = null;
  }
}
