import React, { useState, useEffect } from 'react';
import { MORSE_DICT } from '../core/morseDictionary';
import { audioService } from '../core/audioService';
import { Volume2, Type, ArrowLeftRight, Shuffle } from 'lucide-react';

interface Props {
    onComplete: (xpGained: number) => void;
    onAddXp: (amount: number) => void;
}

type FlashcardMode = 'LETTER_TO_MORSE' | 'MORSE_TO_LETTER' | 'MIXED';

export const FlashcardsLevel: React.FC<Props> = ({ onComplete, onAddXp }) => {
    const [mode, setMode] = useState<FlashcardMode | null>(null);
    const [deck] = useState(() => {
        const lettersOnly = MORSE_DICT.filter(i => /[A-Z]/.test(i.char));
        return lettersOnly.sort(() => Math.random() - 0.5).slice(0, 10);
    });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [xpGained, setXpGained] = useState(0);
    const [cardAssignments, setCardAssignments] = useState<'LETTER' | 'MORSE'[]>([]);

    useEffect(() => {
        if (mode) {
            const assignments = deck.map(() => {
                if (mode === 'LETTER_TO_MORSE') return 'LETTER';
                if (mode === 'MORSE_TO_LETTER') return 'MORSE';
                return Math.random() > 0.5 ? 'LETTER' : 'MORSE'; // MIXED
            });
            setCardAssignments(assignments as any);
        }
    }, [mode, deck]);

    const currentCard = deck[currentIndex];
    const currentFrontType = cardAssignments[currentIndex];

    useEffect(() => {
        if (isFlipped && currentCard) {
            audioService.playSequence(currentCard.pattern);
        }
    }, [isFlipped, currentCard]);

    const handleNext = (knewIt: boolean) => {
        const addAmount = knewIt ? 1 : 0;

        if (addAmount > 0) {
            setXpGained(prev => prev + addAmount);
            onAddXp(addAmount);
        }

        if (currentIndex < deck.length - 1) {
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, 500);
        } else {
            onComplete(5); // bonus
        }
    };

    if (!mode) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto animate-slideUp">
                <h2 className="text-3xl font-black mb-2 text-center text-transparent bg-clip-text bg-gradient-to-br from-blue-300 to-purple-400">
                    Scegli la Modalità
                </h2>
                <p className="text-gray-400 mb-8 text-center">Come vuoi allenarti con le Flashcards?</p>

                <div className="w-full flex justify-center gap-4 flex-col">
                    <button
                        className="glass-panel p-6 w-full flex items-center justify-start gap-6 hover:bg-slate-800 transition-all border border-blue-500/20 hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:-translate-y-1 group"
                        onClick={() => setMode('LETTER_TO_MORSE')}
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Type className="text-white" />
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="text-lg font-bold text-white">Lettera ➝ Morse</h3>
                            <p className="text-sm text-gray-400">Vedi la lettera, indovina il pattern.</p>
                        </div>
                    </button>

                    <button
                        className="glass-panel p-6 w-full flex items-center justify-start gap-6 hover:bg-slate-800 transition-all border border-green-500/20 hover:border-green-400/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:-translate-y-1 group"
                        onClick={() => setMode('MORSE_TO_LETTER')}
                    >
                        <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <ArrowLeftRight className="text-white" />
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="text-lg font-bold text-white">Morse ➝ Lettera</h3>
                            <p className="text-sm text-gray-400">Vedi il pattern, indovina la lettera.</p>
                        </div>
                    </button>

                    <button
                        className="glass-panel p-6 w-full flex items-center justify-start gap-6 hover:bg-slate-800 transition-all border border-purple-500/20 hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:-translate-y-1 group"
                        onClick={() => setMode('MIXED')}
                    >
                        <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Shuffle className="text-white" />
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="text-lg font-bold text-white">Misto</h3>
                            <p className="text-sm text-gray-400">Sfida te stesso con schede casuali.</p>
                        </div>
                    </button>
                </div>
            </div>
        );
    }

    if (!currentCard || !currentFrontType) return null;

    const renderLetterFace = () => (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden', cursor: 'pointer', borderRadius: '20px' }} onClick={() => setIsFlipped(true)}>
            <span style={{ fontSize: '120px', fontWeight: 900 }}>{currentCard.char}</span>
            <p style={{ color: '#94a3b8', marginTop: '1rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Tocca per girare</p>
        </div>
    );

    const renderMorseFace = (isBack: boolean) => (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden', transform: isBack ? 'rotateY(180deg)' : 'none', borderRadius: '20px', cursor: isBack ? 'default' : 'pointer' }} onClick={() => !isBack && setIsFlipped(true)}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                {currentCard.pattern.split('').map((symbol, i) => (
                    <span key={i} style={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        boxShadow: '0 0 15px rgba(59,130,246,0.5)',
                        backgroundColor: '#3b82f6', borderRadius: '9999px',
                        height: symbol === '-' ? '1rem' : '1.5rem',
                        width: symbol === '-' ? '4rem' : '1.5rem'
                    }}></span>
                ))}
            </div>
            <span style={{ fontSize: '3rem', fontWeight: 'bold', letterSpacing: '0.5em', color: '#93c5fd', marginLeft: '1rem', marginBottom: '2rem' }}>{currentCard.pattern}</span>

            {isBack && (
                <button
                    className="btn"
                    style={{ padding: '1rem', borderRadius: '9999px', outline: 'none', border: '1px solid #334155' }}
                    onClick={(e) => { e.stopPropagation(); audioService.playSequence(currentCard.pattern); }}
                >
                    <Volume2 color="#60a5fa" size={32} />
                </button>
            )}
            {!isBack && (
                <p style={{ color: '#94a3b8', marginTop: '1rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Tocca per scoprire la Lettera</p>
            )}
        </div>
    );

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', width: '100%', maxWidth: '28rem', margin: '0 auto', position: 'relative', perspective: '1000px' }}>
            <div style={{ width: '100%', display: 'flex', justifySelf: 'start', color: '#94a3b8', fontWeight: 'bold', marginBottom: '2rem' }}>
                <div style={{ flex: 1 }}>
                    <span className="text-xs uppercase" style={{ display: 'block', opacity: 0.5 }}>Modalità</span>
                    <span className="text-sm text-blue-300">{mode.replace(/_/g, ' ')}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block' }}>XP: {xpGained}</span>
                    <span style={{ opacity: 0.7 }}>{currentIndex + 1} / {deck.length}</span>
                </div>
            </div>

            {/* Flip Container */}
            <div className={`glass-panel perspective-1000 ${isFlipped ? 'rotate-y-180' : ''}`} style={{ width: '100%', aspectRatio: '4/3', position: 'relative', transformStyle: 'preserve-3d', transition: 'transform 0.5s', marginBottom: '2rem', padding: 0, display: 'flex' }}>

                {/* LATO A */}
                {currentFrontType === 'LETTER' ? renderLetterFace() : renderMorseFace(false)}

                {/* LATO B */}
                <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    {currentFrontType === 'LETTER' ? renderMorseFace(true) : (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '20px' }}>
                            <span style={{ fontSize: '120px', fontWeight: 900 }}>{currentCard.char}</span>
                            <button
                                className="btn mt-8"
                                style={{ padding: '1rem', borderRadius: '9999px', outline: 'none', border: '1px solid #334155' }}
                                onClick={(e) => { e.stopPropagation(); audioService.playSequence(currentCard.pattern); }}
                            >
                                <Volume2 color="#60a5fa" size={32} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Pulsanti Azione */}
            <div style={{ width: '100%', display: 'flex', gap: '1rem', height: '4rem', transition: 'opacity 0.3s' }}>
                {!isFlipped ? (
                    <button
                        className="btn btn-primary"
                        style={{ flex: 1, fontSize: '1.25rem', fontWeight: 'bold', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
                        onClick={() => setIsFlipped(true)}
                    >
                        {currentFrontType === 'LETTER' ? 'Pensa al pattern...' : 'Pensa alla lettera...'}
                    </button>
                ) : (
                    <>
                        <button
                            className="btn"
                            style={{ flex: 1, color: '#f87171', border: '1px solid rgba(127,29,29,0.5)', fontSize: '1.125rem' }}
                            onClick={() => handleNext(false)}
                        >
                            Sbagliato
                        </button>
                        <button
                            className="btn btn-success"
                            style={{ flex: 1, fontSize: '1.125rem', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}
                            onClick={() => handleNext(true)}
                        >
                            Corretto (+1)
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
