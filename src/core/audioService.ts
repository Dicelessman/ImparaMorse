import { MORSE_MAP } from './morseDictionary';

class AudioService {
    private audioCtx: AudioContext | null = null;
    private oscillator: OscillatorNode | null = null;
    private gainNode: GainNode | null = null;

    // Frequenza standard per codice morse (es. 600Hz o 700Hz)
    private frequency = 600;

    // Velocità in WPM (Words Per Minute)
    // La durata di un punto (dot) in ms è circa 1200 / WPM
    private wpm = 20;

    constructor() {
        // L'AudioContext verrà inizializzato solo al primo "user gesture" per policy dei browser
    }

    public getDotDuration(): number {
        return 1200 / this.wpm;
    }

    public setWpm(newWpm: number) {
        this.wpm = newWpm;
    }

    private initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    // Utilizzato per l'esercizio in cui l'utente preme il tasto (trasmissione)
    public startTone() {
        this.initAudio();
        if (!this.audioCtx) return;

        this.oscillator = this.audioCtx.createOscillator();
        this.oscillator.type = 'sine';
        this.oscillator.frequency.value = this.frequency;

        this.gainNode = this.audioCtx.createGain();
        // Veloce fade-in per evitare "click" audio
        this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(1, this.audioCtx.currentTime + 0.01);

        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.audioCtx.destination);

        this.oscillator.start();
    }

    public stopTone() {
        if (!this.audioCtx || !this.oscillator || !this.gainNode) return;

        // Veloce fade-out per evitare "click"
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.audioCtx.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.01);

        const osc = this.oscillator;
        setTimeout(() => {
            osc.stop();
            osc.disconnect();
        }, 10);

        this.oscillator = null;
        this.gainNode = null;
    }

    // Riproduce una singola lettera
    public async playSequence(pattern: string): Promise<void> {
        this.initAudio();
        if (!this.audioCtx) return;

        const dotDuration = this.getDotDuration() / 1000; // in secondi
        let time = this.audioCtx.currentTime;

        for (let i = 0; i < pattern.length; i++) {
            const symbol = pattern[i];

            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.value = this.frequency;

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            const duration = symbol === '-' ? dotDuration * 3 : dotDuration;

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(1, time + 0.01);
            gain.gain.setValueAtTime(1, time + duration - 0.01);
            gain.gain.linearRampToValueAtTime(0, time + duration);

            osc.start(time);
            osc.stop(time + duration);

            // Aggiungi pausa tra simboli (1 punto)
            time += duration + dotDuration;
        }

        return new Promise(resolve => setTimeout(resolve, (time - this.audioCtx!.currentTime) * 1000));
    }

    // Riproduce una stringa intera, gestendo le pause tra lettere e parole
    public async playText(text: string): Promise<void> {
        const words = text.toUpperCase().split(' ');
        const dotMs = this.getDotDuration();

        for (let w = 0; w < words.length; w++) {
            const letters = words[w].split('');

            for (let l = 0; l < letters.length; l++) {
                const char = letters[l];
                const pattern = MORSE_MAP.get(char);

                if (pattern) {
                    await this.playSequence(pattern);

                    // Pausa tra lettere (3 punti), ma playSequence ne ha già aggiunto 1
                    if (l < letters.length - 1) {
                        await new Promise(r => setTimeout(r, dotMs * 2));
                    }
                }
            }

            // Pausa tra parole (7 punti totali). Dopo l'ultima lettera abbiamo già atteso ~3 punti,
            // quindi aggiungiamone altri 4 per arrivare a 7.
            if (w < words.length - 1) {
                await new Promise(r => setTimeout(r, dotMs * 4));
            }
        }
    }
}

export const audioService = new AudioService();
