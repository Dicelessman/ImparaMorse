export const SCOUT_QUOTES = [
    { text: "SIATE PRONTI", author: "B.P." },
    { text: "IL VERO MODO DI ESSERE FELICI E QUELLO DI PROCURARE LA FELICITA AGLI ALTRI", author: "B.P." },
    { text: "LASCIATE IL MONDO UN PO MIGLIORE DI COME LO AVETE TROVATO", author: "B.P." },
    { text: "UN SORRISO E UNA CHIAVE SEGRETA CHE APRE MOLTI CUORI", author: "B.P." },
    { text: "LA VITA E TROPPO BREVE PER ANNOIARSI", author: "B.P." },
    { text: "GUARDA LONTANO E ANCHE QUANDO CREDI DI STAR GUARDANDO LONTANO GUARDA ANCORA PIU LONTANO", author: "B.P." },
    { text: "GUIDARE CON L ESEMPIO E PIU EFFICACE DI CENTO RAMANZINE", author: "B.P." },
    { text: "UNO SCOUT SORRIDE E FISCHIA IN TUTTE LE CIRCOSTANZE", author: "B.P." },
    { text: "SE NON AVETE INTENZIONE DI FARE QUALCOSA ALLORA NON FATELA MA SE AVETE INTENZIONE DI FARE QUALCOSA FATELA BENE", author: "B.P." }
];

// Funzione base per trasformare una stringa letterale alfanumerica
export const cleanTextForMorse = (text: string): string => {
    return text.toUpperCase().replace(/[^A-Z0-9 ]/g, '');
};
