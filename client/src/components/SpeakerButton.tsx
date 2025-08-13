import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/useSpeech';

interface SpeakerButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SpeakerButton({ text, className = '', size = 'sm' }: SpeakerButtonProps) {
  const { speak, isSupported } = useSpeech();

  if (!isSupported) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(text);
  };

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={`${sizeClasses[size]} p-0 hover:bg-primary/10 ${className}`}
      data-testid={`speaker-button-${text}`}
    >
      <Volume2 className="h-4 w-4" />
    </Button>
  );
}
