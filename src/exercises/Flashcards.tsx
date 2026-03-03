import React, { useState, useEffect } from 'react';
import { MORSE_DICT } from '../core/morseDictionary';
import { audioService } from '../core/audioService';
import { Volume2 } from 'lucide-react';

interface Props {
    onComplete: (xpGained: number) => void;
}

export const FlashcardsLevel: React.FC<Props> = ({ onComplete }) => {
    // Mescola il dizionario (prendiamo solo lettere per il livello 1, o limitiamo alle prime per iniziare)
    const [deck] = useState(() => {
        const lettersOnly = MORSE_DICT.filter(i => /[A-Z]/.test(i.char));
        // Mischia
        return lettersOnly.sort(() => Math.random() - 0.5).slice(0, 10); // Sfida da 10 carte
    });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [xpGained, setXpGained] = useState(0);

    const currentCard = deck[currentIndex];

    useEffect(() => {
        if (showAnswer) {
            audioService.playSequence(currentCard.pattern);
        }
    }, [showAnswer, currentCard]);

    const handleNext = (knewIt: boolean) => {
        if (knewIt) setXpGained(prev => prev + 10);
        else setXpGained(prev => prev + 2); // XP minimi per partecipazione

        if (currentIndex < deck.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setShowAnswer(false);
        } else {
            // Livello completato
            onComplete(xpGained + (knewIt ? 10 : 2) + 20); // Bonus di completamento
        }
    };

    if (!currentCard) return null;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto">
            <div className="w-full flex justify-between text-gray-400 font-bold mb-8">
                <span>XP Guadagnati: {xpGained}</span>
                <span>{currentIndex + 1} / {deck.length}</span>
            </div>

            <div className="glass-panel w-full aspect-[4/3] flex flex-col items-center justify-center relative transition-all duration-500 mb-8">
                {/* Side A: La lettera */}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${showAnswer ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <span className="text-8xl font-black">{currentCard.char}</span>
                </div>

                {/* Side B: La risposta in Morse */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center gap-6 transition-opacity duration-300 ${!showAnswer ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="flex gap-3">
                        {currentCard.pattern.split('').map((symbol, i) => (
                            <span key={i} className={`w-6 flex justify-center items-center ${symbol === '-' ? 'h-2 w-12 rounded-full bg-blue-500' : 'h-6 w-6 rounded-full bg-blue-500'}`}></span>
                        ))}
                    </div>
                    <span className="text-4xl font-bold tracking-[0.5em] text-blue-300">{currentCard.pattern}</span>
                    <button
                        className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 transition"
                        onClick={() => audioService.playSequence(currentCard.pattern)}
                    >
                        <Volume2 className="text-blue-400" size={24} />
                    </button>
                </div>
            </div>

            <div className="w-full flex gap-4 h-16">
                {!showAnswer ? (
                    <button
                        className="btn btn-primary flex-1 text-lg font-bold"
                        onClick={() => setShowAnswer(true)}
                    >
                        Scopri
                    </button>
                ) : (
                    <>
                        <button
                            className="btn flex-1 text-red-400 border-red-900/50 hover:bg-red-900/20"
                            onClick={() => handleNext(false)}
                        >
                            Non lo sapevo
                        </button>
                        <button
                            className="btn btn-success flex-1"
                            onClick={() => handleNext(true)}
                        >
                            Lo sapevo!
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
