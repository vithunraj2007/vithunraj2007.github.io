/**
 * CLOCKTIMER - Study Sound Lab Engine
 * Pure Web Audio API Synthesizer - 100% offline, zero external sound files required.
 * Generates: Brown, White, Pink, Black noise, Rain, Forest, Ocean, Cafe, Binaural Beats.
 */

class StudySoundLab {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.masterVolume = 0.8;
    this.tracks = {};
    this.sleepTimerId = null;
    this.sleepTimerRemaining = 0;
    this.sleepTimerInterval = null;

    // Default track configs
    this.trackDefs = [
      { id: 'brown', name: 'Brown Noise', category: 'noise', desc: 'Deep, calming low-frequency rumble for heavy focus', icon: 'zap' },
      { id: 'white', name: 'White Noise', category: 'noise', desc: 'Crisp, static masking for noisy environments', icon: 'activity' },
      { id: 'pink', name: 'Pink Noise', category: 'noise', desc: 'Balanced 1/f spectrum for reading & deep memory recall', icon: 'disc' },
      { id: 'black', name: 'Black Noise', category: 'noise', desc: 'Near-silence sub-audible infrasonic sensory calm', icon: 'moon' },
      { id: 'rain', name: 'Rain & Thunder', category: 'nature', desc: 'Gentle raindrops with occasional soft distant thunder', icon: 'cloud-rain' },
      { id: 'ocean', name: 'Ocean Waves', category: 'nature', desc: 'Rhythmic swell and soothing shoreline surf', icon: 'wind' },
      { id: 'forest', name: 'Forest Breeze', category: 'nature', desc: 'Whispering wind through pine leaves and woodland air', icon: 'feather' },
      { id: 'cafe', name: 'Library & Café', category: 'ambience', desc: 'Warm, muffled room acoustics of a tranquil study hall', icon: 'coffee' },
      { id: 'binaural_alpha', name: 'Alpha Waves (10 Hz)', category: 'binaural', desc: 'Flow state, relaxed alertness and calm concentration', icon: 'radio' },
      { id: 'binaural_gamma', name: 'Gamma Beats (40 Hz)', category: 'binaural', desc: 'Maximum cognitive acuity and problem solving', icon: 'cpu' }
    ];

    this.presets = {
      'deep_focus': { name: 'Deep Focus', tracks: { brown: 0.7, rain: 0.4, binaural_alpha: 0.3 } },
      'rainy_library': { name: 'Rainy Library', tracks: { rain: 0.8, cafe: 0.4, pink: 0.2 } },
      'coastal_calm': { name: 'Coastal Calm', tracks: { ocean: 0.75, binaural_alpha: 0.4 } },
      'night_study': { name: 'Night Sanctuary', tracks: { black: 0.8, brown: 0.3, forest: 0.25 } },
      'zen_silence': { name: 'Near Silence', tracks: { black: 0.9 } }
    };

