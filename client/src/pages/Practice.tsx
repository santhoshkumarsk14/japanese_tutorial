import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Flashcard from '@/components/Flashcard';
import Quiz from '@/components/Quiz';
import { getHiraganaCharacters, getKatakanaCharacters, getVocabulary, getKanji, getGrammar } from '@/lib/data';
import { useProgress } from '@/hooks/useProgress';
import { Gamepad2, Zap, Target, Trophy, Brain, BookOpen, Volume2 } from 'lucide-react';
import ListeningPractice from '@/components/ListeningPractice';

type PracticeMode = 'menu' | 'flashcard-blitz' | 'mixed-quiz' | 'speed-challenge' | 'character-match' | 'listening-practice';

export default function Practice() {
  const [currentMode, setCurrentMode] = useState<PracticeMode>('menu');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [gameData, setGameData] = useState<any[]>([]);
  const { addXP, updateStreak } = useProgress();

  const initializeFlashcardBlitz = () => {
    const vocab = getVocabulary().slice(0, 20);
    setGameData(vocab);
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(300);
    setCurrentMode('flashcard-blitz');
  };

  const initializeMixedQuiz = () => {
    const vocab = getVocabulary().slice(0, 5);
    const kanji = getKanji().slice(0, 3);
    const grammar = getGrammar().slice(0, 2);
    
    const questions = [
      ...vocab.map(item => ({
        question: `What does "${item.japanese}" mean?`,
        options: [
          item.meaning,
          getVocabulary()[Math.floor(Math.random() * getVocabulary().length)].meaning,
          getVocabulary()[Math.floor(Math.random() * getVocabulary().length)].meaning,
          getVocabulary()[Math.floor(Math.random() * getVocabulary().length)].meaning,
        ].sort(() => Math.random() - 0.5),
        correctAnswer: 0,
        audioText: item.japanese,
        type: 'vocabulary'
      })),
      ...kanji.map(item => ({
        question: `What does this kanji mean?`,
        options: [
          item.meaning,
          getKanji()[Math.floor(Math.random() * getKanji().length)].meaning,
          getKanji()[Math.floor(Math.random() * getKanji().length)].meaning,
          getKanji()[Math.floor(Math.random() * getKanji().length)].meaning,
        ].sort(() => Math.random() - 0.5),
        correctAnswer: 0,
        audioText: item.character,
        type: 'kanji'
      })),
      ...grammar.map(item => ({
        question: `What does "${item.structure}" mean?`,
        options: [
          item.meaning,
          getGrammar()[Math.floor(Math.random() * getGrammar().length)].meaning,
          getGrammar()[Math.floor(Math.random() * getGrammar().length)].meaning,
          getGrammar()[Math.floor(Math.random() * getGrammar().length)].meaning,
        ].sort(() => Math.random() - 0.5),
        correctAnswer: 0,
        audioText: item.examples[0]?.japanese || '',
        type: 'grammar'
      }))
    ].sort(() => Math.random() - 0.5);

    setGameData(questions);
    setCurrentMode('mixed-quiz');
  };

  const initializeSpeedChallenge = () => {
    const hiragana = getHiraganaCharacters().filter(char => char.category === 'basic').slice(0, 15);
    setGameData(hiragana);
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(60); // 1 minute
    setCurrentMode('speed-challenge');
  };

  const handleFlashcardNext = () => {
    if (currentIndex < gameData.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Complete challenge
      addXP(50 + score * 5);
      updateStreak();
      setCurrentMode('menu');
    }
  };

  const handleFlashcardDifficulty = (difficulty: 'hard' | 'good' | 'easy') => {
    const points = difficulty === 'easy' ? 3 : difficulty === 'good' ? 2 : 1;
    setScore(prev => prev + points);
  };

  const handleQuizComplete = (quizScore: number) => {
    const xpReward = quizScore * 15 + 100;
    addXP(xpReward);
    updateStreak();
    setCurrentMode('menu');
  };

  const practiceGames = [
    {
      id: 'flashcard-blitz',
      title: 'Flashcard Blitz',
      description: 'Review 20 vocabulary words as fast as possible',
      icon: Zap,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
      difficulty: 'Medium',
      time: '5 min',
      xp: '+50 XP',
      action: initializeFlashcardBlitz
    },
    {
      id: 'mixed-quiz',
      title: 'Mixed Challenge',
      description: 'Test your knowledge across all categories',
      icon: Brain,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      difficulty: 'Hard',
      time: '10 min',
      xp: '+100 XP',
      action: initializeMixedQuiz
    },
    {
      id: 'speed-challenge',
      title: 'Speed Challenge',
      description: 'Quick hiragana recognition under time pressure',
      icon: Target,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-500/10',
      difficulty: 'Easy',
      time: '1 min',
      xp: '+25 XP',
      action: initializeSpeedChallenge
    },
    {
      id: 'listening-practice',
      title: 'Listening Practice',
      description: 'N4 listening comprehension exercises',
      icon: Volume2,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      difficulty: 'Medium',
      time: '8 min',
      xp: '+80 XP',
      action: () => setCurrentMode('listening-practice')
    },
    {
      id: 'character-match',
      title: 'Character Match',
      description: 'Coming soon - Match characters with pronunciations',
      icon: Trophy,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-500/10',
      difficulty: 'Medium',
      time: '3 min',
      xp: '+75 XP',
      action: () => {}
    }
  ];

  if (currentMode === 'flashcard-blitz' && gameData.length > 0) {
    const currentItem = gameData[currentIndex];
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Flashcard Blitz</h2>
            <p className="text-gray-600">Card {currentIndex + 1} of {gameData.length} • Score: {score}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <Button variant="outline" onClick={() => setCurrentMode('menu')} data-testid="exit-game">
              Exit
            </Button>
          </div>
        </div>

        <Flashcard
          front={
            <div className="text-center">
              <span className="text-4xl font-japanese block mb-2">{currentItem.japanese}</span>
              <span className="text-lg text-blue-100">{currentItem.reading}</span>
            </div>
          }
          back={
            <div className="text-center">
              <p className="text-2xl font-bold mb-2">{currentItem.meaning}</p>
              <p className="text-sm mb-4 font-japanese">{currentItem.example}</p>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {currentItem.level}
              </Badge>
            </div>
          }
          audioText={currentItem.japanese}
          onNext={handleFlashcardNext}
          onDifficulty={handleFlashcardDifficulty}
        />
        
        <div className="mt-4 bg-gray-100 rounded-full h-2">
          <div
            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / gameData.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  if (currentMode === 'mixed-quiz') {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Quiz
          questions={gameData}
          title="Mixed Challenge"
          onComplete={handleQuizComplete}
          onClose={() => setCurrentMode('menu')}
        />
      </div>
    );
  }

  if (currentMode === 'listening-practice') {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => setCurrentMode('menu')} className="mr-4">
            ← Back to Practice
          </Button>
        </div>
        <ListeningPractice onComplete={(score) => {
          addXP(score * 16 + 80);
          updateStreak();
          setCurrentMode('menu');
        }} />
      </div>
    );
  }

  if (currentMode === 'speed-challenge' && gameData.length > 0) {
    const currentChar = gameData[currentIndex];
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Speed Challenge</h2>
            <p className="text-gray-600">Character {currentIndex + 1} of {gameData.length} • Score: {score}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-lg font-bold text-red-500">
              {timeLeft}s
            </div>
            <Button variant="outline" onClick={() => setCurrentMode('menu')} data-testid="exit-game">
              Exit
            </Button>
          </div>
        </div>

        <Card className="text-center p-8 mb-6">
          <span className="text-8xl font-japanese">{currentChar.character}</span>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {[currentChar.romaji, 
            getHiraganaCharacters()[Math.floor(Math.random() * 20)].romaji,
            getHiraganaCharacters()[Math.floor(Math.random() * 20)].romaji,
            getHiraganaCharacters()[Math.floor(Math.random() * 20)].romaji
          ].sort(() => Math.random() - 0.5).map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="p-4 text-lg"
              onClick={() => {
                if (option === currentChar.romaji) {
                  setScore(prev => prev + 1);
                }
                handleFlashcardNext();
              }}
              data-testid={`speed-option-${index}`}
            >
              {option}
            </Button>
          ))}
        </div>
        
        <div className="mt-4 bg-gray-100 rounded-full h-2">
          <div
            className="bg-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / gameData.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">Practice Arena</h2>
        <p className="text-gray-600">Challenge yourself with gamified learning exercises</p>
      </div>

      {/* Daily Challenge Banner */}
      <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🔥 Daily Challenge</h3>
              <p className="text-blue-100 mb-4">Complete any practice game to maintain your streak!</p>
              <div className="flex items-center space-x-4 text-sm">
                <span>Streak: 7 days</span>
                <span>•</span>
                <span>Next reward in 3 days</span>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
              alt="Japanese flashcards"
              className="w-20 h-20 rounded-lg object-cover"
            />
          </div>
        </CardContent>
      </Card>

      {/* Practice Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {practiceGames.map((game) => {
          const Icon = game.icon;
          const isComingSoon = game.id === 'character-match';
          
          return (
            <Card 
              key={game.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${isComingSoon ? 'opacity-60' : ''}`}
              onClick={isComingSoon ? undefined : game.action}
              data-testid={`game-${game.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${game.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${game.textColor}`} />
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge variant="secondary" className={`${game.bgColor} ${game.textColor}`}>
                      {game.difficulty}
                    </Badge>
                    {isComingSoon && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-500">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{game.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>⏱️ {game.time}</span>
                    <span>✨ {game.xp}</span>
                  </div>
                  <Gamepad2 className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Practice Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-2xl font-bold text-primary">47</p>
              <p className="text-sm text-gray-600">Games Played</p>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <p className="text-2xl font-bold text-green-600">82%</p>
              <p className="text-sm text-gray-600">Average Score</p>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">7</p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
            <div className="text-center p-4 bg-purple-500/10 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">1,247</p>
              <p className="text-sm text-gray-600">XP Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h4 className="font-medium">Study Mode</h4>
            <p className="text-sm text-gray-600">Return to lessons</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h4 className="font-medium">Custom Quiz</h4>
            <p className="text-sm text-gray-600">Create your own test</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <h4 className="font-medium">Leaderboard</h4>
            <p className="text-sm text-gray-600">Compare with others</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
