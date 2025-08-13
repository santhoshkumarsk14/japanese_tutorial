import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Flashcard from '@/components/Flashcard';
import Quiz from '@/components/Quiz';
import SpeakerButton from '@/components/SpeakerButton';
import { getKanji } from '@/lib/data';
import { KanjiItem } from '@/types/learning';
import { useProgress } from '@/hooks/useProgress';
import { Search } from 'lucide-react';

export default function Kanji() {
  const [currentView, setCurrentView] = useState<'list' | 'flashcard' | 'quiz'>('list');
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'all'>('all');
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [learnedKanji, setLearnedKanji] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const { addXP, updateStreak } = useProgress();

  const allKanji = getKanji();
  const filteredKanji = allKanji.filter(kanji => {
    const matchesLevel = selectedLevel === 'all' || kanji.level === selectedLevel;
    const matchesSearch = kanji.character.includes(searchTerm) || 
                         kanji.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kanji.onyomi.includes(searchTerm) ||
                         kanji.kunyomi.includes(searchTerm);
    return matchesLevel && matchesSearch;
  });

  const quizQuestions = filteredKanji.slice(0, 10).map(kanji => ({
    question: `What does this kanji mean?`,
    options: [
      kanji.meaning,
      allKanji[Math.floor(Math.random() * allKanji.length)].meaning,
      allKanji[Math.floor(Math.random() * allKanji.length)].meaning,
      allKanji[Math.floor(Math.random() * allKanji.length)].meaning,
    ].sort(() => Math.random() - 0.5),
    correctAnswer: 0,
    audioText: kanji.character,
  }));

  const handleKanjiToggle = (kanji: KanjiItem) => {
    const newLearned = new Set(learnedKanji);
    if (newLearned.has(kanji.id)) {
      newLearned.delete(kanji.id);
    } else {
      newLearned.add(kanji.id);
      addXP(15);
    }
    setLearnedKanji(newLearned);
    updateStreak();
  };

  const handleFlashcardNext = () => {
    if (currentFlashcardIndex < filteredKanji.length - 1) {
      setCurrentFlashcardIndex(prev => prev + 1);
    } else {
      setCurrentFlashcardIndex(0);
    }
  };

  const handleFlashcardDifficulty = (difficulty: 'hard' | 'good' | 'easy') => {
    const xpReward = difficulty === 'easy' ? 25 : difficulty === 'good' ? 20 : 15;
    addXP(xpReward);
    updateStreak();
  };

  const handleQuizComplete = (score: number) => {
    const xpReward = score * 30;
    addXP(xpReward);
    updateStreak();
    setCurrentView('list');
  };

  if (currentView === 'flashcard' && filteredKanji.length > 0) {
    const currentKanji = filteredKanji[currentFlashcardIndex];
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Kanji Flashcards</h2>
            <p className="text-gray-600">Card {currentFlashcardIndex + 1} of {filteredKanji.length}</p>
          </div>
          <Button variant="outline" onClick={() => setCurrentView('list')} data-testid="back-to-list">
            Back to List
          </Button>
        </div>

        <Flashcard
          front={<span className="text-6xl font-japanese">{currentKanji.character}</span>}
          back={
            <div className="text-center">
              <p className="text-2xl font-bold mb-2">{currentKanji.meaning}</p>
              <div className="space-y-2 mb-4">
                <p className="text-sm">
                  <span className="font-medium">On:</span> {currentKanji.onyomi}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Kun:</span> {currentKanji.kunyomi}
                </p>
              </div>
              <div className="text-xs space-y-1">
                {currentKanji.examples.map((example, index) => (
                  <p key={index} className="font-japanese">{example}</p>
                ))}
              </div>
              <Badge variant="secondary" className="mt-2 bg-white/20 text-white">
                {currentKanji.level}
              </Badge>
            </div>
          }
          audioText={currentKanji.character}
          onNext={handleFlashcardNext}
          onDifficulty={handleFlashcardDifficulty}
        />
        
        <div className="mt-4 bg-gray-100 rounded-full h-2">
          <div
            className="bg-secondary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentFlashcardIndex + 1) / filteredKanji.length) * 100}%` }}
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
          title="Kanji Quiz"
          onComplete={handleQuizComplete}
          onClose={() => setCurrentView('list')}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kanji</h2>
          <p className="text-gray-600">Master Japanese characters</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setCurrentView('flashcard')}
            className="bg-secondary hover:bg-red-700"
            disabled={filteredKanji.length === 0}
            data-testid="start-flashcards"
          >
            Practice Flashcards
          </Button>
          <Button
            onClick={() => setCurrentView('quiz')}
            variant="outline"
            disabled={filteredKanji.length === 0}
            data-testid="start-quiz"
          >
            Take Quiz
          </Button>
        </div>
      </div>

      <Tabs defaultValue="kanji" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="kanji" data-testid="tab-kanji">Kanji List</TabsTrigger>
          <TabsTrigger value="practice" data-testid="tab-practice">Practice</TabsTrigger>
          <TabsTrigger value="progress" data-testid="tab-progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="kanji" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kanji Characters</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search kanji..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4"
                    data-testid="search-kanji"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredKanji.map(kanji => {
                  const isLearned = learnedKanji.has(kanji.id);
                  return (
                    <Card
                      key={kanji.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isLearned ? 'border-secondary bg-secondary/5' : ''
                      }`}
                      onClick={() => handleKanjiToggle(kanji)}
                      data-testid={`kanji-${kanji.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-4xl font-japanese">{kanji.character}</span>
                          <div className="flex flex-col items-end space-y-1">
                            <Badge 
                              variant="secondary" 
                              className={kanji.level === 'N5' ? 'bg-n5/20 text-n5' : 'bg-n4/20 text-n4'}
                            >
                              {kanji.level}
                            </Badge>
                            {isLearned && (
                              <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                                ✓
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <p className="font-medium text-gray-800">{kanji.meaning}</p>
                          <div className="space-y-1 text-gray-600">
                            <p><span className="font-medium">On:</span> {kanji.onyomi}</p>
                            <p><span className="font-medium">Kun:</span> {kanji.kunyomi}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              {kanji.examples.slice(0, 2).map((example, index) => (
                                <p key={index} className="text-xs font-japanese text-gray-500">
                                  {example}
                                </p>
                              ))}
                            </div>
                            <SpeakerButton text={kanji.character} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {filteredKanji.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No kanji found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Kanji Flashcards</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
                  alt="Kanji characters"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600 text-sm mb-4">
                  Study kanji with readings and meanings
                </p>
                <Button
                  onClick={() => setCurrentView('flashcard')}
                  className="w-full bg-secondary hover:bg-red-700"
                  disabled={filteredKanji.length === 0}
                  data-testid="start-flashcard-study"
                >
                  Start Flashcard Study
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kanji Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
                  alt="Japanese study materials"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600 text-sm mb-4">
                  Test your kanji knowledge with interactive quizzes
                </p>
                <Button
                  onClick={() => setCurrentView('quiz')}
                  variant="outline"
                  className="w-full"
                  disabled={filteredKanji.length === 0}
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
                    <span>Total Kanji Learned:</span>
                    <span className="font-bold">{learnedKanji.size}/{allKanji.length}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(learnedKanji.size / allKanji.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-n5/10 rounded-lg">
                    <p className="text-2xl font-bold text-n5">
                      {learnedKanji.size > 0 ? Math.round((Array.from(learnedKanji).filter(id => allKanji.find(k => k.id === id)?.level === 'N5').length / getKanji('N5').length) * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-600">N5 Progress</p>
                  </div>
                  <div className="text-center p-4 bg-n4/10 rounded-lg">
                    <p className="text-2xl font-bold text-n4">
                      {learnedKanji.size > 0 ? Math.round((Array.from(learnedKanji).filter(id => allKanji.find(k => k.id === id)?.level === 'N4').length / getKanji('N4').length) * 100) : 0}%
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
