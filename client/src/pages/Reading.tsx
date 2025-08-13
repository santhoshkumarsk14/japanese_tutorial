import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import SpeakerButton from '@/components/SpeakerButton';
import { getReadingPassages } from '@/lib/data';
import { ReadingPassage } from '@/types/learning';
import { useProgress } from '@/hooks/useProgress';
import { Clock, BookOpen } from 'lucide-react';

export default function Reading() {
  const [currentView, setCurrentView] = useState<'list' | 'reading' | 'complete'>('list');
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'all'>('all');
  const [currentPassage, setCurrentPassage] = useState<ReadingPassage | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [completedPassages, setCompletedPassages] = useState<Set<string>>(new Set());
  const { addXP, updateStreak } = useProgress();

  const allPassages = getReadingPassages();
  const filteredPassages = allPassages.filter(passage => 
    selectedLevel === 'all' || passage.level === selectedLevel
  );

  const handlePassageClick = (passage: ReadingPassage) => {
    setCurrentPassage(passage);
    setCurrentView('reading');
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (!currentPassage) return;
    
    if (currentQuestionIndex < currentPassage.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Show results
      setShowResults(true);
      setCurrentView('complete');
      
      // Calculate score
      const correctAnswers = selectedAnswers.filter((answer, index) => 
        answer === currentPassage.questions[index].correctAnswer
      ).length;
      
      // Award XP
      const xpReward = correctAnswers * 40;
      addXP(xpReward);
      updateStreak();
      
      // Mark as completed
      const newCompleted = new Set(completedPassages);
      newCompleted.add(currentPassage.id);
      setCompletedPassages(newCompleted);
    }
  };

  const getScore = () => {
    if (!currentPassage) return 0;
    return selectedAnswers.filter((answer, index) => 
      answer === currentPassage.questions[index].correctAnswer
    ).length;
  };

  if (currentView === 'complete' && currentPassage) {
    const score = getScore();
    const totalQuestions = currentPassage.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Reading Complete!</CardTitle>
            <p className="text-gray-600">{currentPassage.title}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{score}/{totalQuestions}</div>
              <div className="text-lg text-gray-600 mb-4">{percentage}% Correct</div>
              <Progress value={percentage} className="w-full mb-4" />
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Results:</h3>
              {currentPassage.questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <Card key={index} className={`border-l-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                    <CardContent className="p-4">
                      <p className="font-medium mb-2">{question.question}</p>
                      <div className="space-y-1 text-sm">
                        <p className={`${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          Your answer: {question.options[userAnswer]}
                        </p>
                        {!isCorrect && (
                          <p className="text-green-600">
                            Correct answer: {question.options[question.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setCurrentView('list')} className="flex-1" data-testid="back-to-list">
                Back to List
              </Button>
              <Button onClick={() => handlePassageClick(currentPassage)} className="flex-1" data-testid="read-again">
                Read Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'reading' && currentPassage) {
    const currentQuestion = currentPassage.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentPassage.questions.length) * 100;
    
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{currentPassage.title}</h2>
            <p className="text-gray-600">Question {currentQuestionIndex + 1} of {currentPassage.questions.length}</p>
          </div>
          <Button variant="outline" onClick={() => setCurrentView('list')} data-testid="back-to-list">
            Back to List
          </Button>
        </div>

        <Progress value={progress} className="w-full" />

        {currentQuestionIndex === 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reading Passage</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className={currentPassage.level === 'N5' ? 'bg-n5/20 text-n5' : 'bg-n4/20 text-n4'}>
                    {currentPassage.level}
                  </Badge>
                  <SpeakerButton text={currentPassage.content} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-japanese text-lg leading-relaxed">{currentPassage.content}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">{currentQuestion.question}</p>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswers[currentQuestionIndex] === index ? 'default' : 'outline'}
                  className="w-full p-4 text-left justify-start h-auto"
                  onClick={() => handleAnswerSelect(index)}
                  data-testid={`answer-option-${index}`}
                >
                  {String.fromCharCode(65 + index)}) {option}
                </Button>
              ))}
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                data-testid="previous-question"
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
                data-testid="next-question"
              >
                {currentQuestionIndex === currentPassage.questions.length - 1 ? 'Finish' : 'Next Question'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reading</h2>
          <p className="text-gray-600">Practice comprehension skills</p>
        </div>
      </div>

      <Tabs defaultValue="passages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="passages" data-testid="tab-passages">Reading Passages</TabsTrigger>
          <TabsTrigger value="practice" data-testid="tab-practice">Practice Tips</TabsTrigger>
          <TabsTrigger value="progress" data-testid="tab-progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="passages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reading Passages</CardTitle>
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
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPassages.map(passage => {
                  const isCompleted = completedPassages.has(passage.id);
                  return (
                    <Card
                      key={passage.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isCompleted ? 'border-green-500 bg-green-50' : ''
                      }`}
                      onClick={() => handlePassageClick(passage)}
                      data-testid={`passage-${passage.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold">{passage.title}</h3>
                              <Badge 
                                variant="secondary" 
                                className={passage.level === 'N5' ? 'bg-n5/20 text-n5' : 'bg-n4/20 text-n4'}
                              >
                                {passage.level}
                              </Badge>
                              {isCompleted && (
                                <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                                  ✓ Completed
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {passage.content.substring(0, 100)}...
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <BookOpen className="h-4 w-4" />
                                <span>{passage.questions.length} questions</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>~5 min</span>
                              </div>
                            </div>
                          </div>
                          <SpeakerButton text={passage.content} size="md" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {filteredPassages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reading passages found for the selected level.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Reading Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
                  alt="Japanese reading materials"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>• Read the questions first to know what to look for</li>
                  <li>• Don't worry about understanding every word</li>
                  <li>• Look for context clues and familiar kanji</li>
                  <li>• Practice reading aloud to improve fluency</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comprehension Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
                  alt="Japanese study materials"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>• Skim the passage for general meaning first</li>
                  <li>• Identify key information for each question</li>
                  <li>• Use elimination method for multiple choice</li>
                  <li>• Pay attention to time expressions and numbers</li>
                </ul>
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
                    <span>Passages Completed:</span>
                    <span className="font-bold">{completedPassages.size}/{allPassages.length}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(completedPassages.size / allPassages.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-n5/10 rounded-lg">
                    <p className="text-2xl font-bold text-n5">
                      {completedPassages.size > 0 ? Math.round((Array.from(completedPassages).filter(id => allPassages.find(p => p.id === id)?.level === 'N5').length / getReadingPassages('N5').length) * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-600">N5 Progress</p>
                  </div>
                  <div className="text-center p-4 bg-n4/10 rounded-lg">
                    <p className="text-2xl font-bold text-n4">
                      {completedPassages.size > 0 ? Math.round((Array.from(completedPassages).filter(id => allPassages.find(p => p.id === id)?.level === 'N4').length / getReadingPassages('N4').length) * 100) : 0}%
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
