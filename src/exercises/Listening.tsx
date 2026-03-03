import React, { useState, useEffect } from 'react';
import { MORSE_DICT } from '../core/morseDictionary';
import { audioService } from '../core/audioService';
import { Volume2, Check, X } from 'lucide-react';

interface Props {
    onComplete: (xpGained: number) => void;
}

export const ListeningLevel: React.FC<Props> = ({ onComplete }) => {
    // 10 sfide
    const [challenges] = useState(() => {
        const lettersOnly = MORSE_DICT.filter(i => /[A-Z]/.test(i.char));
        return lettersOnly.sort(() => Math.random() - 0.5).slice(0, 10);
    });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [status, setStatus] = useState<'playing' | 'waiting' | 'correct' | 'wrong'>('waiting');
    const [xpGained, setXpGained] = useState(0);

    const currentLetter = challenges[currentIndex];

    const playCurrentPattern = async () => {
        setStatus('playing');
        await audioService.playSequence(currentLetter.pattern);
        setStatus('waiting');
    };

    // Auto-play initially
    useEffect(() => {
        playCurrentPattern();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!userInput.trim()) return;

        const isCorrect = userInput.toUpperCase() === currentLetter.char;

        setStatus(isCorrect ? 'correct' : 'wrong');

        if (isCorrect) {
            setXpGained(prev => prev + 15);
            audioService.playSequence('...'); // Suono di successo (S in morse, o potremmo fare di meglio, ma va bene)
        } else {
            setXpGained(prev => prev + 2); // Tentativo
        }

        setTimeout(() => {
            if (currentIndex < challenges.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setUserInput('');
                setStatus('waiting');
            } else {
                onComplete(xpGained + (isCorrect ? 15 : 2) + 30); // Bonus
            }
        }, 1500);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto">
            <div className="w-full flex justify-between text-gray-400 font-bold mb-8">
                <span>XP Guadagnati: {xpGained}</span>
                <span>{currentIndex + 1} / {challenges.length}</span>
            </div>

            <div className="glass-panel w-full p-8 flex flex-col items-center gap-8 relative overflow-hidden transition-colors duration-300">
                {/* Stato di risposta (Background colorato) */}
                <div className={`absolute inset-0 z-0 transition-opacity duration-300 ${status === 'correct' ? 'bg-green-500/20 opacity-100' : status === 'wrong' ? 'bg-red-500/20 opacity-100' : 'opacity-0'}`} />

                <div className="relative z-10 w-32 h-32 rounded-full border-4 border-slate-700 flex items-center justify-center mb-4">
                    {/* Ripple effect quando suona */}
                    {status === 'playing' && (
                        <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-[pulseBorder_2s_infinite]"></div>
                    )}

                    <button
                        className={`w-full h-full rounded-full flex items-center justify-center transition-all ${status === 'playing' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 hover:bg-slate-700 text-gray-400'}`}
                        onClick={playCurrentPattern}
                        disabled={status === 'playing' || status === 'correct'}
                    >
                        <Volume2 size={48} className={status === 'playing' ? 'animate-pulse' : ''} />
                    </button>

                    {/* Status Icons */}
                    {status === 'correct' && <Check className="absolute -bottom-2 -right-2 text-green-500 bg-slate-900 rounded-full p-1" size={40} />}
                    {status === 'wrong' && <X className="absolute -bottom-2 -right-2 text-red-500 bg-slate-900 rounded-full p-1" size={40} />}
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 w-full flex flex-col items-center gap-4">
                    <input
                        type="text"
                        maxLength={1}
                        value={userInput}
                        onChange={e => setUserInput(e.target.value.toUpperCase())}
                        disabled={status !== 'waiting'}
                        className="w-24 h-24 text-center text-5xl font-black bg-slate-900 border-2 border-slate-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-white disabled:opacity-50 transition-all uppercase"
                        placeholder="?"
                        autoFocus
                        autoComplete="off"
                    />

                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-4"
                        disabled={!userInput || status !== 'waiting'}
                    >
                        Conferma
                    </button>
                </form>

                {status === 'wrong' && (
                    <div className="relative z-10 text-red-300 font-bold animate-pop-in">
                        Era la lettera {currentLetter.char} ({currentLetter.pattern})
                    </div>
                )}
            </div>
        </div>
    );
};
