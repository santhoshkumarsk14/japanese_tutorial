import { HiraganaCharacter, KatakanaCharacter, VocabularyItem, KanjiItem, GrammarItem, ReadingPassage } from '@/types/learning';

import hiraganaData from '@/data/hiragana.json';
import katakanaData from '@/data/katakana.json';
import vocabularyData from '@/data/vocabulary.json';
import kanjiData from '@/data/kanji.json';
import grammarData from '@/data/grammar.json';
import readingData from '@/data/reading.json';

export const getHiraganaCharacters = (): HiraganaCharacter[] => hiraganaData;
export const getKatakanaCharacters = (): KatakanaCharacter[] => katakanaData;

export const getVocabulary = (level?: 'N5' | 'N4'): VocabularyItem[] => {
  if (level) {
    return vocabularyData.filter(item => item.level === level);
  }
  return vocabularyData;
};

export const getKanji = (level?: 'N5' | 'N4'): KanjiItem[] => {
  if (level) {
    return kanjiData.filter(item => item.level === level);
  }
  return kanjiData;
};

export const getGrammar = (level?: 'N5' | 'N4'): GrammarItem[] => {
  if (level) {
    return grammarData.filter(item => item.level === level);
  }
  return grammarData;
};

export const getReadingPassages = (level?: 'N5' | 'N4'): ReadingPassage[] => {
  if (level) {
    return readingData.filter(item => item.level === level);
  }
  return readingData;
};

export const getAllLearningData = () => ({
  hiragana: getHiraganaCharacters(),
  katakana: getKatakanaCharacters(),
  vocabulary: getVocabulary(),
  kanji: getKanji(),
  grammar: getGrammar(),
  reading: getReadingPassages(),
});
