import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shuffle, Trophy, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getVocabulary, getKanji, getGrammar } from '@/lib/data';
import quizData from '@/data/quiz-questions.json';

interface QuizQuestion {
  id: string;
  type: string;
  question: string;
  options: string[];
  correctAnswer: number;
  level: string;
  category?: 'vocabulary' | 'kanji' | 'grammar';
}

interface QuizGeneratorProps {
  category: 'vocabulary' | 'kanji' | 'grammar';
  questionCount?: number;
  onComplete?: (score: number, totalQuestions: number) => void;
  onClose?: () => void;
}

export default function QuizGenerator({ 
  category, 
  questionCount = 20, 
  onComplete, 
  onClose 
}: QuizGeneratorProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  // Generate comprehensive quiz questions based on data
  const generateQuestions = () => {
    let baseQuestions: QuizQuestion[] = [];
    
    if (category === 'vocabulary') {
      const vocabulary = getVocabulary();
      baseQuestions = [
        ...quizData.vocabulary.map(q => ({ ...q, category: 'vocabulary' as const })),
        ...vocabulary.slice(0, questionCount * 2).map((item, index) => ({
          id: `gen_v_${index}`,
          type: 'meaning',
          question: `What does "${item.japanese}" mean?`,
          options: [
            item.meaning,
            ...getRandomOptions(vocabulary, 'meaning', item.meaning, 3)
          ].sort(() => Math.random() - 0.5),
          correctAnswer: 0,
          level: item.level,
          category: 'vocabulary' as const
        })),
        ...vocabulary.slice(0, questionCount).map((item, index) => ({
          id: `gen_vr_${index}`,
          type: 'reading',
          question: `How do you read "${item.japanese}"?`,
          options: [
            item.reading,
            ...getRandomOptions(vocabulary, 'reading', item.reading, 3)
          ].sort(() => Math.random() - 0.5),
          correctAnswer: 0,
          level: item.level,
          category: 'vocabulary' as const
        }))
      ];
    } else if (category === 'kanji') {
      const kanji = getKanji();
      baseQuestions = [
        ...quizData.kanji.map(q => ({ ...q, category: 'kanji' as const })),
        ...kanji.slice(0, questionCount * 2).map((item, index) => ({
          id: `gen_k_${index}`,
          type: 'meaning',
          question: `What does the kanji "${item.character}" mean?`,
          options: [
            item.meaning,
            ...getRandomOptions(kanji, 'meaning', item.meaning, 3)
          ].sort(() => Math.random() - 0.5),
          correctAnswer: 0,
          level: item.level,
          category: 'kanji' as const
        })),
        ...kanji.slice(0, questionCount).map((item, index) => ({
          id: `gen_kr_${index}`,
          type: 'reading',
          question: `What is the onyomi reading of "${item.character}"?`,
          options: [
            item.onyomi.split('、')[0],
            ...getRandomOptions(kanji, 'onyomi', item.onyomi, 3)
          ].sort(() => Math.random() - 0.5),
          correctAnswer: 0,
          level: item.level,
          category: 'kanji' as const
        }))
      ];
    } else if (category === 'grammar') {
      const grammar = getGrammar();
      baseQuestions = [
        ...quizData.grammar.map(q => ({ ...q, category: 'grammar' as const })),
        ...grammar.slice(0, questionCount * 2).map((item, index) => ({
          id: `gen_g_${index}`,
          type: 'meaning',
          question: `What does "${item.structure}" mean?`,
          options: [
            item.meaning,
            ...getRandomOptions(grammar, 'meaning', item.meaning, 3)
          ].sort(() => Math.random() - 0.5),
          correctAnswer: 0,
          level: item.level,
          category: 'grammar' as const
        }))
      ];
    }

    // Shuffle and limit questions
    const shuffledQuestions = baseQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, questionCount);
    
    setQuizQuestions(shuffledQuestions);
  };

  const getRandomOptions = (data: any[], field: string, correct: string, count: number): string[] => {
    const options = data
      .map(item => item[field])
      .filter(value => value !== correct && value)
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
    
    // If not enough unique options, pad with variations
    while (options.length < count) {
      options.push(`Option ${options.length + 1}`);
    }
    
    return options;
  };

  const handleStart = () => {
    generateQuestions();
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null && !showResult) {
      setShowResult(true);
      if (selectedAnswer === quizQuestions[currentQuestion].correctAnswer) {
        setScore(prev => prev + 1);
      }
    } else if (showResult) {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        onComplete?.(score, quizQuestions.length);
      }
    }
  };

  const progress = quizQuestions.length > 0 ? ((currentQuestion + 1) / quizQuestions.length) * 100 : 0;

  if (quizQuestions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6" data-testid="quiz-setup">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              {category.charAt(0).toUpperCase() + category.slice(1)} Quiz Challenge
            </CardTitle>
            <CardDescription>
              Test your {category} knowledge with {questionCount} comprehensive questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{questionCount}</div>
                <div className="text-sm text-blue-800 dark:text-blue-300">Questions</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">30</div>
                <div className="text-sm text-green-800 dark:text-green-300">Minutes</div>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                This quiz includes multiple question types: meanings, readings, usage patterns, and more.
              </p>
              <div className="flex gap-2 justify-center">
                <Badge variant="outline">N4 Level</Badge>
                <Badge variant="outline">Timed</Badge>
                <Badge variant="outline">Mixed Types</Badge>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleStart} className="flex-1 flex items-center gap-2">
                <Shuffle className="w-4 h-4" />
                Start Quiz
              </Button>
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  Back
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = quizQuestions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-6" data-testid="quiz-active">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            {category.charAt(0).toUpperCase() + category.slice(1)} Quiz
          </h2>
          <p className="text-gray-600">Question {currentQuestion + 1} of {quizQuestions.length}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
          <Badge variant="outline">Score: {score}/{currentQuestion + (showResult ? 1 : 0)}</Badge>
        </div>
      </div>

      <Progress value={progress} className="mb-6" />

      {/* Question */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{currentQ.type}</Badge>
            <Badge variant="outline">{currentQ.level}</Badge>
          </div>
          <CardTitle className="text-lg">{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              let buttonVariant: "default" | "outline" | "destructive" | "secondary" = "outline";
              let icon = null;

              if (showResult) {
                if (index === currentQ.correctAnswer) {
                  buttonVariant = "default";
                  icon = <CheckCircle className="w-4 h-4 text-green-600" />;
                } else if (index === selectedAnswer && selectedAnswer !== currentQ.correctAnswer) {
                  buttonVariant = "destructive";
                  icon = <XCircle className="w-4 h-4" />;
                }
              } else if (selectedAnswer === index) {
                buttonVariant = "secondary";
              }

              return (
                <Button
                  key={index}
                  variant={buttonVariant}
                  className="w-full justify-between h-auto p-4"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  data-testid={`option-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-left">{option}</span>
                  </div>
                  {icon}
                </Button>
              );
            })}
          </div>

          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleNext}
              disabled={!showResult && selectedAnswer === null}
              data-testid="next-question"
            >
              {showResult ? (
                currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'
              ) : (
                'Check Answer'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}