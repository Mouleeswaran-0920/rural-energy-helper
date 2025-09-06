import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { EnergyDashboard } from '@/components/EnergyDashboard';
import { EnhancedChat } from '@/components/EnhancedChat';
import { CO2Tracker } from '@/components/CO2Tracker';
import { EnergySavingsCalculator } from '@/components/EnergySavingsCalculator';
import { MythBusting } from '@/components/MythBusting';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'dashboard' | 'chat' | 'co2-tracker' | 'energy-calculator' | 'myth-busting'>('dashboard');

  const [selectedScheme, setSelectedScheme] = useState<any>(null);

  const handleSchemeSelect = (scheme: any) => {
    setSelectedScheme(scheme);
    setActiveView('chat');
    toast({
      title: "Scheme Selected",
      description: `Switched to chat to learn more about ${scheme.name}`,
    });
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <EnergyDashboard onSchemeSelect={handleSchemeSelect} />;
      case 'chat':
        return (
          <div className="h-[calc(100vh-160px)]">
            <EnhancedChat selectedScheme={selectedScheme} onSchemeProcessed={() => setSelectedScheme(null)} />
          </div>
        );
      case 'co2-tracker':
        return <CO2Tracker />;
      case 'energy-calculator':
        return <EnergySavingsCalculator />;
      case 'myth-busting':
        return <MythBusting />;
      default:
        return <EnergyDashboard onSchemeSelect={handleSchemeSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeView={activeView} onViewChange={setActiveView} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
};

export default Index;
