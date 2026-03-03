import React from 'react';
import type { UserProgress } from '../core/progressManager';

// Dati sui livelli disponibili
export const LEVELS = [
    { id: 1, title: 'Livello 1: Flashcards', description: 'Impara visivamente il codice.' },
    { id: 2, title: 'Livello 2: Metodo Sillabe', description: 'Associa il suono alle parole.' },
    { id: 3, title: 'Livello 3: In Ascolto', description: 'Riconosci le lettere dal suono.' },
    { id: 4, title: 'Livello 4: Trasmissione', description: 'Usa il tasto per inviare il codice.' },
    { id: 5, title: 'Livello 5: Quote Scout', description: 'Decodifica frasi intere.' }
];

interface Props {
    progress: UserProgress;
    onSelectLevel: (levelId: number) => void;
}

export const Dashboard: React.FC<Props> = ({ progress, onSelectLevel }) => {
    return (
        <div className="flex-1 flex flex-col p-6 mt-10 pb-24 w-full max-w-2xl mx-auto">
            <header className="mb-12 text-center animate-popIn">
                <h1 className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    ImparaMorse
                </h1>
                <p className="text-lg font-medium text-blue-200/80 uppercase tracking-widest mt-4">
                    Diventa fluente, un tap alla volta.
                </p>
            </header>

            <main className="flex-1 overflow-y-visible space-y-6 relative">
                {LEVELS.map((level, index) => {
                    const isUnlocked = progress.unlockedLevels.includes(level.id);
                    const isNext = !isUnlocked && (index === 0 || progress.unlockedLevels.includes(LEVELS[index - 1].id));

                    return (
                        <div
                            key={level.id}
                            style={{ animationDelay: `${index * 100}ms` }}
                            onClick={() => {
                                if (isUnlocked) onSelectLevel(level.id);
                            }}
                            className={`
                              relative p-6 rounded-3xl border transition-all duration-300 animate-slideUp
                              ${isUnlocked
                                    ? 'bg-slate-800/80 border-blue-500/40 shadow-[0_10px_30px_rgba(59,130,246,0.15)] cursor-pointer hover:border-blue-400 hover:shadow-[0_10px_40px_rgba(59,130,246,0.3)] hover:-translate-y-2'
                                    : isNext
                                        ? 'bg-slate-800/50 border-gray-600/50 opacity-80'
                                        : 'bg-slate-900/50 border-gray-800/50 opacity-50 grayscale hover:grayscale-0 transition-grayscale'
                                }
                          `}
                        >
                            {/* Elemento linea per connettere la roadmap visivamente */}
                            {index !== LEVELS.length - 1 && (
                                <div className={`absolute top-full left-10 w-1 h-6 -ml-px z-[-1] transition-colors duration-500 ${isUnlocked && progress.unlockedLevels.includes(LEVELS[index + 1].id) ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-gray-800'}`}></div>
                            )}

                            <div className="flex items-center gap-6">
                                <div className={`
                                  w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 transition-colors
                                  ${isUnlocked ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)]' : 'bg-gray-800 text-gray-500'}
                                `}>
                                    {level.id}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-bold text-xl mb-1 ${isUnlocked ? 'text-white drop-shadow-md' : 'text-gray-400'}`}>
                                        {level.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 font-medium leading-relaxed">{level.description}</p>
                                </div>

                                {!isUnlocked && isNext && (
                                    <div className="text-xs font-bold bg-slate-700 border border-slate-600 px-3 py-1 rounded-full text-blue-300 flex items-center shadow-inner">
                                        🔒 In arrivo
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </main>
        </div>
    );
};
