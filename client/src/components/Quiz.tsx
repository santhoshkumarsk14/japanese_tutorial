import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import SpeakerButton from './SpeakerButton';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  audioText?: string;
  explanation?: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  title?: string;
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

export default function Quiz({ questions, title = 'Quiz', onComplete, onClose }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    setShowResult(true);
    
    if (index === question.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsAnswered(false);
    } else {
      onComplete?.(score);
    }
  };

  const getButtonVariant = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index ? 'default' : 'outline';
    }
    
    if (index === question.correctAnswer) {
      return 'default';
    } else if (selectedAnswer === index && index !== question.correctAnswer) {
      return 'destructive';
    }
    return 'outline';
  };

  const getButtonClassName = (index: number) => {
    if (!showResult) return '';
    
    if (index === question.correctAnswer) {
      return 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100';
    } else if (selectedAnswer === index && index !== question.correctAnswer) {
      return 'border-red-500 bg-red-50 text-red-700 hover:bg-red-100';
    }
    return '';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} data-testid="close-quiz">
            ✕
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Progress value={progress} className="w-full" />
        
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground mb-2">
            {question.question}
          </p>
          
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-center space-x-4">
              <span className="text-4xl font-japanese">
                {/* This would be dynamic based on the question content */}
                {question.audioText || '水'}
              </span>
              {question.audioText && (
                <SpeakerButton
                  text={question.audioText}
                  className="text-white hover:text-blue-200"
                  size="md"
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant={getButtonVariant(index)}
              className={`w-full p-4 text-left justify-start h-auto ${getButtonClassName(index)}`}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              data-testid={`quiz-option-${index}`}
            >
              {String.fromCharCode(65 + index)}) {option}
            </Button>
          ))}
        </div>
        
        {showResult && (
          <div className="text-center space-y-4">
            {selectedAnswer === question.correctAnswer ? (
              <p className="text-green-600 font-medium">Correct! 🎉</p>
            ) : (
              <p className="text-red-600 font-medium">
                Incorrect. The correct answer is {String.fromCharCode(65 + question.correctAnswer)}.
              </p>
            )}
            
            {question.explanation && (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                {question.explanation}
              </p>
            )}
            
            <Button
              onClick={handleNext}
              className="w-full"
              data-testid="quiz-next"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
            </Button>
          </div>
        )}
        
        {!showResult && selectedAnswer !== null && (
          <Button
            onClick={handleNext}
            className="w-full"
            disabled={selectedAnswer === null}
            data-testid="quiz-next"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
