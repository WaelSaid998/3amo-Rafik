import { CharacterEmotion, Language, VisemeShape } from '../types';

export interface SpeakOptions {
  text: string;
  language: Language;
  emotion: CharacterEmotion;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
  onWordBoundary?: (charIndex: number, length: number) => void;
  onViseme?: (shape: VisemeShape) => void;
}

// Convert all numeric digits to Arabic words and strip confusing diacritics
export function convertNumbersToArabicWords(text: string): string {
  return text
    .replace(/[ًٌٍَُِّْـ]/g, '')
    .replace(/22\s+تشرين\s+الثاني/g, 'اثنين وعشرين تشرين الثاني')
    .replace(/8\s+تشرين\s+الثاني/g, 'تمانية تشرين الثاني')
    .replace(/11\s+تشرين\s+الثاني/g, 'حداش تشرين الثاني')
    .replace(/1943/g, 'ألف وتسعمية وتلاتة وأربعين')
    .replace(/1946/g, 'ألف وتسعمية وستة وأربعين')
    .replace(/1920/g, 'ألف وتسعمية وعشرين')
    .replace(/1927/g, 'ألف وتسعمية وسبعة وعشرين')
    .replace(/31\s+كانون/g, 'واحد وتلاتين كانون')
    .replace(/\b22\b/g, 'اثنين وعشرين')
    .replace(/\b8\b/g, 'تمانية')
    .replace(/\b11\b/g, 'حداش')
    .replace(/\b12\b/g, 'طناش')
    .replace(/\b21\b/g, 'واحد وعشرين')
    .replace(/\b1\b/g, 'واحد')
    .replace(/\b2\b/g, 'تنين')
    .replace(/\b3\b/g, 'تلاتة')
    .replace(/\b4\b/g, 'أربعة')
    .replace(/\b5\b/g, 'خمسة')
    .replace(/\b6\b/g, 'ستة')
    .replace(/\b7\b/g, 'سبعة')
    .replace(/\b9\b/g, 'تسعة')
    .replace(/\b10\b/g, 'عشرة');
}

class AudioSpeechManager {
  private isMuted: boolean = false;
  private audioCtx: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private visemeInterval: number | null = null;
  private _isSpeaking: boolean = false;
  private activeAbortController: AbortController | null = null;

  constructor() {
    // Initialized on demand on user interaction
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public isCurrentlySpeaking(): boolean {
    return this._isSpeaking;
  }

  /**
   * Instantly and definitively terminates any active speech and audio.
   */
  public stop() {
    this._isSpeaking = false;

    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = null;
    }

    if (this.visemeInterval) {
      window.clearInterval(this.visemeInterval);
      this.visemeInterval = null;
    }

    // Stop Web Audio buffer source
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch {
        // ignore
      }
      this.currentSource = null;
    }

