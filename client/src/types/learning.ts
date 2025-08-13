export interface HiraganaCharacter {
  id: string;
  character: string;
  romaji: string;
  category: 'basic' | 'dakuten' | 'handakuten' | 'combo';
  learned?: boolean;
}

export interface KatakanaCharacter {
  id: string;
  character: string;
  romaji: string;
  category: 'basic' | 'dakuten' | 'handakuten' | 'combo';
  learned?: boolean;
}

export interface VocabularyItem {
  id: string;
  level: 'N5' | 'N4';
  japanese: string;
  reading: string;
  meaning: string;
  example: string;
  learned?: boolean;
}

export interface KanjiItem {
  id: string;
  level: 'N5' | 'N4';
  character: string;
  onyomi: string;
  kunyomi: string;
  meaning: string;
  examples: string[];
  learned?: boolean;
}

export interface GrammarItem {
  id: string;
  level: 'N5' | 'N4';
  structure: string;
  meaning: string;
  explanation: string;
  examples: Array<{
    japanese: string;
    english: string;
  }>;
  learned?: boolean;
}

export interface ReadingPassage {
  id: string;
  level: 'N5' | 'N4';
  title: string;
  content: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
  completed?: boolean;
}

export interface UserProgress {
  hiraganaComplete: number;
  katakanaComplete: number;
  vocabularyLearned: number;
  kanjiLearned: number;
  grammarLearned: number;
  readingComplete: number;
  streak: number;
  level: number;
  xp: number;
  lastStudyDate?: string;
}

export type LearningModule = 'hiragana' | 'katakana' | 'vocabulary' | 'kanji' | 'grammar' | 'reading' | 'practice';
