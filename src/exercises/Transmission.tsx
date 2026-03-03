import React, { useState, useRef, useEffect } from 'react';
import { MORSE_DICT } from '../core/morseDictionary';
import { InputParser } from '../core/inputParser';
import { audioService } from '../core/audioService';

interface Props {
    onComplete: (xpGained: number) => void;
}

export const TransmissionLevel: React.FC<Props> = ({ onComplete }) => {
    const [challenges] = useState(() => {
        const lettersOnly = MORSE_DICT.filter(i => /[A-Z]/.test(i.char));
        return lettersOnly.sort(() => Math.random() - 0.5).slice(0, 5); // 5 sfide
    });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [active, setActive] = useState(false);
    const [currentPattern, setCurrentPattern] = useState('');
    const [xpGained, setXpGained] = useState(0);

    const parserRef = useRef(new InputParser(20)); // 20 WPM
    const currentLetter = challenges[currentIndex];

    useEffect(() => {
        // Pulisce il parser quando cambia la lettera
        parserRef.current.clear();
        setCurrentPattern('');
    }, [currentIndex]);

    const handlePressStart = (e: React.SyntheticEvent) => {
        e.preventDefault(); // Previene comportamenti touch di default
        setActive(true);
        audioService.startTone();
        parserRef.current.handlePressDown();
    };

    const handlePressEnd = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setActive(false);
        audioService.stopTone();

        const newPattern = parserRef.current.handlePressUp();
        setCurrentPattern(newPattern);

        checkPattern(newPattern);
    };

    const checkPattern = (pattern: string) => {
        // Se il pattern eccede in lunghezza è sbagliato. Resettiamo.
        if (pattern.length > currentLetter.pattern.length) {
            setTimeout(() => {
                parserRef.current.clear();
                setCurrentPattern('');
                // Un piccolo feedback di errore
                audioService.playSequence('........'); // Suono di beep di errore veloce
            }, 500);
            return;
        }

        // Se coincide perfettamente
        if (pattern === currentLetter.pattern) {
            setXpGained(prev => prev + 20); // XP per trasmissione riuscita
            setTimeout(() => {
                if (currentIndex < challenges.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    onComplete(xpGained + 20 + 50); // Bonus
                }
            }, 1000);
        }
    };

    const resetCurrent = () => {
        parserRef.current.clear();
        setCurrentPattern('');
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto h-full">
            <div className="w-full flex justify-between text-gray-400 font-bold mb-4">
                <span>XP Guadagnati: {xpGained}</span>
                <span>{currentIndex + 1} / {challenges.length}</span>
            </div>

            <div className="text-center mb-8">
                <h2 className="text-4xl font-black mb-2 flex items-center justify-center gap-4">
                    Trasmetti: <span className="text-blue-400 text-6xl">{currentLetter.char}</span>
                </h2>
                <div className="flex gap-2 justify-center mb-4 mt-4 h-8">
                    {currentLetter.pattern.split('').map((symbol, i) => (
                        <div key={i} className={`h-6 ${symbol === '-' ? 'w-16 bg-slate-700' : 'w-6 bg-slate-700'} rounded-full opacity-50`} />
                    ))}
                </div>

                {/* Il tuo input attuale */}
                <div className="flex gap-2 justify-center h-8">
                    {currentPattern.split('').map((symbol, i) => (
                        <div key={i} className={`h-6 ${symbol === '-' ? 'w-16 bg-blue-500' : 'w-6 bg-orange-400'} rounded-full shadow-[0_0_10px_currentColor] animate-pop-in`} />
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full relative">
                {/* Ripples di fondo quando si preme */}
                <div className={`absolute w-64 h-64 bg-blue-500/10 rounded-full transition-all duration-300 ${active ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}`} />
                <div className={`absolute w-48 h-48 bg-blue-500/20 rounded-full transition-all duration-300 delay-75 ${active ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}`} />

                <button
                    className={`btn-morse-tap z-10 ${active ? 'active' : ''}`}
                    onMouseDown={handlePressStart}
                    onMouseUp={handlePressEnd}
                    onMouseLeave={active ? handlePressEnd : undefined} // Se esce dal bottone, ferma
                    onTouchStart={handlePressStart}
                    onTouchEnd={handlePressEnd}
                >
                    TAP
                </button>
            </div>

            <div className="w-full mt-8 flex justify-center h-16">
                {currentPattern.length > 0 && currentPattern !== currentLetter.pattern && (
                    <button className="btn border-red-500/50 text-red-400 hover:bg-red-500/20 px-8" onClick={resetCurrent}>
                        Riprova Lettera
                    </button>
                )}
            </div>
        </div>
    );
};
