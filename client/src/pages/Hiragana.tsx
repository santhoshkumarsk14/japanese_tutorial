import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CharacterChart from '@/components/CharacterChart';
import Flashcard from '@/components/Flashcard';
import Quiz from '@/components/Quiz';
import { getHiraganaCharacters } from '@/lib/data';
import { HiraganaCharacter } from '@/types/learning';
import { useProgress } from '@/hooks/useProgress';

export default function Hiragana() {
  const [currentView, setCurrentView] = useState<'chart' | 'flashcard' | 'quiz'>('chart');
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [learnedCharacters, setLearnedCharacters] = useState<Set<string>>(new Set());
  const { addXP, updateStreak } = useProgress();

  const hiraganaCharacters = getHiraganaCharacters();
  const basicCharacters = hiraganaCharacters.filter(char => char.category === 'basic');

  const quizQuestions = basicCharacters.slice(0, 10).map(char => ({
    question: `What is the romaji for this hiragana character?`,
    options: [
      char.romaji,
      basicCharacters[Math.floor(Math.random() * basicCharacters.length)].romaji,
      basicCharacters[Math.floor(Math.random() * basicCharacters.length)].romaji,
      basicCharacters[Math.floor(Math.random() * basicCharacters.length)].romaji,
    ].sort(() => Math.random() - 0.5),
    correctAnswer: 0, // This would need to be calculated based on the shuffled array
    audioText: char.character,
  }));

  const handleCharacterClick = (character: HiraganaCharacter) => {
    const newLearned = new Set(learnedCharacters);
    if (newLearned.has(character.id)) {
      newLearned.delete(character.id);
    } else {
      newLearned.add(character.id);
      addXP(5);
    }
    setLearnedCharacters(newLearned);
    updateStreak();
  };

  const handleFlashcardNext = () => {
    if (currentFlashcardIndex < basicCharacters.length - 1) {
      setCurrentFlashcardIndex(prev => prev + 1);
    } else {
      setCurrentFlashcardIndex(0);
    }
  };

  const handleFlashcardDifficulty = (difficulty: 'hard' | 'good' | 'easy') => {
    const xpReward = difficulty === 'easy' ? 15 : difficulty === 'good' ? 10 : 5;
    addXP(xpReward);
    updateStreak();
  };

  const handleQuizComplete = (score: number) => {
    const xpReward = score * 20;
    addXP(xpReward);
    updateStreak();
    setCurrentView('chart');
  };

  if (currentView === 'flashcard') {
    const currentChar = basicCharacters[currentFlashcardIndex];
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Hiragana Flashcards</h2>
            <p className="text-gray-600">Card {currentFlashcardIndex + 1} of {basicCharacters.length}</p>
          </div>
          <Button variant="outline" onClick={() => setCurrentView('chart')} data-testid="back-to-chart">
            Back to Chart
          </Button>
        </div>

        <Flashcard
          front={<span className="text-6xl font-japanese">{currentChar.character}</span>}
          back={
            <div className="text-center">
              <p className="text-2xl font-bold mb-2">{currentChar.romaji}</p>
              <p className="text-lg">/{currentChar.romaji}/</p>
            </div>
          }
          audioText={currentChar.character}
          onNext={handleFlashcardNext}
          onDifficulty={handleFlashcardDifficulty}
        />
        
        <div className="mt-4 bg-gray-100 rounded-full h-2">
          <div
            className="bg-n5 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentFlashcardIndex + 1) / basicCharacters.length) * 100}%` }}
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
          title="Hiragana Quiz"
          onComplete={handleQuizComplete}
          onClose={() => setCurrentView('chart')}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hiragana</h2>
          <p className="text-gray-600">Master the basic Japanese syllabary</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setCurrentView('flashcard')}
            className="bg-n5 hover:bg-green-600"
            data-testid="start-flashcards"
          >
            Practice Flashcards
          </Button>
          <Button
            onClick={() => setCurrentView('quiz')}
            data-testid="start-quiz"
          >
            Take Quiz
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" data-testid="tab-basic">Basic (46)</TabsTrigger>
          <TabsTrigger value="practice" data-testid="tab-practice">Practice</TabsTrigger>
          <TabsTrigger value="games" data-testid="tab-games">Games</TabsTrigger>
          <TabsTrigger value="progress" data-testid="tab-progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hiragana Character Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <CharacterChart
                characters={hiraganaCharacters}
                onCharacterClick={handleCharacterClick}
                learnedCharacters={learnedCharacters}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
                  alt="Hiragana practice charts"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600 text-sm mb-4">
                  Practice writing and recognition with interactive exercises
                </p>
                <Button
                  onClick={() => setCurrentView('flashcard')}
                  className="w-full bg-n5 hover:bg-green-600"
                  data-testid="start-practice"
                >
                  Start Practice
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Memory Games</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
                  alt="Japanese flashcard games"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600 text-sm mb-4">
                  Match characters with sounds in fun, interactive games
                </p>
                <Button
                  onClick={() => setCurrentView('quiz')}
                  className="w-full"
                  data-testid="play-games"
                >
                  Play Games
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="games">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Games</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">More games coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Characters Learned:</span>
                  <span className="font-bold">{learnedCharacters.size}/46</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-n5 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(learnedCharacters.size / 46) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {learnedCharacters.size === 46 ? 'Congratulations! You\'ve mastered all hiragana characters!' : `${46 - learnedCharacters.size} characters remaining`}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
