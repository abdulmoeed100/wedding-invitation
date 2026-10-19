// Royal Wedding Audio Engine
// Features: Real Studio Wedding Music (assets/audio/wedding_song.mp3),
// Interactive Dholak Drum Sounds (Bayan & Dayan), Envelope Opening SFX,
// Scratch Card FX, and Royal Chimes

class RoyalWeddingAudio {
  constructor() {
    this.music = new Audio('assets/audio/wedding_song.mp3');
    this.music.loop = true;
    this.music.preload = 'auto';
    this.music.volume = 0.55;

    // Real Recorded Dhol Beats
    this.bhangraAudio = new Audio('assets/audio/bhangra_beat.mp3');
    this.bhangraAudio.loop = true;
    this.bhangraAudio.preload = 'auto';
    this.bhangraAudio.volume = 0.85;

    this.luddiAudio = new Audio('assets/audio/luddi_beat.mp3');
    this.luddiAudio.loop = true;
    this.luddiAudio.preload = 'auto';
    this.luddiAudio.volume = 0.85;

    this.isPlaying = false;
    this.isMuted = false;
    this.activeBeat = null;
    this.savedMusicVolume = 0.55;
    this.audioCtx = null;
    this.lastScratchTime = 0;

    // Handle music events
    this.music.addEventListener('play', () => {
      this.isPlaying = true;
      this.updateUI();
    });
    this.music.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updateUI();
    });
  }

  // Real Bhangra Dhol Beat Loop
  playBhangraBeat() {
    this.stopDholBeats();
    if (this.isPlaying) {
      this.savedMusicVolume = this.music.volume;
      this.music.volume = 0.15; // Duck background track so real Dhol rocks
    }
    this.bhangraAudio.currentTime = 0;
    this.bhangraAudio.play().then(() => {
      this.activeBeat = 'bhangra';
    }).catch(err => console.log('Bhangra beat playback error:', err));
  }

  // Real Festive Luddi Dhol Beat Loop
  playLuddiBeat() {
    this.stopDholBeats();
    if (this.isPlaying) {
      this.savedMusicVolume = this.music.volume;
      this.music.volume = 0.15; // Duck background track
    }
    this.luddiAudio.currentTime = 0;
    this.luddiAudio.play().then(() => {
      this.activeBeat = 'luddi';
    }).catch(err => console.log('Luddi beat playback error:', err));
  }

  // Stop All Dhol Beats & Restore Music Volume
  stopDholBeats() {
    if (this.bhangraAudio) {
      this.bhangraAudio.pause();
      this.bhangraAudio.currentTime = 0;
    }
    if (this.luddiAudio) {
      this.luddiAudio.pause();
      this.luddiAudio.currentTime = 0;
    }
    if (this.isPlaying && this.savedMusicVolume) {
      this.music.volume = this.savedMusicVolume;
    }
    this.activeBeat = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Toggle Background Wedding Music
  toggleMusic() {
    if (this.isPlaying) {
      this.pauseMusic();
      return false;
    } else {
      this.playMusic();
      return true;
    }
  }

  playMusic() {
    this.music.play().then(() => {
      this.isPlaying = true;
      this.updateUI();
    }).catch(err => {
      console.log('Audio autoplay blocked, waiting for user gesture:', err);
    });
  }

  pauseMusic() {
    this.music.pause();
    this.isPlaying = false;
    this.updateUI();
  }

  setVolume(vol) {
    this.music.volume = Math.max(0, Math.min(1, vol));
  }

  updateUI() {
    const btn = document.getElementById('floating-music-btn');
    const indicator = document.getElementById('music-wave-indicator');
    const playerBanner = document.getElementById('audio-track-status');

    if (btn) btn.classList.toggle('playing', this.isPlaying);
    if (indicator) indicator.classList.toggle('active', this.isPlaying);
    if (playerBanner) {
      playerBanner.textContent = this.isPlaying ? "Playing: Royal Shehnai & Dholki Instrumental" : "Music Paused";
    }
  }

  // Realistic Envelope Wax Seal Crack & Paper Rustle Sound
  playEnvelopeOpenSound() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Wax crack sound (short crisp noise burst + snap)
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1800;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);

    // 2. Paper slide / rustle sound
    const rustleBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
    const rData = rustleBuffer.getChannelData(0);
    for (let i = 0; i < rustleBuffer.length; i++) {
      rData[i] = (Math.random() * 2 - 1) * Math.sin(i / 80) * 0.5;
    }
    const rustleSource = ctx.createBufferSource();
    rustleSource.buffer = rustleBuffer;

    const rFilter = ctx.createBiquadFilter();
    rFilter.type = 'bandpass';
    rFilter.frequency.value = 950;
    rFilter.Q.value = 1.2;

    const rGain = ctx.createGain();
    rGain.gain.setValueAtTime(0.001, now + 0.05);
    rGain.gain.linearRampToValueAtTime(0.18, now + 0.12);
    rGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    rustleSource.connect(rFilter);
    rFilter.connect(rGain);
    rGain.connect(ctx.destination);
    rustleSource.start(now + 0.05);
  }

  // Interactive Dholak Drum Sound: Deep Bass "Bayan"
  playDholBayan() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Classic Dholak pitch drop (85Hz down to 42Hz)
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.22);

    gain.gain.setValueAtTime(0.65, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  // Interactive Dholak Drum Sound: Crisp Treble "Dayan / Chati"
  playDholDayan() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Tone resonance
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    // Rim click snap
    const bufferSize = ctx.sampleRate * 0.04;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const snap = ctx.createBufferSource();
    snap.buffer = buffer;

    const snapFilter = ctx.createBiquadFilter();
    snapFilter.type = 'highpass';
    snapFilter.frequency.value = 3200;

    const snapGain = ctx.createGain();
    snapGain.gain.setValueAtTime(0.35, now);
    snapGain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

    snap.connect(snapFilter);
    snapFilter.connect(snapGain);
    snapGain.connect(ctx.destination);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    snap.start(now);
    osc.stop(now + 0.15);
  }

  // Scratch Sound Effect
  playScratchSound() {
    const now = Date.now();
    if (now - this.lastScratchTime < 80) return;
    this.lastScratchTime = now;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.04;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.5));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2600 + Math.random() * 700;
    filter.Q.value = 2.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  }

  // Celebratory Royal Chime & Fanfare
  playCelebrationChime() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 2.0);
    });
  }

  playBell() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5 Bell
    osc.frequency.exponentialRampToValueAtTime(1975.53, now + 0.04);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }
}

// Global instance
window.royalAudio = new RoyalWeddingAudio();
window.weddingAudio = window.royalAudio; // backward compatibility
