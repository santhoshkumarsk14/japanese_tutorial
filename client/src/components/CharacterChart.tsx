import { HiraganaCharacter, KatakanaCharacter } from '@/types/learning';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SpeakerButton from './SpeakerButton';

interface CharacterChartProps {
  characters: (HiraganaCharacter | KatakanaCharacter)[];
  onCharacterClick?: (character: HiraganaCharacter | KatakanaCharacter) => void;
  learnedCharacters?: Set<string>;
}

export default function CharacterChart({
  characters,
  onCharacterClick,
  learnedCharacters = new Set(),
}: CharacterChartProps) {
  const basicCharacters = characters.filter(char => char.category === 'basic');
  const dakutenCharacters = characters.filter(char => char.category === 'dakuten');
  const handakutenCharacters = characters.filter(char => char.category === 'handakuten');

  const renderCharacterGrid = (chars: (HiraganaCharacter | KatakanaCharacter)[], title: string) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-5 gap-3">
        {chars.map((char) => {
          const isLearned = learnedCharacters.has(char.id);
          return (
            <Card
              key={char.id}
              className={`character-card cursor-pointer transition-all duration-200 hover:shadow-md ${
                isLearned
                  ? 'border-n5 bg-n5/10 hover:bg-n5/20'
                  : 'border-gray-200 hover:border-n5 hover:bg-n5/10'
              }`}
              onClick={() => onCharacterClick?.(char)}
              data-testid={`character-${char.character}`}
            >
              <CardContent className="p-4 text-center">
                <div className="space-y-2">
                  <span className="text-2xl font-japanese block">
                    {char.character}
                  </span>
                  <span className="text-xs text-muted-foreground block">
                    {char.romaji}
                  </span>
                  <div className="flex justify-center">
                    <SpeakerButton
                      text={char.character}
                      className={isLearned ? 'text-n5 hover:text-green-600' : 'text-gray-500 hover:text-n5'}
                    />
                  </div>
                </div>
                {isLearned && (
                  <Badge variant="secondary" className="mt-2 text-xs bg-n5/20 text-n5">
                    ✓ Learned
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderCharacterGrid(basicCharacters, 'Basic Characters (Gojūon)')}
      {dakutenCharacters.length > 0 && renderCharacterGrid(dakutenCharacters, 'Dakuten (濁点)')}
      {handakutenCharacters.length > 0 && renderCharacterGrid(handakutenCharacters, 'Handakuten (半濁点)')}
    </div>
  );
}
