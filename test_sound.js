const player = require('play-sound')((opts = {}));

player.play('audios/Meri_King.mp4', err => {
  if (err) {
    throw err;
  }
});
