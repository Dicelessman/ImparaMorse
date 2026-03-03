// Parser per convertire pressioni lunghe/corte in punti e linee
export class InputParser {
    private baseUnit: number; // millisecondi (durata di un punto)
    private sequence: string = '';
    private pressStartTime: number = 0;

    // Callback opzionale chiamata quando viene identificata una pausa (fine lettera/parola)
    public onPatternComplete?: (pattern: string) => void;

    constructor(wpm: number = 20) {
        // Calcola la durata del punto in base alle WPM (formula standard: 1200 / WPM)
        this.baseUnit = 1200 / wpm;
    }

    public handlePressDown() {
        this.pressStartTime = Date.now();
    }

    public handlePressUp(): string {
        if (!this.pressStartTime) return this.sequence;

        const duration = Date.now() - this.pressStartTime;
        this.pressStartTime = 0;

        // La regola standard è che un punto = 1 unità, una linea = 3 unità.
        // Diamo un margine di tolleranza all'utente (es. se dura meno di 2 unità è un punto)
        if (duration < this.baseUnit * 2) {
            this.sequence += '.';
        } else {
            this.sequence += '-';
        }

        // Potresti usare setTimeout qui per rilevare la fine dell'inserimento (es: pausa > 3 unità),
        // ma per l'esercizio "Trasmissione" è spesso meglio far confermare all'utente l'intero
        // pattern o validarlo a ogni tap.

        return this.sequence;
    }

    public getSequence(): string {
        return this.sequence;
    }

    public clear() {
        this.sequence = '';
        this.pressStartTime = 0;
    }
}
