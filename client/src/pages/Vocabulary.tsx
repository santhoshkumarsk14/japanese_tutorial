import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Flashcard from '@/components/Flashcard';
import Quiz from '@/components/Quiz';
import QuizGenerator from '@/components/QuizGenerator';
import SpeakerButton from '@/components/SpeakerButton';
import { getVocabulary } from '@/lib/data';
import { VocabularyItem } from '@/types/learning';
import { useProgress } from '@/hooks/useProgress';
import { Search } from 'lucide-react';

export default function Vocabulary() {
  const [currentView, setCurrentView] = useState<'list' | 'flashcard' | 'quiz' | 'comprehensive-quiz'>('list');
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'all'>('all');
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const { addXP, updateStreak } = useProgress();

  const allVocabulary = getVocabulary();
  const filteredVocabulary = allVocabulary.filter(word => {
    const matchesLevel = selectedLevel === 'all' || word.level === selectedLevel;
    const matchesSearch = word.japanese.includes(searchTerm) || 
                         word.reading.includes(searchTerm) || 
                         word.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const quizQuestions = filteredVocabulary.slice(0, 10).map(word => ({
    question: `What does "${word.japanese}" mean?`,
    options: [
      word.meaning,
      allVocabulary[Math.floor(Math.random() * allVocabulary.length)].meaning,
      allVocabulary[Math.floor(Math.random() * allVocabulary.length)].meaning,
      allVocabulary[Math.floor(Math.random() * allVocabulary.length)].meaning,
    ].sort(() => Math.random() - 0.5),
    correctAnswer: 0,
    audioText: word.japanese,
  }));

  const handleWordToggle = (word: VocabularyItem) => {
    const newLearned = new Set(learnedWords);
    if (newLearned.has(word.id)) {
      newLearned.delete(word.id);
    } else {
      newLearned.add(word.id);
      addXP(10);
    }
    setLearnedWords(newLearned);
    updateStreak();
  };

  const handleFlashcardNext = () => {
    if (currentFlashcardIndex < filteredVocabulary.length - 1) {
      setCurrentFlashcardIndex(prev => prev + 1);
    } else {
      setCurrentFlashcardIndex(0);
    }
  };

  const handleFlashcardDifficulty = (difficulty: 'hard' | 'good' | 'easy') => {
    const xpReward = difficulty === 'easy' ? 20 : difficulty === 'good' ? 15 : 10;
    addXP(xpReward);
    updateStreak();
  };

  const handleQuizComplete = (score: number) => {
    const xpReward = score * 25;
    addXP(xpReward);
    updateStreak();
    setCurrentView('list');
  };

  if (currentView === 'flashcard' && filteredVocabulary.length > 0) {
    const currentWord = filteredVocabulary[currentFlashcardIndex];
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Vocabulary Flashcards</h2>
            <p className="text-gray-600">Card {currentFlashcardIndex + 1} of {filteredVocabulary.length}</p>
          </div>
          <Button variant="outline" onClick={() => setCurrentView('list')} data-testid="back-to-list">
            Back to List
          </Button>
        </div>

        <Flashcard
          front={
            <div className="text-center">
              <span className="text-4xl font-japanese block mb-2">{currentWord.japanese}</span>
              <span className="text-lg text-blue-100">{currentWord.reading}</span>
            </div>
          }
          back={
            <div className="text-center">
              <p className="text-2xl font-bold mb-2">{currentWord.meaning}</p>
              <p className="text-sm mb-4 font-japanese">{currentWord.example}</p>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {currentWord.level}
              </Badge>
            </div>
          }
          audioText={currentWord.japanese}
          onNext={handleFlashcardNext}
          onDifficulty={handleFlashcardDifficulty}
        />
        
        <div className="mt-4 bg-gray-100 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentFlashcardIndex + 1) / filteredVocabulary.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'quiz') {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Quiz
          questions={quizQuestions}
          title="Vocabulary Quiz"
          onComplete={handleQuizComplete}
          onClose={() => setCurrentView('list')}
        />
      </div>
    );
  }

  if (currentView === 'comprehensive-quiz') {
    return (
      <QuizGenerator
        category="vocabulary"
        questionCount={50}
        onComplete={(score, total) => {
          const xpReward = score * 15;
          addXP(xpReward);
          updateStreak();
          setCurrentView('list');
        }}
        onClose={() => setCurrentView('list')}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Vocabulary</h2>
          <p className="text-gray-600">Build your Japanese word bank</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setCurrentView('flashcard')}
            disabled={filteredVocabulary.length === 0}
            data-testid="start-flashcards"
          >
            Practice Flashcards
          </Button>
          <Button
            onClick={() => setCurrentView('quiz')}
            variant="outline"
            disabled={filteredVocabulary.length === 0}
            data-testid="start-quiz"
          >
            Quick Quiz
          </Button>
          <Button
            onClick={() => setCurrentView('comprehensive-quiz')}
            variant="secondary"
            disabled={filteredVocabulary.length === 0}
            data-testid="start-comprehensive-quiz"
          >
            Comprehensive Quiz
          </Button>
        </div>
      </div>

      <Tabs defaultValue="words" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="words" data-testid="tab-words">Word List</TabsTrigger>
          <TabsTrigger value="practice" data-testid="tab-practice">Practice</TabsTrigger>
          <TabsTrigger value="progress" data-testid="tab-progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="words" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vocabulary Words</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search words..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4"
                    data-testid="search-words"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant={selectedLevel === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedLevel('all')}
                    data-testid="filter-all"
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedLevel === 'N5' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedLevel('N5')}
                    className={selectedLevel === 'N5' ? 'bg-n5 hover:bg-green-600' : ''}
                    data-testid="filter-n5"
                  >
                    N5
                  </Button>
                  <Button
                    variant={selectedLevel === 'N4' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedLevel('N4')}
                    className={selectedLevel === 'N4' ? 'bg-n4 hover:bg-yellow-500' : ''}
                    data-testid="filter-n4"
                  >
                    N4
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredVocabulary.map(word => {
                  const isLearned = learnedWords.has(word.id);
                  return (
                    <Card
                      key={word.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isLearned ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => handleWordToggle(word)}
                      data-testid={`word-${word.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-lg font-japanese font-medium">{word.japanese}</span>
                              <span className="text-sm text-gray-500 font-japanese">({word.reading})</span>
                              <Badge 
                                variant="secondary" 
                                className={word.level === 'N5' ? 'bg-n5/20 text-n5' : 'bg-n4/20 text-n4'}
                              >
                                {word.level}
                              </Badge>
                              {isLearned && (
                                <Badge variant="secondary" className="bg-primary/20 text-primary">
                                  ✓ Learned
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-700 mb-1">{word.meaning}</p>
                            <p className="text-sm text-gray-500 font-japanese">{word.example}</p>
                          </div>
                          <SpeakerButton text={word.japanese} size="md" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {filteredVocabulary.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No words found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Flashcard Study</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
                  alt="Japanese study materials"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600 text-sm mb-4">
                  Study vocabulary with spaced repetition flashcards
                </p>
                <Button
                  onClick={() => setCurrentView('flashcard')}
                  className="w-full"
                  disabled={filteredVocabulary.length === 0}
                  data-testid="start-flashcard-study"
                >
                  Start Flashcard Study
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quiz Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
                  alt="Japanese flashcards"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600 text-sm mb-4">
                  Test your knowledge with multiple choice quizzes
                </p>
                <Button
                  onClick={() => setCurrentView('quiz')}
                  variant="outline"
                  className="w-full"
                  disabled={filteredVocabulary.length === 0}
                  data-testid="start-quiz-practice"
                >
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Words Learned:</span>
                    <span className="font-bold">{learnedWords.size}/{allVocabulary.length}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(learnedWords.size / allVocabulary.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-n5/10 rounded-lg">
                    <p className="text-2xl font-bold text-n5">
                      {learnedWords.size > 0 ? Math.round((Array.from(learnedWords).filter(id => allVocabulary.find(w => w.id === id)?.level === 'N5').length / getVocabulary('N5').length) * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-600">N5 Progress</p>
                  </div>
                  <div className="text-center p-4 bg-n4/10 rounded-lg">
                    <p className="text-2xl font-bold text-n4">
                      {learnedWords.size > 0 ? Math.round((Array.from(learnedWords).filter(id => allVocabulary.find(w => w.id === id)?.level === 'N4').length / getVocabulary('N4').length) * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-600">N4 Progress</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
