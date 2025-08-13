import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SpeakerButton from './SpeakerButton';

interface FlashcardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  audioText?: string;
  onNext?: () => void;
  onDifficulty?: (difficulty: 'hard' | 'good' | 'easy') => void;
}

export default function Flashcard({
  front,
  back,
  audioText,
  onNext,
  onDifficulty,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDifficulty = (difficulty: 'hard' | 'good' | 'easy') => {
    onDifficulty?.(difficulty);
    setIsFlipped(false);
    onNext?.();
  };

  return (
    <div className="flip-card w-full h-64" onClick={handleFlip}>
      <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* Front */}
        <Card className="flip-card-front absolute w-full h-full bg-gradient-to-br from-primary to-blue-600 border-0 cursor-pointer">
          <CardContent className="flex items-center justify-center h-full text-white">
            <div className="text-center">
              <div className="mb-4">{front}</div>
              <p className="text-sm opacity-75">Click to reveal</p>
            </div>
          </CardContent>
        </Card>

        {/* Back */}
        <Card className="flip-card-back absolute w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 border-0 cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center h-full text-white p-6">
            <div className="text-center mb-4 flex-1 flex items-center justify-center">
              <div>
                <div className="mb-4">{back}</div>
                {audioText && (
                  <SpeakerButton
                    text={audioText}
                    className="text-white hover:text-yellow-300"
                    size="md"
                  />
                )}
              </div>
            </div>

            {onDifficulty && (
              <div className="flex space-x-2 w-full" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDifficulty('hard')}
                  className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                  data-testid="difficulty-hard"
                >
                  Hard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDifficulty('good')}
                  className="flex-1 text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                  data-testid="difficulty-good"
                >
                  Good
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDifficulty('easy')}
                  className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                  data-testid="difficulty-easy"
                >
                  Easy
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
