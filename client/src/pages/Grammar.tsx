import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Quiz from '@/components/Quiz';
import SpeakerButton from '@/components/SpeakerButton';
import { getGrammar } from '@/lib/data';
import { GrammarItem } from '@/types/learning';
import { useProgress } from '@/hooks/useProgress';
import { Search, BookOpen } from 'lucide-react';

export default function Grammar() {
  const [currentView, setCurrentView] = useState<'list' | 'quiz' | 'detail'>('list');
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'all'>('all');
  const [learnedGrammar, setLearnedGrammar] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrammar, setSelectedGrammar] = useState<GrammarItem | null>(null);
  const { addXP, updateStreak } = useProgress();

  const allGrammar = getGrammar();
  const filteredGrammar = allGrammar.filter(grammar => {
    const matchesLevel = selectedLevel === 'all' || grammar.level === selectedLevel;
    const matchesSearch = grammar.structure.includes(searchTerm) || 
                         grammar.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grammar.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const quizQuestions = filteredGrammar.slice(0, 10).map(grammar => ({
    question: `What does "${grammar.structure}" mean?`,
    options: [
      grammar.meaning,
      allGrammar[Math.floor(Math.random() * allGrammar.length)].meaning,
      allGrammar[Math.floor(Math.random() * allGrammar.length)].meaning,
      allGrammar[Math.floor(Math.random() * allGrammar.length)].meaning,
    ].sort(() => Math.random() - 0.5),
    correctAnswer: 0,
    audioText: grammar.examples[0]?.japanese || '',
    explanation: grammar.explanation,
  }));

  const handleGrammarToggle = (grammar: GrammarItem) => {
    const newLearned = new Set(learnedGrammar);
    if (newLearned.has(grammar.id)) {
      newLearned.delete(grammar.id);
    } else {
      newLearned.add(grammar.id);
      addXP(20);
    }
    setLearnedGrammar(newLearned);
    updateStreak();
  };

  const handleGrammarClick = (grammar: GrammarItem) => {
    setSelectedGrammar(grammar);
    setCurrentView('detail');
  };

  const handleQuizComplete = (score: number) => {
    const xpReward = score * 35;
    addXP(xpReward);
    updateStreak();
    setCurrentView('list');
  };

  if (currentView === 'detail' && selectedGrammar) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Grammar Detail</h2>
            <p className="text-gray-600">{selectedGrammar.structure}</p>
          </div>
          <Button variant="outline" onClick={() => setCurrentView('list')} data-testid="back-to-list">
            Back to List
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-japanese text-2xl">{selectedGrammar.structure}</CardTitle>
              <Badge 
                variant="secondary" 
                className={selectedGrammar.level === 'N5' ? 'bg-n5/20 text-n5' : 'bg-n4/20 text-n4'}
              >
                {selectedGrammar.level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Meaning</h3>
              <p className="text-gray-700">{selectedGrammar.meaning}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Explanation</h3>
              <p className="text-gray-700">{selectedGrammar.explanation}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Examples</h3>
              <div className="space-y-4">
                {selectedGrammar.examples.map((example, index) => (
                  <Card key={index} className="border-l-4 border-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-japanese text-lg">{example.japanese}</p>
                        <SpeakerButton text={example.japanese} />
                      </div>
                      <p className="text-gray-600">{example.english}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => handleGrammarToggle(selectedGrammar)}
                data-testid="toggle-learned"
              >
                {learnedGrammar.has(selectedGrammar.id) ? 'Mark as Not Learned' : 'Mark as Learned'}
              </Button>
              <Button onClick={() => setCurrentView('quiz')} data-testid="practice-grammar">
                Practice with Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'quiz') {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Quiz
          questions={quizQuestions}
          title="Grammar Quiz"
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
          <h2 className="text-2xl font-bold text-gray-800">Grammar</h2>
          <p className="text-gray-600">Learn Japanese sentence structures</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setCurrentView('quiz')}
            disabled={filteredGrammar.length === 0}
            data-testid="start-quiz"
          >
            Take Quiz
          </Button>
        </div>
      </div>

      <Tabs defaultValue="patterns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patterns" data-testid="tab-patterns">Grammar Patterns</TabsTrigger>
          <TabsTrigger value="practice" data-testid="tab-practice">Practice</TabsTrigger>
          <TabsTrigger value="progress" data-testid="tab-progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grammar Patterns</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search grammar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4"
                    data-testid="search-grammar"
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
              <div className="space-y-4">
                {filteredGrammar.map(grammar => {
                  const isLearned = learnedGrammar.has(grammar.id);
                  return (
                    <Card
                      key={grammar.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isLearned ? 'border-purple-500 bg-purple-50' : ''
                      }`}
                      onClick={() => handleGrammarClick(grammar)}
                      data-testid={`grammar-${grammar.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-lg font-japanese font-medium">{grammar.structure}</span>
                              <Badge 
                                variant="secondary" 
                                className={grammar.level === 'N5' ? 'bg-n5/20 text-n5' : 'bg-n4/20 text-n4'}
                              >
                                {grammar.level}
                              </Badge>
                              {isLearned && (
                                <Badge variant="secondary" className="bg-purple-500/20 text-purple-500">
                                  ✓ Learned
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-700 mb-2">{grammar.meaning}</p>
                            <p className="text-sm text-gray-600 mb-3">{grammar.explanation}</p>
                            
                            {grammar.examples.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-700">Example:</p>
                                <div className="flex items-center space-x-2">
                                  <p className="text-sm font-japanese">{grammar.examples[0].japanese}</p>
                                  <SpeakerButton text={grammar.examples[0].japanese} size="sm" />
                                </div>
                                <p className="text-xs text-gray-500">{grammar.examples[0].english}</p>
                              </div>
                            )}
                          </div>
                          <BookOpen className="h-5 w-5 text-gray-400 ml-4" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {filteredGrammar.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No grammar patterns found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Grammar Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
                  alt="Japanese study materials"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600 text-sm mb-4">
                  Test your understanding of Japanese grammar structures
                </p>
                <Button
                  onClick={() => setCurrentView('quiz')}
                  className="w-full bg-purple-500 hover:bg-purple-600"
                  disabled={filteredGrammar.length === 0}
                  data-testid="start-quiz-practice"
                >
                  Start Grammar Quiz
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Study Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
                  alt="Japanese learning materials"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600 text-sm mb-4">
                  Browse through detailed explanations and examples
                </p>
                <p className="text-sm text-gray-500">
                  Click on any grammar pattern above to see detailed explanations and examples.
                </p>
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
                    <span>Total Grammar Learned:</span>
                    <span className="font-bold">{learnedGrammar.size}/{allGrammar.length}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(learnedGrammar.size / allGrammar.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-n5/10 rounded-lg">
                    <p className="text-2xl font-bold text-n5">
                      {learnedGrammar.size > 0 ? Math.round((Array.from(learnedGrammar).filter(id => allGrammar.find(g => g.id === id)?.level === 'N5').length / getGrammar('N5').length) * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-600">N5 Progress</p>
                  </div>
                  <div className="text-center p-4 bg-n4/10 rounded-lg">
                    <p className="text-2xl font-bold text-n4">
                      {learnedGrammar.size > 0 ? Math.round((Array.from(learnedGrammar).filter(id => allGrammar.find(g => g.id === id)?.level === 'N4').length / getGrammar('N4').length) * 100) : 0}%
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
