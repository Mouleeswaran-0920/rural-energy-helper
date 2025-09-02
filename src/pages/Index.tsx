import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { EnergyDashboard } from '@/components/EnergyDashboard';
import { RenewableEnergyChat } from '@/components/RenewableEnergyChat';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'dashboard' | 'chat'>('dashboard');

  const [selectedScheme, setSelectedScheme] = useState<any>(null);

  const handleSchemeSelect = (scheme: any) => {
    setSelectedScheme(scheme);
    setActiveView('chat');
    toast({
      title: "Scheme Selected",
      description: `Switched to chat to learn more about ${scheme.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeView={activeView} onViewChange={setActiveView} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {activeView === 'dashboard' ? (
            <EnergyDashboard onSchemeSelect={handleSchemeSelect} />
          ) : (
            <div className="h-[calc(100vh-160px)]">
              <RenewableEnergyChat selectedScheme={selectedScheme} onSchemeProcessed={() => setSelectedScheme(null)} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
