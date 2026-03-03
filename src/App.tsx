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

  const handleLevelComplete = (xpGained: number) => {
    const oldLevel = progress.level;

    let newProgress = addXp(xpGained);

    if (newProgress.level > oldLevel) {
      setGameEvent({ type: 'levelUP', amount: xpGained, message: 'Hai sbloccato nuove sfide!' });
      // Sblocca il livello successivo in base al level up
      newProgress = unlockLevel(currentLevel! + 1);
    } else {
      setGameEvent({ type: 'xp', amount: xpGained, message: 'Ottimo lavoro!' });
    }

    setProgress(newProgress);
    setCurrentLevel(null);
  };

  const renderCurrentView = () => {
    if (currentLevel === null) {
      return <Dashboard progress={progress} onSelectLevel={setCurrentLevel} />;
    }

    let ExerciseComponent = null;

    switch (currentLevel) {
      case 1: ExerciseComponent = <FlashcardsLevel onComplete={handleLevelComplete} />; break;
      case 2: ExerciseComponent = <SyllableMethodLevel onComplete={handleLevelComplete} />; break;
      case 3: ExerciseComponent = <ListeningLevel onComplete={handleLevelComplete} />; break;
      case 4: ExerciseComponent = <TransmissionLevel onComplete={handleLevelComplete} />; break;
      case 5: ExerciseComponent = <DecodingQuotesLevel onComplete={handleLevelComplete} />; break;
      default: ExerciseComponent = <div className="p-8 text-center text-gray-400">Livello in costruzione</div>;
    }

    return (
      <div className="flex-1 flex flex-col items-center">
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
