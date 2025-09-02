import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ecologyIcon from '@/assets/ecology-icon.png';

interface HeaderProps {
  activeView: 'dashboard' | 'chat';
  onViewChange: (view: 'dashboard' | 'chat') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-gradient-primary shadow-soft border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/10 rounded-lg">
              <img src={ecologyIcon} alt="Ecology Icon" className="w-8 h-8 animate-pulse-glow" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">
                Rural Energy Helper
              </h1>
              <p className="text-primary-foreground/80 text-sm">
                Renewable Energy Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={activeView === 'dashboard' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('dashboard')}
              className={activeView === 'dashboard' 
                ? 'bg-primary-foreground text-primary' 
                : 'text-primary-foreground hover:bg-primary-foreground/10'
              }
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeView === 'chat' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('chat')}
              className={activeView === 'chat' 
                ? 'bg-primary-foreground text-primary' 
                : 'text-primary-foreground hover:bg-primary-foreground/10'
              }
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              AI Chat
            </Button>
          </div>

          {/* User Menu */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20">
                <div className="w-6 h-6 bg-primary-foreground/20 rounded-full flex items-center justify-center text-primary-foreground text-xs font-medium">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-primary-foreground hidden sm:inline-block truncate max-w-[120px]">
                  {user.email?.split('@')[0] || 'User'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="gap-2 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline-block">Sign Out</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};