    // Try loading saved user presets from localStorage
    this.loadUserPresets();
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  loadUserPresets() {
    try {
      const saved = localStorage.getItem('CLOCKTIMER_SOUND_PRESETS');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.presets = { ...this.presets, ...parsed };
      }
    } catch (e) {
      console.warn('Could not load custom presets', e);
    }
  }

  saveUserPreset(presetId, name, trackLevels) {
    this.presets[presetId] = { name, tracks: { ...trackLevels } };
    try {
      localStorage.setItem('CLOCKTIMER_SOUND_PRESETS', JSON.stringify(this.presets));
    } catch (e) {
      console.warn('Could not save custom presets', e);
    }
  }

  deleteUserPreset(presetId) {
    if (this.presets[presetId]) {
      delete this.presets[presetId];
      try {
        localStorage.setItem('CLOCKTIMER_SOUND_PRESETS', JSON.stringify(this.presets));
      } catch (e) {}
    }
  }

  // --- Web Audio Synthesizer Generators ---

  createWhiteNoiseBuffer() {
    const bufferSize = this.ctx.sampleRate * 4; // 4 second loop
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  createPinkNoiseBuffer() {
    // Paul Kellet's refined 7-pole method for precise 1/f pink noise
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  createBrownNoiseBuffer() {
    // Integrated white noise with gentle DC leaky filter
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    }
    return buffer;
  }

  createBlackNoiseBuffer() {
    // Ultra-low infrasonic soothing near-silence (<35 Hz gentle resonance)
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.005 * white) / 1.005;
      data[i] = lastOut * 0.8;
    }
    return buffer;
  }

  // --- Track Lifecycle ---

  startTrack(trackId, targetVolume = 0.5, fadeTime = 1.5) {
    this.initContext();
    if (this.tracks[trackId] && this.tracks[trackId].isPlaying) {
      this.setTrackVolume(trackId, targetVolume);
      return;
    }

    const trackObj = {
      id: trackId,
      isPlaying: true,
      volume: targetVolume,
      gainNode: this.ctx.createGain(),
      nodes: []
    };

    // Start gain at zero for smooth fade in
    trackObj.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    trackObj.gainNode.gain.exponentialRampToValueAtTime(
      Math.max(0.001, targetVolume),
      this.ctx.currentTime + fadeTime
    );
    trackObj.gainNode.connect(this.masterGain);

    // Build specific generator graph based on trackId
    switch (trackId) {
      case 'white': {
        const src = this.ctx.createBufferSource();
        src.buffer = this.createWhiteNoiseBuffer();
        src.loop = true;
        // Mild lowpass to prevent harshness
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 8000;
        src.connect(filter);
        filter.connect(trackObj.gainNode);
        src.start();
        trackObj.nodes.push(src, filter);
        break;
      }
      case 'pink': {
        const src = this.ctx.createBufferSource();
        src.buffer = this.createPinkNoiseBuffer();
        src.loop = true;
        src.connect(trackObj.gainNode);
        src.start();
        trackObj.nodes.push(src);
        break;
      }
      case 'brown': {
        const src = this.ctx.createBufferSource();
        src.buffer = this.createBrownNoiseBuffer();
        src.loop = true;
        // Lowpass at 350Hz for warm deep rumble
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 350;
        src.connect(filter);
        filter.connect(trackObj.gainNode);
        src.start();
        trackObj.nodes.push(src, filter);
        break;
      }
      case 'black': {
        const src = this.ctx.createBufferSource();
        src.buffer = this.createBlackNoiseBuffer();
        src.loop = true;
        // Very steep lowpass at 60Hz - peaceful infrasonic floor
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 55;
        src.connect(filter);
        filter.connect(trackObj.gainNode);
        src.start();
        trackObj.nodes.push(src, filter);
        break;
      }
      case 'rain': {
        // Rain: filtered noise + bandpass droplets + periodic thunder modulation
        const src = this.ctx.createBufferSource();
        src.buffer = this.createPinkNoiseBuffer();
        src.loop = true;

        const rainFilter = this.ctx.createBiquadFilter();
        rainFilter.type = 'bandpass';
        rainFilter.frequency.value = 1200;
        rainFilter.Q.value = 0.8;

        const highDrop = this.ctx.createBiquadFilter();
        highDrop.type = 'highpass';
        highDrop.frequency.value = 800;

        src.connect(rainFilter);
        rainFilter.connect(highDrop);
        highDrop.connect(trackObj.gainNode);
        src.start();

        // Distant gentle rolling thunder LFO
        const thunderOsc = this.ctx.createOscillator();
        thunderOsc.frequency.value = 0.05; // every ~20 seconds
        const thunderGain = this.ctx.createGain();
        thunderGain.gain.value = 0.2;
        thunderOsc.connect(thunderGain);
        thunderOsc.start();

        trackObj.nodes.push(src, rainFilter, highDrop, thunderOsc, thunderGain);
        break;
      }
      case 'ocean': {
        // Ocean: Brown/Pink noise modulated by 0.09Hz swell LFO (11-second cycle)
        const src = this.ctx.createBufferSource();
        src.buffer = this.createPinkNoiseBuffer();
        src.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 450;

        const swellGain = this.ctx.createGain();
        swellGain.gain.value = 0.5;

        // LFO for wave surge
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.085; // ~12 sec wave swell
        const lfoDepth = this.ctx.createGain();
        lfoDepth.gain.value = 0.35;
        lfo.connect(lfoDepth);
        lfoDepth.connect(swellGain.gain);

        src.connect(filter);
        filter.connect(swellGain);
        swellGain.connect(trackObj.gainNode);

        src.start();
        lfo.start();
        trackObj.nodes.push(src, filter, swellGain, lfo, lfoDepth);
        break;
      }
      case 'forest': {
        // Forest breeze: lowpass wind noise + gentle high-pass whispering
        const src = this.ctx.createBufferSource();
        src.buffer = this.createPinkNoiseBuffer();
        src.loop = true;

        const windFilter = this.ctx.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.frequency.value = 650;
        windFilter.Q.value = 1.2;

        const breezeLfo = this.ctx.createOscillator();
        breezeLfo.frequency.value = 0.15; // wind swell
        const breezeDepth = this.ctx.createGain();
        breezeDepth.gain.value = 250;
        breezeLfo.connect(breezeDepth);
        breezeDepth.connect(windFilter.frequency);

        src.connect(windFilter);
        windFilter.connect(trackObj.gainNode);
        src.start();
        breezeLfo.start();

        trackObj.nodes.push(src, windFilter, breezeLfo, breezeDepth);
        break;
      }
      case 'cafe': {
        // Ambient room tone: brown noise + resonant room modes simulating peaceful library/cafe
        const src = this.ctx.createBufferSource();
        src.buffer = this.createBrownNoiseBuffer();
        src.loop = true;

        const roomFilter = this.ctx.createBiquadFilter();
        roomFilter.type = 'bandpass';
        roomFilter.frequency.value = 280;
        roomFilter.Q.value = 2.0;

        src.connect(roomFilter);
        roomFilter.connect(trackObj.gainNode);
        src.start();
        trackObj.nodes.push(src, roomFilter);
        break;
      }
      case 'binaural_alpha': {
        // 10 Hz Alpha beat: Left = 200 Hz, Right = 210 Hz
        const merger = this.ctx.createChannelMerger(2);
        const oscL = this.ctx.createOscillator();
        oscL.type = 'sine';
        oscL.frequency.value = 200;

        const oscR = this.ctx.createOscillator();
        oscR.type = 'sine';
        oscR.frequency.value = 210;

        oscL.connect(merger, 0, 0); // left
        oscR.connect(merger, 0, 1); // right
        merger.connect(trackObj.gainNode);

        oscL.start();
        oscR.start();
        trackObj.nodes.push(oscL, oscR, merger);
        break;
      }
      case 'binaural_gamma': {
        // 40 Hz Gamma beat: Left = 220 Hz, Right = 260 Hz
        const merger = this.ctx.createChannelMerger(2);
        const oscL = this.ctx.createOscillator();
        oscL.type = 'sine';
        oscL.frequency.value = 220;

        const oscR = this.ctx.createOscillator();
        oscR.type = 'sine';
        oscR.frequency.value = 260;

        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);
        merger.connect(trackObj.gainNode);

        oscL.start();
        oscR.start();
        trackObj.nodes.push(oscL, oscR, merger);
        break;
      }
    }

    this.tracks[trackId] = trackObj;
  }

  stopTrack(trackId, fadeTime = 1.0) {
    const track = this.tracks[trackId];
    if (!track || !track.isPlaying) return;

    if (this.ctx && track.gainNode) {
      try {
        track.gainNode.gain.setValueAtTime(track.gainNode.gain.value, this.ctx.currentTime);
        track.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + fadeTime);
      } catch (e) {}
    }

    setTimeout(() => {
      track.nodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch (e) {}
      });
      track.isPlaying = false;
      track.nodes = [];
    }, fadeTime * 1000);
  }

  toggleTrack(trackId, targetVolume = 0.5) {
    if (this.tracks[trackId] && this.tracks[trackId].isPlaying) {
      this.stopTrack(trackId);
      return false;
    } else {
      this.startTrack(trackId, targetVolume);
      return true;
    }
  }

  setTrackVolume(trackId, volume) {
    const track = this.tracks[trackId];
    if (!track) return;
    track.volume = Math.max(0, Math.min(1, volume));
    if (this.ctx && track.gainNode && track.isPlaying) {
      try {
        track.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
        track.gainNode.gain.setValueAtTime(track.gainNode.gain.value, this.ctx.currentTime);
        track.gainNode.gain.exponentialRampToValueAtTime(
          Math.max(0.001, track.volume),
          this.ctx.currentTime + 0.05
        );
      } catch (e) {
        track.gainNode.gain.value = track.volume;
      }
    }
  }

  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.ctx && this.masterGain && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.initContext();
    this.isMuted = !this.isMuted;
    if (this.ctx && this.masterGain) {
      const target = this.isMuted ? 0 : this.masterVolume;
      this.masterGain.gain.setValueAtTime(target, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  stopAll(fadeTime = 1.0) {
    Object.keys(this.tracks).forEach(id => {
      if (this.tracks[id].isPlaying) {
        this.stopTrack(id, fadeTime);
      }
    });
    this.clearSleepTimer();
  }

  applyPreset(presetKey) {
    const preset = this.presets[presetKey];
    if (!preset) return;
    this.stopAll(0.5);
    setTimeout(() => {
      Object.entries(preset.tracks).forEach(([trackId, vol]) => {
        this.startTrack(trackId, vol, 1.2);
      });
    }, 550);
  }

  // --- Sleep Timer ---

  setSleepTimer(minutes, onTick, onComplete) {
    this.clearSleepTimer();
    if (!minutes || minutes <= 0) return;

    this.sleepTimerRemaining = minutes * 60;
    if (onTick) onTick(this.sleepTimerRemaining);

    this.sleepTimerInterval = setInterval(() => {
      this.sleepTimerRemaining--;
      if (onTick) onTick(this.sleepTimerRemaining);

      // Start fade out in the last 15 seconds
      if (this.sleepTimerRemaining === 15) {
        this.stopAll(15);
      }

      if (this.sleepTimerRemaining <= 0) {
        this.clearSleepTimer();
        this.stopAll(1.0);
        if (onComplete) onComplete();
      }
    }, 1000);
  }

  clearSleepTimer() {
    if (this.sleepTimerInterval) {
      clearInterval(this.sleepTimerInterval);
      this.sleepTimerInterval = null;
    }
    this.sleepTimerRemaining = 0;
  }

  // --- Study Bell / Chime Notification ---
  playChime(type = 'bell') {
    this.initContext();
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    if (type === 'bell') {
      // Tibetan bell harmonic chime
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(528, now); // 528 Hz Love/DNA frequency
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1056, now); // octave harmonic
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.4, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
    } else {
      // Gentle break gong
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(396, now);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(792, now);
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.35, now + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
    }

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 3.2);
    osc2.stop(now + 3.2);
  }
}

// Global singleton instance for easy modular access
window.studySoundLab = new StudySoundLab();
