import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProgressRing from '@/components/ProgressRing';
import { useProgress } from '@/hooks/useProgress';
import { Link } from 'wouter';
import { CheckCircle, Clock, TrendingUp, Flame, Star, BookOpen, Brain, FileText, Gamepad2 } from 'lucide-react';

export default function Dashboard() {
  const { progress } = useProgress();

  const modules = [
    {
      name: 'Hiragana',
      icon: () => <span className="text-2xl font-japanese text-n5">あ</span>,
      progress: (progress.hiraganaComplete / 46) * 100,
      completed: progress.hiraganaComplete,
      total: 46,
      status: 'COMPLETE',
      color: 'var(--n5)',
      href: '/hiragana',
      bgColor: 'bg-n5/10',
      textColor: 'text-n5',
    },
    {
      name: 'Katakana',
      icon: () => <span className="text-2xl font-japanese text-n4">ア</span>,
      progress: (progress.katakanaComplete / 46) * 100,
      completed: progress.katakanaComplete,
      total: 46,
      status: 'IN PROGRESS',
      color: 'var(--n4)',
      href: '/katakana',
      bgColor: 'bg-n4/10',
      textColor: 'text-n4',
    },
    {
      name: 'Vocabulary',
      icon: BookOpen,
      progress: (progress.vocabularyLearned / 340) * 100,
      completed: progress.vocabularyLearned,
      total: 340,
      status: 'ACTIVE',
      color: 'var(--primary)',
      href: '/vocabulary',
      bgColor: 'bg-primary/10',
      textColor: 'text-primary',
    },
    {
      name: 'Kanji',
      icon: () => <span className="text-2xl font-japanese text-secondary">漢</span>,
      progress: (progress.kanjiLearned / 103) * 100,
      completed: progress.kanjiLearned,
      total: 103,
      status: 'LEARNING',
      color: 'var(--secondary)',
      href: '/kanji',
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary',
    },
    {
      name: 'Grammar',
      icon: Brain,
      progress: (progress.grammarLearned / 52) * 100,
      completed: progress.grammarLearned,
      total: 52,
      status: 'NEW',
      color: 'hsl(258, 90%, 66%)',
      href: '/grammar',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-500',
    },
    {
      name: 'Reading',
      icon: FileText,
      progress: 0,
      completed: 0,
      total: 25,
      status: 'LOCKED',
      color: 'hsl(231, 48%, 48%)',
      href: '/reading',
      bgColor: 'bg-indigo-500/10',
      textColor: 'text-indigo-500',
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.slice(0, 4).map((module) => (
          <Card key={module.name} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">{module.name}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {module.completed}/{module.total}
                  </p>
                </div>
                <ProgressRing
                  progress={module.progress}
                  color={module.color}
                  size={64}
                >
                  <module.icon />
                </ProgressRing>
              </div>
              
              <div className="flex items-center text-sm">
                {module.status === 'COMPLETE' && (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1 text-accent" />
                    <span className="text-accent font-medium">Complete</span>
                  </>
                )}
                {module.status === 'IN PROGRESS' && (
                  <>
                    <Clock className="h-4 w-4 mr-1 text-n4" />
                    <span className="text-n4 font-medium">{Math.round(module.progress)}% Complete</span>
                  </>
                )}
                {module.status === 'ACTIVE' && (
                  <>
                    <TrendingUp className="h-4 w-4 mr-1 text-primary" />
                    <span className="text-primary font-medium">{Math.round(module.progress)}% Complete</span>
                  </>
                )}
                {module.status === 'LEARNING' && (
                  <>
                    <Flame className="h-4 w-4 mr-1 text-secondary" />
                    <span className="text-secondary font-medium">{Math.round(module.progress)}% Complete</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Lesson */}
              <div className="bg-gradient-to-r from-primary to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-blue-100 mb-1">Next Up: Katakana Practice</p>
                    <h4 className="text-xl font-semibold mb-2">Master キ, ク, ケ, コ</h4>
                    <p className="text-blue-100 mb-4">4 characters remaining</p>
                    <Link href="/katakana">
                      <Button className="bg-white text-primary hover:bg-blue-50" data-testid="continue-learning">
                        Continue Learning
                      </Button>
                    </Link>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
                    alt="Japanese learning materials"
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-n5 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-japanese">あ</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Completed Hiragana Set 1</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-accent" />
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Practiced N5 Vocabulary</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                    <Star className="h-5 w-5 text-n4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Challenge */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Challenge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"
                alt="Japanese flashcards"
                className="w-24 h-24 mx-auto rounded-lg object-cover mb-3"
              />
              <h4 className="font-semibold text-gray-800">Flashcard Blitz</h4>
              <p className="text-sm text-gray-600 mb-4">Review 20 vocabulary words in under 5 minutes</p>
            </div>
            
            <div className="bg-gradient-to-r from-accent to-green-600 rounded-lg p-4 text-white text-center">
              <p className="text-sm text-green-100">Reward</p>
              <p className="text-lg font-bold">+50 XP</p>
            </div>
            
            <Link href="/practice">
              <Button className="w-full" data-testid="start-challenge">
                Start Challenge
              </Button>
            </Link>
            
            <p className="text-xs text-gray-500 text-center">Challenge resets in 18:43:21</p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          const isLocked = module.status === 'LOCKED';
          
          return (
            <Card key={module.name} className="module-card group hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${module.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon />
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${module.bgColor} ${module.textColor} text-xs font-medium`}
                  >
                    {module.status}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{module.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {module.name === 'Hiragana' && 'Master all 46 basic hiragana characters plus combinations'}
                  {module.name === 'Katakana' && 'Learn all 46 katakana characters for foreign words'}
                  {module.name === 'Vocabulary' && '1000+ essential words for N5 and N4 levels'}
                  {module.name === 'Kanji' && '300+ essential kanji with readings and meanings'}
                  {module.name === 'Grammar' && '120+ grammar structures with examples'}
                  {module.name === 'Reading' && 'Comprehension passages with questions'}
                </p>
                
                <div className="bg-gray-100 rounded-full h-2 mb-4">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${module.progress}%`,
                      backgroundColor: module.color,
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-gray-500">{module.completed}/{module.total} {module.name === 'Vocabulary' ? 'words' : module.name === 'Reading' ? 'passages' : module.name === 'Grammar' ? 'patterns' : 'characters'}</span>
                  <span className={`font-medium ${module.textColor}`}>
                    {Math.round(module.progress)}%
                  </span>
                </div>
                
                <Link href={module.href}>
                  <Button
                    className={`w-full ${isLocked ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300' : ''}`}
                    style={{ backgroundColor: isLocked ? undefined : module.color }}
                    disabled={isLocked}
                    data-testid={`module-${module.name.toLowerCase()}`}
                  >
                    {isLocked ? 'Unlock at Level 15' : 
                     module.status === 'COMPLETE' ? 'Review' : 
                     module.status === 'IN PROGRESS' || module.status === 'ACTIVE' ? 'Continue' : 
                     module.status === 'LEARNING' ? 'Practice' : 'Learn'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
