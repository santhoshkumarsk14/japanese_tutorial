import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, MessageSquare, Volume2, Target, Clock, TrendingUp } from 'lucide-react';
import { Link } from "wouter";
import { getContentRoadmap, estimateStudyTime, N4_TARGET_REQUIREMENTS } from '@/lib/dataExpansion';

export default function ContentDashboard() {
  const roadmap = getContentRoadmap();
  const studyTime = estimateStudyTime(60); // 1 hour per day

  const contentAreas = [
    {
      name: 'Vocabulary',
      icon: BookOpen,
      data: roadmap.vocabulary,
      route: '/vocabulary',
      color: 'bg-blue-500',
      description: 'Essential words for daily conversation'
    },
    {
      name: 'Kanji',
      icon: Brain,
      data: roadmap.kanji,
      route: '/kanji',
      color: 'bg-purple-500',
      description: 'Characters with readings and meanings'
    },
    {
      name: 'Grammar',
      icon: MessageSquare,
      data: roadmap.grammar,
      route: '/grammar',
      color: 'bg-green-500',
      description: 'Grammar patterns and structures'
    },
    {
      name: 'Listening',
      icon: Volume2,
      data: roadmap.listening,
      route: '/practice',
      color: 'bg-orange-500',
      description: 'Audio comprehension exercises'
    }
  ];

  return (
    <div className="p-6 space-y-6" data-testid="content-dashboard">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            JLPT N4 Content Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your progress toward comprehensive N4 mastery
          </p>
        </div>
        
        {/* Study Time Estimate */}
        <Card className="border-primary/20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Estimated Study Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{studyTime.totalDays}</div>
                <div className="text-sm text-gray-600">Days (1hr/day)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.round(studyTime.totalMinutes / 60)}</div>
                <div className="text-sm text-gray-600">Total Hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{roadmap.vocabulary.remaining + roadmap.kanji.remaining}</div>
                <div className="text-sm text-gray-600">Items Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(((roadmap.vocabulary.progress + roadmap.kanji.progress + roadmap.grammar.progress + roadmap.listening.progress) / 4))}%
                </div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contentAreas.map((area) => (
          <Card key={area.name} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${area.color} text-white`}>
                    <area.icon className="w-5 h-5" />
                  </div>
                  {area.name}
                </div>
                <Badge 
                  variant={area.data.priority === 'high' ? 'destructive' : area.data.priority === 'medium' ? 'default' : 'secondary'}
                >
                  {area.data.priority} priority
                </Badge>
              </CardTitle>
              <CardDescription>{area.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{area.data.current} / {area.data.target}</span>
                </div>
                <Progress value={area.data.progress} className="h-2" />
                <div className="text-xs text-gray-500">
                  {area.data.remaining} items remaining ({area.data.progress}% complete)
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div className="text-sm text-gray-600">
                  Target: {area.data.target} items
                </div>
                <Link href={area.route}>
                  <Button variant="outline" size="sm">
                    Study Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quiz System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Quiz System Status
          </CardTitle>
          <CardDescription>
            Comprehensive testing system for all content areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="font-semibold">Vocabulary Quizzes</div>
              <div className="text-sm text-gray-600">Available: 25 questions</div>
              <div className="text-sm text-gray-600">Target: 1,000 questions</div>
              <Progress value={2.5} className="mt-2" />
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-semibold">Kanji Quizzes</div>
              <div className="text-sm text-gray-600">Available: 25 questions</div>
              <div className="text-sm text-gray-600">Target: 1,000 questions</div>
              <Progress value={2.5} className="mt-2" />
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-semibold">Grammar Quizzes</div>
              <div className="text-sm text-gray-600">Available: 25 questions</div>
              <div className="text-sm text-gray-600">Target: 1,000 questions</div>
              <Progress value={2.5} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Expand Vocabulary Database</div>
                <div className="text-sm text-gray-600">Add {roadmap.vocabulary.remaining} more words to reach 1,500 target</div>
              </div>
              <Badge variant="destructive">High Priority</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Expand Kanji Collection</div>
                <div className="text-sm text-gray-600">Add {roadmap.kanji.remaining} more characters to reach 300 target</div>
              </div>
              <Badge variant="destructive">High Priority</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Create Quiz Questions</div>
                <div className="text-sm text-gray-600">Generate 1,000 questions for each category (vocabulary, kanji, grammar)</div>
              </div>
              <Badge variant="default">Medium Priority</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}