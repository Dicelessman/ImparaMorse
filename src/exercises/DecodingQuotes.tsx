import React, { useState } from 'react';
import { SCOUT_QUOTES, cleanTextForMorse } from '../core/scoutQuotes';
import { charToMorse } from '../core/morseDictionary';
import { audioService } from '../core/audioService';
import { Play, CheckCircle2 } from 'lucide-react';

interface Props {
    onComplete: (xpGained: number) => void;
}

export const DecodingQuotesLevel: React.FC<Props> = ({ onComplete }) => {
    // Seleziona una frase a caso
    const [quote] = useState(() => SCOUT_QUOTES[Math.floor(Math.random() * SCOUT_QUOTES.length)]);

    // Lo trasformiamo in array di parole, e ogni parola in lettere morse
    const cleanedText = cleanTextForMorse(quote.text);
    const words = cleanedText.split(' ');

    // Stato di gioco
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [completed, setCompleted] = useState(false);
    const [xpGained, setXpGained] = useState(0);

    const currentWord = words[currentWordIndex];
    const currentLetter = currentWord ? currentWord[currentLetterIndex] : '';
    const currentMorse = currentLetter ? charToMorse(currentLetter) : '';

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toUpperCase();
        setUserInput(val);

        if (val === currentLetter) {
            // Corretto! Avanza alla prossima lettera
            setXpGained(prev => prev + 5);
            setUserInput('');

            if (currentLetterIndex < currentWord.length - 1) {
                setCurrentLetterIndex(prev => prev + 1);
            } else {
                // Parola finita
                if (currentWordIndex < words.length - 1) {
                    setCurrentWordIndex(prev => prev + 1);
                    setCurrentLetterIndex(0);
                } else {
                    // Frase finita
                    setCompleted(true);
                    setTimeout(() => onComplete(xpGained + 5 + 100), 3000); // 100 XP Bonus completamento
                }
            }
        }
    };

    const playFullQuote = () => {
        audioService.playText(cleanedText);
    };

    const playCurrentWord = () => {
        audioService.playText(currentWord);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-start p-6 w-full max-w-lg mx-auto overflow-y-auto">
            <div className="w-full flex justify-between text-gray-400 font-bold mb-4">
                <span>XP Guadagnati: {xpGained}</span>
                <span>Decodifica Frase</span>
            </div>

            <div className="glass-panel w-full p-6 mb-8 text-center flex flex-col items-center gap-4">
                <button
                    className="btn btn-secondary flex items-center justify-center gap-2 border-blue-500/30 text-blue-400 mb-2"
                    onClick={playFullQuote}
                >
                    <Play size={20} /> Ascolta intera frase
                </button>
                <p className="text-sm text-gray-400">Autore: {quote.author}</p>
            </div>

            {/* Display della frase parzialmente decodificata */}
            <div className="w-full flex justify-center flex-wrap gap-x-6 gap-y-8 mb-12">
                {words.map((word, wIdx) => {
                    const isPastWord = wIdx < currentWordIndex;
                    const isCurrentWord = wIdx === currentWordIndex;

                    return (
                        <div key={wIdx} className={`flex gap-1 ${isCurrentWord ? 'ring-2 ring-blue-500/50 p-2 rounded-xl bg-slate-800/50' : ''}`}>
                            {word.split('').map((char, cIdx) => {
                                const isPastChar = isPastWord || (isCurrentWord && cIdx < currentLetterIndex);
                                const isCurrentChar = isCurrentWord && cIdx === currentLetterIndex;
                                const morse = charToMorse(char);

                                return (
                                    <div key={cIdx} className="flex flex-col items-center min-w-[32px]">
                                        {/* Il carattere in Morse */}
                                        <div className={`text-xs font-bold tracking-widest mb-1 ${isCurrentChar ? 'text-blue-400 animate-pulse' : 'text-gray-500'}`}>
                                            {morse}
                                        </div>
                                        {/* La lettera decifrata o vuoto */}
                                        <div className={`w-8 h-10 border-b-2 flex items-center justify-center text-xl font-bold transition-all
                                            ${isPastChar ? 'border-green-500/50 text-white bg-green-500/10' :
                                                isCurrentChar ? 'border-blue-500 text-transparent bg-slate-800 shadow-[0_4px_10px_rgba(59,130,246,0.3)]' :
                                                    'border-slate-700 text-transparent'}
                                        `}>
                                            {isPastChar ? char : ''}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Area Input per la lettera corrente */}
            {!completed ? (
                <div className="glass-panel w-full p-6 flex flex-col items-center gap-4 sticky bottom-6 shadow-2xl bg-slate-900/95 border-blue-500/30">
                    <p className="text-gray-300">Che lettera è <span className="text-blue-400 font-bold tracking-widest text-xl">{currentMorse}</span> ?</p>

                    <div className="flex gap-4 items-center">
                        <button
                            className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 transition"
                            onClick={playCurrentWord}
                            title="Ascolta parola intera"
                        >
                            <Play className="text-blue-400" size={20} />
                        </button>

                        <input
                            type="text"
                            maxLength={1}
                            value={userInput}
                            onChange={handleInput}
                            className="w-16 h-16 text-center text-3xl font-black bg-slate-950 border border-slate-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white uppercase"
                            placeholder="?"
                            autoFocus
                        />
                    </div>
                </div>
            ) : (
                <div className="glass-panel w-full p-8 text-center bg-green-900/20 border-green-500/30 animate-pop-in">
                    <CheckCircle2 size={64} className="mx-auto text-green-400 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Frase completata!</h2>
                    <p className="text-green-300 italic">"{quote.text}"</p>
                </div>
            )}
        </div>
    );
};
