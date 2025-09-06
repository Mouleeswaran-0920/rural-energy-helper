import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, LayoutDashboard, Leaf, Calculator, HelpCircle } from 'lucide-react';
import ecologyIcon from '@/assets/ecology-icon.png';

interface HeaderProps {
  activeView: 'dashboard' | 'chat' | 'co2-tracker' | 'energy-calculator' | 'myth-busting';
  onViewChange: (view: 'dashboard' | 'chat' | 'co2-tracker' | 'energy-calculator' | 'myth-busting') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
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

          <div className="flex items-center gap-1 overflow-x-auto">
            <Button
              variant={activeView === 'dashboard' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('dashboard')}
              className={activeView === 'dashboard' 
                ? 'bg-primary-foreground text-primary' 
                : 'text-primary-foreground hover:bg-primary-foreground/10'
              }
            >
              <LayoutDashboard className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
            <Button
              variant={activeView === 'co2-tracker' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('co2-tracker')}
              className={activeView === 'co2-tracker' 
                ? 'bg-primary-foreground text-primary' 
                : 'text-primary-foreground hover:bg-primary-foreground/10'
              }
            >
              <Leaf className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">CO₂ Tracker</span>
            </Button>
            <Button
              variant={activeView === 'energy-calculator' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('energy-calculator')}
              className={activeView === 'energy-calculator' 
                ? 'bg-primary-foreground text-primary' 
                : 'text-primary-foreground hover:bg-primary-foreground/10'
              }
            >
              <Calculator className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Calculator</span>
            </Button>
            <Button
              variant={activeView === 'myth-busting' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('myth-busting')}
              className={activeView === 'myth-busting' 
                ? 'bg-primary-foreground text-primary' 
                : 'text-primary-foreground hover:bg-primary-foreground/10'
              }
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Myths</span>
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
              <MessageCircle className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">AI Chat</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};