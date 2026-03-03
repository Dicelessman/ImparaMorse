export interface SyllableData {
    primary: string;
    alternatives: string[];
}

export interface MorseCharacter {
    char: string;
    pattern: string; // .-
    syllables?: SyllableData;
}

export const MORSE_DICT: MorseCharacter[] = [
    { char: 'A', pattern: '.-', syllables: { primary: 'Ar-tu-ro', alternatives: ['Ar-bo', 'A-mor'] } },
    { char: 'B', pattern: '-...', syllables: { primary: 'Bo-na-par-te', alternatives: ['Ba-ci-la-re', 'Bar-ba-ba-pà'] } },
    { char: 'C', pattern: '-.-.', syllables: { primary: 'Co-raz-za-ta', alternatives: ['Ca-va-lie-re'] } },
    { char: 'D', pattern: '-..', syllables: { primary: 'Do-mi-no', alternatives: ['Dac-ti-lo'] } },
    { char: 'E', pattern: '.', syllables: { primary: 'Eh', alternatives: ['Er', 'Es'] } },
    { char: 'F', pattern: '..-.', syllables: { primary: 'Fa-ra-o-ne', alternatives: ['Fe-li-ci-tà'] } },
    { char: 'G', pattern: '--.', syllables: { primary: 'Go-do-la', alternatives: ['Ga-le-ra', 'Gi-go-lò'] } },
    { char: 'H', pattern: '....', syllables: { primary: 'Hi-ma-la-ya', alternatives: ['Ho-lo-caus-to'] } },
    { char: 'I', pattern: '..', syllables: { primary: 'I-bi', alternatives: ['I-ri'] } },
    { char: 'J', pattern: '.---', syllables: { primary: 'Ja-pon-e-se', alternatives: ['Ju-ve-nil-e'] } },
    { char: 'K', pattern: '-.-', syllables: { primary: 'Ko-ka-ro', alternatives: ['Ka-mi-ka-ze'] } },
    { char: 'L', pattern: '.-..', syllables: { primary: 'Li-mo-na-ta', alternatives: ['Le-gi-ti-mo'] } },
    { char: 'M', pattern: '--', syllables: { primary: 'Mo-to', alternatives: ['Ma-re'] } },
    { char: 'N', pattern: '-.', syllables: { primary: 'No-ia', alternatives: ['Na-ve'] } },
    { char: 'O', pattern: '---', syllables: { primary: 'O-por-to', alternatives: ['O-sta-co-lo'] } },
    { char: 'P', pattern: '.--.', syllables: { primary: 'Pa-lo-ma-ro', alternatives: ['Pi-lo-po-li'] } },
    { char: 'Q', pattern: '--.-', syllables: { primary: 'Quo-ti-dia-no', alternatives: ['Quo-ta-zio-ne'] } },
    { char: 'R', pattern: '.-.', syllables: { primary: 'Ra-ma-ro', alternatives: ['Ri-ce-va'] } },
    { char: 'S', pattern: '...', syllables: { primary: 'Sa-ha-ra', alternatives: ['Si-bi-la'] } },
    { char: 'T', pattern: '-', syllables: { primary: 'Ton', alternatives: ['Tre'] } },
    { char: 'U', pattern: '..-', syllables: { primary: 'U-ni-on', alternatives: ['U-ni-tà'] } },
    { char: 'V', pattern: '...-', syllables: { primary: 'Ven-ti-la-tor', alternatives: ['Va-li-di-tà'] } },
    { char: 'W', pattern: '.--', syllables: { primary: 'Wa-shing-ton', alternatives: ['Wa-ter-loo'] } },
    { char: 'X', pattern: '-..-', syllables: { primary: 'Xo-co-la-tl', alternatives: ['Xi-lo-fo-no'] } },
    { char: 'Y', pattern: '-.--', syllables: { primary: 'Yo-shi-mo-to', alternatives: ['Yo-yo-is-ta'] } },
    { char: 'Z', pattern: '--..', syllables: { primary: 'Zor-ro-is-ta', alternatives: ['Za-pa-te-ro'] } },

    // Numeri
    { char: '1', pattern: '.----' },
    { char: '2', pattern: '..---' },
    { char: '3', pattern: '...--' },
    { char: '4', pattern: '....-' },
    { char: '5', pattern: '.....' },
    { char: '6', pattern: '-....' },
    { char: '7', pattern: '--...' },
    { char: '8', pattern: '---..' },
    { char: '9', pattern: '----.' },
    { char: '0', pattern: '-----' }
];

export const charToMorse = (char: string): string => {
    const upperChar = char.toUpperCase();
    const entry = MORSE_DICT.find(c => c.char === upperChar);
    return entry ? entry.pattern : '';
};

export const morseToChar = (pattern: string): string => {
    const entry = MORSE_DICT.find(c => c.pattern === pattern);
    return entry ? entry.char : '';
};

// Mappa per conversioni rapide
export const MORSE_MAP = new Map<string, string>();
export const REVERSE_MORSE_MAP = new Map<string, string>();

MORSE_DICT.forEach(entry => {
    MORSE_MAP.set(entry.char, entry.pattern);
    REVERSE_MORSE_MAP.set(entry.pattern, entry.char);
});