    // Stop audio element
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
        this.currentAudioElement.src = '';
      } catch {
        // ignore
      }
      this.currentAudioElement = null;
    }

    // Ensure browser robotic speech is canceled as well
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }

  /**
   * Speaks using custom deep masculine audio processing ("صوت زلمة خشن")
   * without using browser robot web speech!
   */
  public async speak(options: SpeakOptions) {
    this.stop();

    if (this.isMuted) {
      options.onStart?.();
      options.onViseme?.('slight');
      options.onEnd?.();
      return;
    }

    this._isSpeaking = true;
    const abortCtrl = new AbortController();
    this.activeAbortController = abortCtrl;

    // Convert all digits to Arabic words so numbers are never in English
    const arabicText = convertNumbersToArabicWords(
      options.text
        .replace(/[#*`_~[\]()]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    );

    if (!arabicText) {
      this.stop();
      options.onEnd?.();
      return;
    }

    // Visemes rhythm generator during speech
    const visemeSequence: VisemeShape[] = ['open', 'round', 'wide', 'teeth', 'slight', 'open', 'round'];
    let vIdx = 0;

    const startVisemes = () => {
      if (this.visemeInterval) clearInterval(this.visemeInterval);
      this.visemeInterval = window.setInterval(() => {
        if (this._isSpeaking) {
          vIdx = (vIdx + 1) % visemeSequence.length;
          options.onViseme?.(visemeSequence[vIdx]);
        }
      }, 125);
    };

    try {
      // Initialize Web Audio Context on user gesture
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      // Fetch the raw audio stream from our custom server endpoint
      const ttsUrl = `/api/tts?lang=${encodeURIComponent(options.language)}&text=${encodeURIComponent(arabicText)}`;
      const res = await fetch(ttsUrl, { signal: abortCtrl.signal });

      if (!res.ok) {
        throw new Error(`TTS server returned status ${res.status}`);
      }

      if (!this._isSpeaking) return;

      const arrayBuf = await res.arrayBuffer();
      if (!this._isSpeaking) return;

      // Decode audio into memory
      const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuf);
      if (!this._isSpeaking) return;

      // Playback rate set to 0.86 for authoritative, deep masculine Hakawati baritone spoken slightly faster
      const source = this.audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.playbackRate.value = 0.86;

      // Analog warm tube saturation for authentic husky vocal fry
      const waveShaper = this.audioCtx.createWaveShaper();
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      const k = 5;
      const deg = Math.PI / 180;
      for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
      waveShaper.curve = curve;
      waveShaper.oversample = '2x';

      // Deep chest resonance low-shelf filter (+11dB at 115Hz)
      const bassFilter = this.audioCtx.createBiquadFilter();
      bassFilter.type = 'lowshelf';
      bassFilter.frequency.value = 115;
      bassFilter.gain.value = 11.0;

      // Husky vocal cords gravel / throat fry peaking filter (+5.5dB at 420Hz)
      const huskyFilter = this.audioCtx.createBiquadFilter();
      huskyFilter.type = 'peaking';
      huskyFilter.frequency.value = 420;
      huskyFilter.gain.value = 5.5;

      // Warm masculine presence filter (+2.5dB at 850Hz)
      const midFilter = this.audioCtx.createBiquadFilter();
      midFilter.type = 'peaking';
      midFilter.frequency.value = 850;
      midFilter.gain.value = 2.5;

      // High-shelf filter (-7.5dB at 2600Hz) to remove thin high digital hiss
      const highFilter = this.audioCtx.createBiquadFilter();
      highFilter.type = 'highshelf';
      highFilter.frequency.value = 2600;
      highFilter.gain.value = -7.5;

      source.connect(waveShaper);
      waveShaper.connect(bassFilter);
      bassFilter.connect(huskyFilter);
      huskyFilter.connect(midFilter);
      midFilter.connect(highFilter);
      highFilter.connect(this.audioCtx.destination);

      this.currentSource = source;

      source.onended = () => {
        if (!this._isSpeaking) return;
        this.stop();
        options.onViseme?.('slight');
        options.onEnd?.();
      };

      source.start(0);
      options.onStart?.();
      startVisemes();

    } catch (err: any) {
      if (err.name === 'AbortError' || !this._isSpeaking) {
        // Stopped intentionally by user
        return;
      }
      console.warn('Custom audio playback error, falling back to HTMLAudioElement:', err);
      this.playViaAudioElement(arabicText, options, startVisemes);
    }
  }

  /**
   * Fallback using HTML5 Audio element with pitch slowdown if Web Audio decoding fails
   */
  private playViaAudioElement(text: string, options: SpeakOptions, startVisemes: () => void) {
    if (!this._isSpeaking) return;

    const ttsUrl = `/api/tts?lang=${encodeURIComponent(options.language)}&text=${encodeURIComponent(text)}`;
    const audio = new Audio(ttsUrl);
    this.currentAudioElement = audio;

    // Playback rate set to 0.86 for deep masculine tone
    audio.playbackRate = 0.86;

    audio.onplay = () => {
      if (!this._isSpeaking) {
        audio.pause();
        return;
      }
      options.onStart?.();
      startVisemes();
    };

    audio.onended = () => {
      if (!this._isSpeaking) return;
      this.stop();
      options.onViseme?.('slight');
      options.onEnd?.();
    };

    audio.onerror = () => {
      if (!this._isSpeaking) return;
      this.stop();
      options.onViseme?.('slight');
      options.onEnd?.();
    };

    audio.play().catch(() => {
      this.stop();
      options.onEnd?.();
    });
  }

  // Web Audio chime effects for buttons & celebrations
  public playSoundEffect(type: 'click' | 'success' | 'trumpet' | 'drum') {
    if (this.isMuted) return;
    try {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      if (type === 'click') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.04);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'success' || type === 'trumpet') {
        const freqs = [392, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
        freqs.forEach((f, idx) => {
          const osc = this.audioCtx!.createOscillator();
          const gain = this.audioCtx!.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + idx * 0.08);
          gain.gain.setValueAtTime(0.12, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);
          osc.connect(gain);
          gain.connect(this.audioCtx!.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.55);
        });
      } else if (type === 'drum') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {
      // AudioContext may be blocked before interaction
    }
  }
}

export const audioSpeech = new AudioSpeechManager();
