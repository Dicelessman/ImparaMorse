import React, { useEffect, useState } from 'react';
import type { UserProgress } from '../core/progressManager';
import { getProgress } from '../core/progressManager';

// Interfaccia per animazioni "Pop-up" di sistema
export interface GamificationEvent {
    type: 'xp' | 'levelUP' | 'streak';
    amount: number;
    message: string;
}

interface Props {
    event: GamificationEvent | null;
    onClearEvent: () => void;
}

export const GamificationLayer: React.FC<Props> = ({ event, onClearEvent }) => {
    const [progress, setProgress] = useState<UserProgress>(getProgress());

    useEffect(() => {
        // Aggiorna la vista progressi ogni volta che arriva un nuovo evento
        setProgress(getProgress());

        if (event) {
            const timer = setTimeout(() => {
                onClearEvent();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [event, onClearEvent]);

    return (
        <>
            {/* Header fisso con progressi */}
            <div className="fixed top-0 left-0 right-0 p-4 z-40 pointer-events-none flex justify-between items-start max-w-[600px] mx-auto">
                <div className="glass-panel py-2 px-4 flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level {progress.level}</span>
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden mt-1">
                            <div
                                className="h-full bg-blue-500 transition-all duration-500"
                                style={{ width: `${(progress.xp % 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="glass-panel py-2 px-4 flex items-center gap-2 text-orange-400 font-bold">
                    <span>🔥</span>
                    <span>{progress.streak}</span>
                </div>
            </div>

            {/* Event Overlay Centrale */}
            {event && (
                <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
                    <div className="animate-pop-in glass-panel border-green-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] bg-gray-900/90 text-center">
                        <h2 className="text-2xl font-black text-white mb-2">
                            {event.type === 'levelUP' ? '🎉 LEVEL UP!' : '⭐ EXOTIC!'}
                        </h2>
                        <p className="text-xl text-green-400 font-bold mb-1">+{event.amount} {event.type.toUpperCase()}</p>
                        <p className="text-gray-300">{event.message}</p>
                    </div>
                </div>
            )}
        </>
    );
};
