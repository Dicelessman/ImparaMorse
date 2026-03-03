import React, { useState, useEffect } from 'react';
import { MORSE_DICT } from '../core/morseDictionary';
import { audioService } from '../core/audioService';
import { Volume2 } from 'lucide-react';

interface Props {
    onComplete: (xpGained: number) => void;
    onAddXp: (amount: number) => void;
}

export const FlashcardsLevel: React.FC<Props> = ({ onComplete, onAddXp }) => {
    // Mescola il dizionario
    const [deck] = useState(() => {
        const lettersOnly = MORSE_DICT.filter(i => /[A-Z]/.test(i.char));
        return lettersOnly.sort(() => Math.random() - 0.5).slice(0, 10); // 10 carte
    });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [xpGained, setXpGained] = useState(0);

    const currentCard = deck[currentIndex];

    // Auto-play the audio when flipped
    useEffect(() => {
        if (isFlipped) {
            audioService.playSequence(currentCard.pattern);
        }
    }, [isFlipped, currentCard]);

    const handleNext = (knewIt: boolean) => {
        // Logica punteggi pium chiara: 1 XP per ogni flashcard imparata
        const addAmount = knewIt ? 1 : 0;

        if (addAmount > 0) {
            setXpGained(prev => prev + addAmount);
            onAddXp(addAmount); // Salva istantaneamente i progressi nell'App genitore
        }

        if (currentIndex < deck.length - 1) {
            setIsFlipped(false);
            // Wait for flip animation to finish before changing card content
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, 500);
        } else {
            // Livello completato, aggiungiamo bonus di fine livello (+5 XP)
            onComplete(5);
        }
    };

    if (!currentCard) return null;

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', width: '100%', maxWidth: '28rem', margin: '0 auto', position: 'relative', perspective: '1000px' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontWeight: 'bold', marginBottom: '2rem' }}>
                <span>XP: {xpGained}</span>
                <span>{currentIndex + 1} / {deck.length}</span>
            </div>

            {/* Flip Container */}
            <div className={`glass-panel perspective-1000 ${isFlipped ? 'rotate-y-180' : ''}`} style={{ width: '100%', aspectRatio: '4/3', position: 'relative', transformStyle: 'preserve-3d', transition: 'transform 0.5s', marginBottom: '2rem', padding: 0, display: 'flex' }}>

                {/* LATO A: La Lettera */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden', cursor: 'pointer', borderRadius: '20px' }} onClick={() => setIsFlipped(true)}>
                    <span style={{ fontSize: '120px', fontWeight: 900 }}>{currentCard.char}</span>
                    <p style={{ color: '#94a3b8', marginTop: '1rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Tocca per scoprire il Morse</p>
                </div>

                {/* LATO B: Il Codice Morse */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: '20px' }}>
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

                    <button
                        className="btn"
                        style={{ padding: '1rem', borderRadius: '9999px', outline: 'none', border: '1px solid #334155' }}
                        onClick={(e) => { e.stopPropagation(); audioService.playSequence(currentCard.pattern); }}
                    >
                        <Volume2 color="#60a5fa" size={32} />
                    </button>
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
                        Pensa al pattern...
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
