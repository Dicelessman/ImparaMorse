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
        <div className="flex-1 flex flex-col p-6 mt-16 pb-24">
            <header className="mb-8 mt-4 text-center">
                <h1>ImparaMorse</h1>
                <p className="text-lg opacity-80 mt-2 text-blue-200">Diventa fluente, un tap alla volta.</p>
            </header>

            <main className="flex-1 overflow-y-auto space-y-6">
                {LEVELS.map((level, index) => {
                    const isUnlocked = progress.unlockedLevels.includes(level.id);
                    const isNext = !isUnlocked && (index === 0 || progress.unlockedLevels.includes(LEVELS[index - 1].id));

                    return (
                        <div
                            key={level.id}
                            onClick={() => {
                                if (isUnlocked) onSelectLevel(level.id);
                            }}
                            className={`
                              relative p-5 rounded-2xl border transition-all duration-300
                              ${isUnlocked
                                    ? 'bg-slate-800/80 border-blue-500/30 shadow-[0_4px_20px_rgba(59,130,246,0.15)] cursor-pointer hover:border-blue-400 hover:transform hover:-translate-y-1'
                                    : isNext
                                        ? 'bg-slate-800/50 border-gray-600/50 opacity-80'
                                        : 'bg-slate-900/50 border-gray-800/50 opacity-50 grayscale'
                                }
                          `}
                        >
                            {/* Elemento linea per connettere la roadmap visivamente */}
                            {index !== LEVELS.length - 1 && (
                                <div className={`absolute top-full left-8 w-1 h-6 -ml-px ${isUnlocked && progress.unlockedLevels.includes(LEVELS[index + 1].id) ? 'bg-blue-500/50' : 'bg-gray-800'}`}></div>
                            )}

                            <div className="flex items-center gap-4">
                                <div className={`
                                  w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0
                                  ${isUnlocked ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-gray-800 text-gray-500'}
                              `}>
                                    {level.id}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-bold text-lg ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                                        {level.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-1">{level.description}</p>
                                </div>

                                {!isUnlocked && isNext && (
                                    <div className="text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-300 flex items-center gap-1">
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
