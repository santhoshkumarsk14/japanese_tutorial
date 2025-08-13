import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Bell, Settings } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search words, kanji..."
              className="pl-10 pr-4 py-2 w-64"
              data-testid="search-input"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          
          <Button variant="ghost" size="sm" data-testid="notifications-button">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="sm" data-testid="settings-button">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
