import React, { useState } from 'react';
import type { UserProgress } from '../core/progressManager';
import { setUsername as saveUsername } from '../core/progressManager';
import { User, Edit2, Check } from 'lucide-react';

// Dati sui livelli disponibili
export const LEVELS = [
    { id: 1, title: 'Livello 1: Flashcards', description: 'Impara visivamente il codice.', colorClass: 'blue' },
    { id: 2, title: 'Livello 2: Metodo Sillabe', description: 'Associa il suono alle parole.', colorClass: 'green' },
    { id: 3, title: 'Livello 3: In Ascolto', description: 'Riconosci le lettere dal suono.', colorClass: 'yellow' },
    { id: 4, title: 'Livello 4: Trasmissione', description: 'Usa il tasto per inviare il codice.', colorClass: 'red' },
    { id: 5, title: 'Livello 5: Quote Scout', description: 'Decodifica frasi intere.', colorClass: 'purple' }
];

interface Props {
    progress: UserProgress;
    onSelectLevel: (levelId: number) => void;
}

// Helper per i colori dinamici della Tailwind (visto che stiamo usando classi arbitrarie)
const getColorMap = (color: string) => {
    switch (color) {
        case 'blue': return {
            bgGradient: 'from-blue-500 to-indigo-600',
            border: 'border-blue-500/40 hover:border-blue-400',
            shadow: 'shadow-[0_10px_30px_rgba(59,130,246,0.15)] hover:shadow-[0_10px_40px_rgba(59,130,246,0.3)]',
            iconShadow: 'shadow-[0_0_20px_rgba(59,130,246,0.6)]'
        };
        case 'green': return {
            bgGradient: 'from-emerald-400 to-green-600',
            border: 'border-green-500/40 hover:border-green-400',
            shadow: 'shadow-[0_10px_30px_rgba(16,185,129,0.15)] hover:shadow-[0_10px_40px_rgba(16,185,129,0.3)]',
            iconShadow: 'shadow-[0_0_20px_rgba(16,185,129,0.6)]'
        };
        case 'yellow': return {
            bgGradient: 'from-amber-400 to-orange-600',
            border: 'border-amber-500/40 hover:border-amber-400',
            shadow: 'shadow-[0_10px_30px_rgba(245,158,11,0.15)] hover:shadow-[0_10px_40px_rgba(245,158,11,0.3)]',
            iconShadow: 'shadow-[0_0_20px_rgba(245,158,11,0.6)]'
        };
        case 'red': return {
            bgGradient: 'from-rose-400 to-red-600',
            border: 'border-red-500/40 hover:border-red-400',
            shadow: 'shadow-[0_10px_30px_rgba(239,68,68,0.15)] hover:shadow-[0_10px_40px_rgba(239,68,68,0.3)]',
            iconShadow: 'shadow-[0_0_20px_rgba(239,68,68,0.6)]'
        };
        case 'purple': return {
            bgGradient: 'from-purple-500 to-fuchsia-600',
            border: 'border-purple-500/40 hover:border-purple-400',
            shadow: 'shadow-[0_10px_30px_rgba(168,85,247,0.15)] hover:shadow-[0_10px_40px_rgba(168,85,247,0.3)]',
            iconShadow: 'shadow-[0_0_20px_rgba(168,85,247,0.6)]'
        };
        default: return {
            bgGradient: 'from-gray-500 to-gray-600',
            border: 'border-gray-500/40 hover:border-gray-400',
            shadow: '',
            iconShadow: ''
        };
    }
};

export const Dashboard: React.FC<Props> = ({ progress, onSelectLevel }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(progress.username);

    const handleSaveName = () => {
        if (newName.trim()) {
            saveUsername(newName.trim());
            setIsEditing(false);
            window.location.reload();
        }
    };

    return (
        <div className="flex-1 flex flex-col p-6 mt-4 pb-24 w-full max-w-2xl mx-auto">
            {/* Profilo Utente */}
            <section className="glass-panel p-4 mb-10 flex items-center gap-4 border-blue-500/20 translate-y-[-10px] animate-popIn">
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-blue-400 shadow-inner">
                    <User size={24} />
                </div>
                <div className="flex-1">
                    {isEditing ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="bg-slate-900 border border-blue-500/50 rounded-lg px-3 py-1 text-white w-full outline-none focus:ring-2 ring-blue-500 shadow-lg"
                                autoFocus
                            />
                            <button onClick={handleSaveName} className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-lg">
                                <Check size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditing(true)}>
                            <h2 className="text-xl font-bold text-white drop-shadow-sm">{progress.username}</h2>
                            <Edit2 size={14} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                        </div>
                    )}
                    <div className="flex items-center gap-4 mt-1">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Level {progress.level}</span>
                        <div className="h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-700/50">
                            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${progress.xp % 100}%` }}></div>
                        </div>
                        <span className="text-xs text-blue-300 font-bold">{progress.xp} XP</span>
                    </div>
                </div>
            </section>
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
                    const colors = getColorMap(level.colorClass);

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
                                    ? `bg-slate-800/80 cursor-pointer hover:-translate-y-2 ${colors.border} ${colors.shadow}`
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
                                  ${isUnlocked ? `bg-gradient-to-br ${colors.bgGradient} text-white ${colors.iconShadow}` : 'bg-gray-800 text-gray-500'}
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
