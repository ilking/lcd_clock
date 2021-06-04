import Player from 'play-sound';

const AUDIO_FILE_BASE = '/home/pi/clock_scripts/audios';
const audio_files = [
  { name: 'Meri King', path: `${AUDIO_FILE_BASE}/Meri_King.mp4` },
  { name: 'Ed King', path: `${AUDIO_FILE_BASE}/Ed_King.mp4` },
];

export default class AudioManager {
  constructor() {
    this.player = new Player();
    this.ready = false;
    this.queuedAudio = null;
  }

  queueAudio() {
    this.queuedAudio = audio_files[Math.floor(Math.random() * audio_files.length)];
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

    this.player.play(path, err => {
      if (err) {
        console.error(err);
      }
    });

    this.queuedAudio = null;
  }
}
