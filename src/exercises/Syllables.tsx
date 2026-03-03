import React, { useState } from 'react';
import { MORSE_DICT } from '../core/morseDictionary';
import { audioService } from '../core/audioService';
import { Play, ChevronDown, CheckCircle2 } from 'lucide-react';

interface Props {
    onComplete: (xpGained: number) => void;
}

export const SyllableMethodLevel: React.FC<Props> = ({ onComplete }) => {
    const [letters] = useState(() => MORSE_DICT.filter(l => l.syllables).slice(0, 5)); // Primi 5 per demo
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedWords, setSelectedWords] = useState<Record<string, string>>({});
    const [showDropdown, setShowDropdown] = useState(false);

    const currentLetter = letters[currentIndex];
    const currentWord = selectedWords[currentLetter.char] || currentLetter.syllables!.primary;

    const handleWordSelect = (word: string) => {
        setSelectedWords(prev => ({ ...prev, [currentLetter.char]: word }));
        setShowDropdown(false);
        // Suona per far capire il ritmo
        audioService.playSequence(currentLetter.pattern);
    };

    const handleNext = () => {
        if (currentIndex < letters.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete(50); // XP fisso per aver completato l'associazione
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-blue-400 mb-2">Metodo delle Sillabe</h2>
                <p className="text-gray-400 text-sm">Scegli la parola che ti aiuta a ricordare meglio il ritmo. Ogni vocale `O` vale una LINEA, le altre vocali valgono un PUNTO.</p>
            </div>

            <div className="glass-panel w-full p-8 flex flex-col items-center gap-6 relative z-10">

                {/* Lettera gigante */}
                <div className="text-8xl font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-purple-500">
                    {currentLetter.char}
                </div>

                {/* Pattern visivo */}
                <div className="flex gap-2 mb-4">
                    {currentLetter.pattern.split('').map((symbol, i) => (
                        <div key={i} className={`h-4 ${symbol === '-' ? 'w-12 bg-blue-500' : 'w-4 bg-orange-400'} rounded-full shadow-[0_0_10px_currentColor]`} />
                    ))}
                </div>

                {/* Selezione Parola */}
                <div className="relative w-full">
                    <button
                        className="w-full btn bg-slate-800 border-slate-700 flex justify-between items-center text-xl"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <span className="font-bold tracking-widest">{currentWord}</span>
                        <ChevronDown size={20} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl z-50">
                            {[currentLetter.syllables!.primary, ...currentLetter.syllables!.alternatives].map(word => (
                                <button
                                    key={word}
                                    className="w-full text-left p-4 hover:bg-slate-700 flex items-center justify-between transition-colors border-b border-slate-700/50 last:border-0"
                                    onClick={() => handleWordSelect(word)}
                                >
                                    <span className="font-bold tracking-wider">{word}</span>
                                    {currentWord === word && <CheckCircle2 className="text-green-400" size={20} />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    className="p-4 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all border border-blue-500/50 mt-4"
                    onClick={() => audioService.playSequence(currentLetter.pattern)}
                >
                    <Play size={24} fill="currentColor" />
                </button>
            </div>

            <div className="w-full mt-8">
                <button className="btn btn-primary w-full text-lg py-4" onClick={handleNext}>
                    {currentIndex < letters.length - 1 ? 'Prossima Lettera' : 'Completa Esercizio'}
                </button>
            </div>

        </div>
    );
};
