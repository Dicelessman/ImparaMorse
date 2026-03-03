import { useState } from 'react';
import type { UserProgress } from './core/progressManager';
import { getProgress, addXp, unlockLevel } from './core/progressManager';
import { Dashboard } from './components/Dashboard';
import { GamificationLayer } from './components/GamificationLayer';
import type { GamificationEvent } from './components/GamificationLayer';
import { ArrowLeft } from 'lucide-react';

// Esercizi
import { FlashcardsLevel } from './exercises/Flashcards';
import { SyllableMethodLevel } from './exercises/Syllables';
import { ListeningLevel } from './exercises/Listening';
import { TransmissionLevel } from './exercises/Transmission';
import { DecodingQuotesLevel } from './exercises/DecodingQuotes';

function App() {
  const [progress, setProgress] = useState<UserProgress>(getProgress());
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [gameEvent, setGameEvent] = useState<GamificationEvent | null>(null);

  const handleAddXp = (amount: number) => {
    if (amount <= 0) return;
    const oldLevel = progress.level;
    const newProgress = addXp(amount);

    if (newProgress.level > oldLevel) {
      setGameEvent({ type: 'levelUP', amount, message: 'Hai sbloccato nuove sfide!' });
      unlockLevel(currentLevel! + 1);
    } else {
      if (amount >= 10) {
        setGameEvent({ type: 'xp', amount, message: '+XP' });
      }
    }
    setProgress(getProgress());
  };

  const handleLevelComplete = (bonusXp: number = 0) => {
    if (bonusXp > 0) handleAddXp(bonusXp);

    // Sempre sblocca il livello successivo quando un esercizio viene completato
    if (currentLevel !== null) {
      unlockLevel(currentLevel + 1);
      setProgress(getProgress()); // Ricarica i progressi per riflettere lo sblocco
    }

    setCurrentLevel(null);
  };

  const renderCurrentView = () => {
    if (currentLevel === null) {
      return <Dashboard progress={progress} onSelectLevel={setCurrentLevel} />;
    }

    let ExerciseComponent = null;
    const props = { onComplete: handleLevelComplete, onAddXp: handleAddXp };

    switch (currentLevel) {
      case 1: ExerciseComponent = <FlashcardsLevel {...props} />; break;
      case 2: ExerciseComponent = <SyllableMethodLevel {...props} />; break;
      case 3: ExerciseComponent = <ListeningLevel {...props} />; break;
      case 4: ExerciseComponent = <TransmissionLevel {...props} />; break;
      case 5: ExerciseComponent = <DecodingQuotesLevel {...props} />; break;
      default: ExerciseComponent = <div className="p-8 text-center text-gray-400">Livello in costruzione</div>;
    }

    return (
      <div className="flex-1 flex flex-col items-center overflow-x-hidden">
        <header className="p-4 flex items-center gap-4 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-800 w-full max-w-md">
          <button
            className="p-2 -ml-2 rounded-full hover:bg-slate-800 transition-colors"
            onClick={() => setCurrentLevel(null)}
          >
            <ArrowLeft className="text-gray-400" />
          </button>
          <h2 className="text-lg font-bold flex-1 text-center pr-10">Livello {currentLevel}</h2>
        </header>

        {ExerciseComponent}
      </div>
    );
  };

  return (
    <>
      <GamificationLayer event={gameEvent} onClearEvent={() => setGameEvent(null)} />
      {renderCurrentView()}
    </>
  );
}

export default App;
