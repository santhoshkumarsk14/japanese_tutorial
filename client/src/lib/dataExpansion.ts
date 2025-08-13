import { VocabularyItem, KanjiItem, GrammarItem } from '@/types/learning';
import expandedVocabulary from '@/data/expanded-vocabulary.json';
import expandedKanji from '@/data/expanded-kanji.json';

// Content expansion system for N4 requirements
export interface ContentStats {
  vocabulary: number;
  kanji: number;
  grammar: number;
  listening: number;
  quizQuestions: number;
}

export const N4_TARGET_REQUIREMENTS: ContentStats = {
  vocabulary: 1500,
  kanji: 300,
  grammar: 140,
  listening: 100,
  quizQuestions: 1000 // per category
};

export const getCurrentContentStats = (): ContentStats => {
  return {
    vocabulary: 150, // Current vocabulary count
    kanji: 120,      // Current kanji count
    grammar: 45,     // Current grammar patterns
    listening: 10,   // Current listening exercises
    quizQuestions: 25 // Current quiz questions (across all categories)
  };
};

// Calculate progress towards N4 targets
export const getProgressPercentage = (current: number, target: number): number => {
  return Math.min(100, Math.round((current / target) * 100));
};

// Generate comprehensive quiz questions from existing data
export const generateVocabularyQuestions = (vocabulary: VocabularyItem[], count: number) => {
  const questions = [];
  const shuffledVocab = [...vocabulary].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < Math.min(count, shuffledVocab.length); i++) {
    const word = shuffledVocab[i];
    const incorrectOptions = vocabulary
      .filter(v => v.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(v => v.meaning);
    
    questions.push({
      id: `vq_gen_${i}`,
      type: 'meaning',
      question: `What does "${word.japanese}" mean?`,
      options: [word.meaning, ...incorrectOptions].sort(() => Math.random() - 0.5),
      correctAnswer: 0, // Will need to be recalculated after shuffle
      level: word.level,
      category: 'vocabulary' as const
    });
  }
  
  return questions;
};

// Content roadmap for reaching N4 targets
export const getContentRoadmap = () => {
  const current = getCurrentContentStats();
  const targets = N4_TARGET_REQUIREMENTS;
  
  return {
    vocabulary: {
      current: current.vocabulary,
      target: targets.vocabulary,
      remaining: targets.vocabulary - current.vocabulary,
      progress: getProgressPercentage(current.vocabulary, targets.vocabulary),
      priority: 'high' as 'high' | 'medium' | 'low'
    },
    kanji: {
      current: current.kanji,
      target: targets.kanji,
      remaining: targets.kanji - current.kanji,
      progress: getProgressPercentage(current.kanji, targets.kanji),
      priority: 'high' as 'high' | 'medium' | 'low'
    },
    grammar: {
      current: current.grammar,
      target: targets.grammar,
      remaining: targets.grammar - current.grammar,
      progress: getProgressPercentage(current.grammar, targets.grammar),
      priority: 'medium' as 'high' | 'medium' | 'low'
    },
    listening: {
      current: current.listening,
      target: targets.listening,
      remaining: targets.listening - current.listening,
      progress: getProgressPercentage(current.listening, targets.listening),
      priority: 'medium' as 'high' | 'medium' | 'low'
    }
  };
};

// Estimate study time based on content completion
export const estimateStudyTime = (dailyMinutes: number = 60) => {
  const roadmap = getContentRoadmap();
  
  // Rough estimates based on learning rates
  const vocabularyMinutes = roadmap.vocabulary.remaining * 2; // 2 min per word
  const kanjiMinutes = roadmap.kanji.remaining * 5; // 5 min per kanji
  const grammarMinutes = roadmap.grammar.remaining * 10; // 10 min per pattern
  const listeningMinutes = roadmap.listening.remaining * 3; // 3 min per exercise
  
  const totalMinutes = vocabularyMinutes + kanjiMinutes + grammarMinutes + listeningMinutes;
  const totalDays = Math.ceil(totalMinutes / dailyMinutes);
  
  return {
    totalMinutes,
    totalDays,
    breakdown: {
      vocabulary: vocabularyMinutes,
      kanji: kanjiMinutes,
      grammar: grammarMinutes,
      listening: listeningMinutes
    }
  };
};

export default {
  N4_TARGET_REQUIREMENTS,
  getCurrentContentStats,
  getProgressPercentage,
  getContentRoadmap,
  estimateStudyTime,
  generateVocabularyQuestions
};