import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Volume2, CheckCircle, XCircle } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';

interface ListeningExercise {
  id: string;
  level: 'N5' | 'N4';
  type: 'conversation' | 'instruction' | 'dialog';
  audio: string;
  transcript: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const LISTENING_EXERCISES: ListeningExercise[] = [
  {
    id: 'l1',
    level: 'N4',
    type: 'conversation',
    audio: 'おはようございます。今日は天気がいいですね。',
    transcript: 'おはようございます。今日は天気がいいですね。',
    question: 'What is the speaker talking about?',
    options: ['The weather today', 'Tomorrow\'s plans', 'Work schedule', 'Weekend activities'],
    correctAnswer: 0,
    difficulty: 'easy'
  },
  {
    id: 'l2',
    level: 'N4',
    type: 'instruction',
    audio: '電車は三番線から出発します。お気をつけください。',
    transcript: '電車は三番線から出発します。お気をつけください。',
    question: 'From which platform does the train depart?',
    options: ['Platform 1', 'Platform 2', 'Platform 3', 'Platform 4'],
    correctAnswer: 2,
    difficulty: 'medium'
  },
  {
    id: 'l3',
    level: 'N4',
    type: 'dialog',
    audio: '会議は何時からですか。午後二時からです。ありがとうございます。',
    transcript: '会議は何時からですか。午後二時からです。ありがとうございます。',
    question: 'When does the meeting start?',
    options: ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 'l4',
    level: 'N4',
    type: 'conversation',
    audio: 'すみません、図書館はどこですか。この道をまっすぐ行って、右に曲がってください。',
    transcript: 'すみません、図書館はどこですか。この道をまっすぐ行って、右に曲がってください。',
    question: 'What directions were given?',
    options: ['Go straight then turn left', 'Go straight then turn right', 'Turn left then go straight', 'Turn right then go straight'],
    correctAnswer: 1,
    difficulty: 'hard'
  },
  {
    id: 'l5',
    level: 'N4',
    type: 'instruction',
    audio: '申し込みは来週の金曜日までにお願いします。',
    transcript: '申し込みは来週の金曜日までにお願いします。',
    question: 'When is the application deadline?',
    options: ['This Friday', 'Next Friday', 'This Monday', 'Next Monday'],
    correctAnswer: 1,
    difficulty: 'medium'
  }
];

interface ListeningPracticeProps {
  onComplete?: (score: number) => void;
}

export default function ListeningPractice({ onComplete }: ListeningPracticeProps) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(new Array(LISTENING_EXERCISES.length).fill(false));
  const { speak, isSupported } = useSpeech();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const exercise = LISTENING_EXERCISES[currentExercise];
  const progress = ((currentExercise + 1) / LISTENING_EXERCISES.length) * 100;

  const playAudio = () => {
    if (isSupported) {
      setIsSpeaking(true);
      speak(exercise.audio);
      // Simulate speech duration
      setTimeout(() => setIsSpeaking(false), exercise.audio.length * 100);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    const isCorrect = selectedAnswer === exercise.correctAnswer;
    
    if (isCorrect && !completed[currentExercise]) {
      setScore(prev => prev + 1);
    }
    
    const newCompleted = [...completed];
    newCompleted[currentExercise] = true;
    setCompleted(newCompleted);
  };

  const nextExercise = () => {
    if (currentExercise < LISTENING_EXERCISES.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      onComplete?.(score);
    }
  };

  const resetExercise = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6" data-testid="listening-practice">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Listening Practice
          </h2>
          <Badge variant="outline" data-testid="exercise-counter">
            {currentExercise + 1} / {LISTENING_EXERCISES.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" data-testid="progress-bar" />
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Score: {score} / {LISTENING_EXERCISES.length}
        </div>
      </div>

      {/* Exercise Card */}
      <Card data-testid="exercise-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)} Exercise
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">{exercise.level}</Badge>
              <Badge className={getDifficultyColor(exercise.difficulty)}>
                {exercise.difficulty}
              </Badge>
            </div>
          </div>
          <CardDescription>
            Listen carefully and answer the question
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Audio Controls */}
          <div className="flex items-center justify-center gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Button
              onClick={playAudio}
              disabled={isSpeaking}
              className="flex items-center gap-2"
              data-testid="play-audio-button"
            >
              {isSpeaking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isSpeaking ? 'Playing...' : 'Play Audio'}
            </Button>
            <Button
              variant="outline"
              onClick={resetExercise}
              disabled={!showResult}
              data-testid="reset-button"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Question */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold" data-testid="question">
              {exercise.question}
            </h3>
            
            {/* Answer Options */}
            <div className="space-y-2">
              {exercise.options.map((option, index) => {
                let buttonVariant: "default" | "outline" | "destructive" | "secondary" = "outline";
                let icon = null;

                if (showResult) {
                  if (index === exercise.correctAnswer) {
                    buttonVariant = "default";
                    icon = <CheckCircle className="w-4 h-4 text-green-600" />;
                  } else if (index === selectedAnswer && selectedAnswer !== exercise.correctAnswer) {
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
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    data-testid={`option-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                      {icon}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Show transcript after answering */}
          {showResult && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Transcript:
              </h4>
              <p className="text-blue-800 dark:text-blue-200 font-japanese">
                {exercise.transcript}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {!showResult ? (
              <Button
                onClick={checkAnswer}
                disabled={selectedAnswer === null}
                className="flex-1"
                data-testid="check-answer-button"
              >
                Check Answer
              </Button>
            ) : (
              <Button
                onClick={nextExercise}
                className="flex-1"
                data-testid="next-exercise-button"
              >
                {currentExercise === LISTENING_EXERCISES.length - 1 ? 'Finish' : 'Next Exercise'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}