export interface UserProgress {
    xp: number;
    level: number;
    streak: number;
    lastPlayed: string; // ISO date string
    unlockedLevels: number[];
}

const DEFAULT_PROGRESS: UserProgress = {
    xp: 0,
    level: 1,
    streak: 0,
    lastPlayed: '',
    unlockedLevels: [1], // Livello 1 sbloccato di default
};

const STORAGE_KEY = 'imparamorse_progress';

export const getProgress = (): UserProgress => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_PROGRESS;

    try {
        const progress = JSON.parse(data) as UserProgress;
        // Controlla e aggiorna lo streak
        return updateStreak(progress);
    } catch (e) {
        console.error('Failed to parse progress', e);
        return DEFAULT_PROGRESS;
    }
};

export const saveProgress = (progress: UserProgress): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const addXp = (amount: number): UserProgress => {
    const current = getProgress();
    current.xp += amount;

    // Semplice logica di level up: ogni 100 XP un livello (puoi renderla esponenziale)
    const newLevel = Math.floor(current.xp / 100) + 1;
    if (newLevel > current.level) {
        current.level = newLevel;
        // Eventuale sblocco nuovi esercizi in base al livello utente
    }

    saveProgress(current);
    return current;
};

export const unlockLevel = (levelId: number): UserProgress => {
    const current = getProgress();
    if (!current.unlockedLevels.includes(levelId)) {
        current.unlockedLevels.push(levelId);
        saveProgress(current);
    }
    return current;
};

const updateStreak = (progress: UserProgress): UserProgress => {
    const today = new Date().toISOString().split('T')[0];

    if (!progress.lastPlayed) {
        progress.lastPlayed = today;
        progress.streak = 1;
        return progress;
    }

    const last = new Date(progress.lastPlayed);
    const current = new Date(today);

    const diffTime = Math.abs(current.getTime() - last.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        // Giocato ieri, incrementa
        progress.streak += 1;
        progress.lastPlayed = today;
    } else if (diffDays > 1) {
        // Streak perso
        progress.streak = 1;
        progress.lastPlayed = today;
    }
    // Se diffDays === 0, ha già giocato oggi, non fare nulla.

    return progress;
};
