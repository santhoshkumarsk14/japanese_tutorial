import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Menu,
  BarChart3,
  BookOpen,
  Languages,
  Gamepad2,
  FileText,
  Brain,
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';

const navigationItems = [
  { href: '/', label: 'Dashboard', icon: BarChart3, testId: 'nav-dashboard' },
  { href: '/hiragana', label: 'Hiragana', icon: () => <span className="w-5 text-center font-japanese">あ</span>, testId: 'nav-hiragana' },
  { href: '/katakana', label: 'Katakana', icon: () => <span className="w-5 text-center font-japanese">ア</span>, testId: 'nav-katakana' },
  { href: '/vocabulary', label: 'Words', icon: BookOpen, testId: 'nav-words' },
  { href: '/kanji', label: 'Kanji', icon: () => <span className="w-5 text-center font-japanese">漢</span>, testId: 'nav-kanji' },
  { href: '/grammar', label: 'Grammar', icon: Languages, testId: 'nav-grammar' },
  { href: '/reading', label: 'Reading', icon: FileText, testId: 'nav-reading' },
  { href: '/practice', label: 'Practice', icon: Gamepad2, testId: 'nav-practice' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [location] = useLocation();
  const { progress } = useProgress();

  const levelProgress = (progress.xp % 1000) / 10;

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 border-r border-gray-200`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 relative">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">J</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-800">JLearner</h1>
              <p className="text-sm text-gray-500">Master Japanese</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-6 right-4 p-2"
          onClick={() => setIsCollapsed(!isCollapsed)}
          data-testid="sidebar-toggle"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1">
        {navigationItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full justify-start ${isCollapsed ? 'px-3' : 'px-3'} ${
                  isActive ? 'bg-blue-50 text-primary hover:bg-blue-100' : 'text-gray-700 hover:bg-gray-100'
                }`}
                data-testid={item.testId}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Progress Section */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <img 
                src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40" 
                alt="Student avatar" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm">Study Streak</p>
                <p className="text-sm text-gray-500">{progress.streak} days 🔥</p>
              </div>
            </div>
            
            <Progress value={levelProgress} className="h-2" />
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Level {progress.level} - {progress.xp}/1000 XP
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
