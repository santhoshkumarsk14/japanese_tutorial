import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Clock, Target, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";
import { useProgress } from "@/hooks/useProgress";

interface StudyRequirement {
  area: string;
  target: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  progress?: number;
}

const getN4Requirements = (progress: any): StudyRequirement[] => [
  {
    area: "Vocabulary",
    target: "1,500 words",
    description: "Essential words for daily conversation and basic texts",
    icon: BookOpen,
    route: "/vocabulary",
    progress: Math.round((progress.vocabularyLearned / 1500) * 100)
  },
  {
    area: "Kanji",
    target: "250-300 characters",
    description: "Including all N5 kanji plus N4 level characters",
    icon: Brain,
    route: "/kanji", 
    progress: Math.round((progress.kanjiLearned / 300) * 100)
  },
  {
    area: "Grammar",
    target: "130-132 patterns",
    description: "Basic to intermediate grammar structures",
    icon: Target,
    route: "/grammar",
    progress: Math.round((progress.grammarLearned / 130) * 100)
  },
  {
    area: "Listening",
    target: "Daily conversations",
    description: "Simple dialogs, instructions, and short conversations",
    icon: Users,
    route: "/practice",
    progress: 15
  },
  {
    area: "Reading",
    target: "Everyday texts",
    description: "Notices, passages, and straightforward written materials", 
    icon: TrendingUp,
    route: "/reading",
    progress: Math.round((progress.readingComplete / 20) * 100)
  }
];

const STUDY_DURATION_OPTIONS = [
  {
    pace: "Regular (1 hour/day)",
    duration: "1.5-2 years",
    totalHours: "550-730 hours",
    description: "Steady progress with consistent daily practice"
  },
  {
    pace: "Intensive (2+ hours/day)", 
    duration: "8-12 months",
    totalHours: "730-1000 hours",
    description: "Accelerated learning for dedicated students"
  }
];

export default function N4StudyPlan() {
  const { progress } = useProgress();
  const overallProgress = Math.round((progress.hiraganaComplete + progress.katakanaComplete + progress.vocabularyLearned + progress.kanjiLearned + progress.grammarLearned + progress.readingComplete) / 6);
  const N4_REQUIREMENTS = getN4Requirements(progress);

  return (
    <div className="p-6 max-w-6xl mx-auto" data-testid="n4-study-plan-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="page-title">
          JLPT N4 Study Plan (2025)
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300" data-testid="page-description">
          Your comprehensive guide to passing the JLPT N4 exam
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="mb-8" data-testid="overall-progress-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Overall Study Progress
          </CardTitle>
          <CardDescription>
            Track your progress across all N4 study areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Total Progress</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" data-testid="overall-progress-bar" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div className="p-2" data-testid="progress-vocabulary">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round((progress.vocabularyLearned / 1500) * 100)}%
                </div>
                <div className="text-xs text-gray-500">Vocabulary</div>
              </div>
              <div className="p-2" data-testid="progress-kanji">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round((progress.kanjiLearned / 300) * 100)}%
                </div>
                <div className="text-xs text-gray-500">Kanji</div>
              </div>
              <div className="p-2" data-testid="progress-grammar">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round((progress.grammarLearned / 130) * 100)}%
                </div>
                <div className="text-xs text-gray-500">Grammar</div>
              </div>
              <div className="p-2" data-testid="progress-listening">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">15%</div>
                <div className="text-xs text-gray-500">Listening</div>
              </div>
              <div className="p-2" data-testid="progress-reading">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round((progress.readingComplete / 20) * 100)}%
                </div>
                <div className="text-xs text-gray-500">Reading</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Requirements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {N4_REQUIREMENTS.map((requirement) => {
          const IconComponent = requirement.icon;
          return (
            <Card key={requirement.area} className="hover:shadow-lg transition-shadow" data-testid={`card-${requirement.area.toLowerCase()}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  {requirement.area}
                </CardTitle>
                <CardDescription>
                  Target: <Badge variant="secondary" data-testid={`target-${requirement.area.toLowerCase()}`}>{requirement.target}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {requirement.description}
                </p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{requirement.progress}%</span>
                    </div>
                    <Progress value={requirement.progress} className="h-2" />
                  </div>
                  <Link href={requirement.route}>
                    <Button className="w-full" data-testid={`study-${requirement.area.toLowerCase()}-button`}>
                      Study {requirement.area}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Study Duration Guide */}
      <Card className="mb-8" data-testid="study-duration-card">
        <CardHeader>
          <CardTitle>Study Duration Guide</CardTitle>
          <CardDescription>
            Choose your study pace based on your available time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {STUDY_DURATION_OPTIONS.map((option, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800" data-testid={`duration-option-${index}`}>
                <h3 className="font-semibold text-lg mb-2">{option.pace}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <Badge variant="outline">{option.duration}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Hours:</span>
                    <Badge variant="outline">{option.totalHours}</Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-3">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips and Resources */}
      <Card data-testid="tips-resources-card">
        <CardHeader>
          <CardTitle>Study Tips & Resources</CardTitle>
          <CardDescription>
            Recommended approaches for effective N4 preparation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Effective Study Methods</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  Use spaced repetition for vocabulary and kanji
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  Practice listening daily with native content
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  Read simple texts and news articles
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  Practice writing sentences with new grammar
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Recommended Books</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  Shinkanzen Master N4 (All skills)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  Speed Master N4 (Quick review)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  Nihongo Challenge N4-N5 (Listening)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  JLPT N4 Practice Tests
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}