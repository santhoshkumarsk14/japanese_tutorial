import { useState, useEffect } from 'react';
import { UserProgress } from '@/types/learning';

const defaultProgress: UserProgress = {
  hiraganaComplete: 46,
  katakanaComplete: 42,
  vocabularyLearned: 186,
  kanjiLearned: 28,
  grammarLearned: 8,
  readingComplete: 0,
  streak: 7,
  level: 12,
  xp: 680,
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('jlearner-progress');
    return saved ? JSON.parse(saved) : defaultProgress;
  });

  useEffect(() => {
    localStorage.setItem('jlearner-progress', JSON.stringify(progress));
  }, [progress]);

  const updateProgress = (category: keyof UserProgress, value: number) => {
    setProgress(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  const addXP = (amount: number) => {
    setProgress(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      };
    });
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastStudyDate = progress.lastStudyDate;
    
    if (lastStudyDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastStudyDate === yesterday.toDateString()) {
        // Consecutive day
        setProgress(prev => ({
          ...prev,
          streak: prev.streak + 1,
          lastStudyDate: today,
        }));
      } else {
        // Streak broken
        setProgress(prev => ({
          ...prev,
          streak: 1,
          lastStudyDate: today,
        }));
      }
    }
  };

  return {
    progress,
    updateProgress,
    addXP,
    updateStreak,
  };
}
