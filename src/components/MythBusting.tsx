import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  Sun, 
  IndianRupee, 
  Droplets,
  Shield,
  Zap,
  TreePine,
  Clock,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Myth {
  id: string;
  category: 'solar' | 'wind' | 'biogas' | 'general' | 'cost';
  myth: string;
  reality: string;
  icon: any;
  explanation: string;
}

const myths: Myth[] = [
  {
    id: '1',
    category: 'solar',
    myth: 'Solar panels don\'t work on cloudy days',
    reality: 'They still produce 10–25% power under clouds',
    icon: Sun,
    explanation: 'Solar panels work with diffused sunlight too. Germany generates lots of solar power despite cloudy weather.'
  },
  {
    id: '2',
    category: 'cost',
    myth: 'Solar is too expensive for villagers',
    reality: 'Subsidies and loans reduce cost by 40–60%',
    icon: IndianRupee,
    explanation: 'Government provides 30% subsidy + easy EMI options. Many villagers pay less than their electricity bills.'
  },
  {
    id: '3',
    category: 'biogas',
    myth: 'Biogas smells bad and is unsafe',
    reality: 'Modern plants are odorless and completely safe',
    icon: Shield,
    explanation: 'Properly built biogas plants have no smell. They are safer than LPG cylinders and produce clean cooking gas.'
  },
  {
    id: '4',
    category: 'solar',
    myth: 'Solar panels need constant cleaning',
    reality: 'Rain cleans them naturally, minimal maintenance needed',
    icon: Droplets,
    explanation: 'Monsoon rains keep panels clean. Only need cleaning 2-3 times per year with water and soft cloth.'
  },
  {
    id: '5',
    category: 'wind',
    myth: 'Wind turbines are very noisy',
    reality: 'Modern turbines are quieter than traffic noise',
    icon: Zap,
    explanation: 'New wind turbines produce less than 40 decibels of sound, quieter than normal conversation.'
  },
  {
    id: '6',
    category: 'general',
    myth: 'Renewable energy is unreliable',
    reality: 'Works 24/7 with proper battery backup',
    icon: Clock,
    explanation: 'Solar + battery systems provide power day and night. Wind works even when solar doesn\'t.'
  },
  {
    id: '7',
    category: 'cost',
    myth: 'Maintenance costs are very high',
    reality: 'Minimal maintenance, saves money long-term',
    icon: IndianRupee,
    explanation: 'Solar panels last 25+ years with minimal maintenance. Saves more money than conventional electricity.'
  },
  {
    id: '8',
    category: 'solar',
    myth: 'Solar doesn\'t work in monsoon',
    reality: 'Still produces 40-60% power during monsoon',
    icon: Droplets,
    explanation: 'Even during heavy monsoon, solar panels produce significant power. India\'s solar plants work year-round.'
  },
  {
    id: '9',
    category: 'biogas',
    myth: 'Biogas requires too much cow dung',
    reality: 'Just 2-3 cows can run a family biogas plant',
    icon: TreePine,
    explanation: 'A small family needs only 10-15 kg cow dung daily for cooking gas. Most rural families have enough.'
  },
  {
    id: '10',
    category: 'general',
    myth: 'Technology is too complex for villages',
    reality: 'Simple to use, works like normal electricity',
    icon: Zap,
    explanation: 'Renewable energy systems work automatically. Just switch on/off like regular electricity connection.'
  }
];

const categories = [
  { key: 'all', label: 'All Myths', icon: Search },
  { key: 'solar', label: 'Solar Energy', icon: Sun },
  { key: 'cost', label: 'Cost & Money', icon: IndianRupee },
  { key: 'biogas', label: 'Biogas', icon: TreePine },
  { key: 'wind', label: 'Wind Energy', icon: Zap },
  { key: 'general', label: 'General', icon: Shield }
];

export const MythBusting: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredMyths = myths.filter(myth => {
    const matchesSearch = 
      myth.myth.toLowerCase().includes(searchTerm.toLowerCase()) ||
      myth.reality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      myth.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || myth.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="w-6 h-6 text-primary" />
            Myth vs Reality
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Common myths about renewable energy and the truth behind them
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search myths and facts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.key)}
                className="gap-2"
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Myths Grid */}
      <div className="grid gap-4">
        {filteredMyths.map((myth) => (
          <Card key={myth.id} className="bg-gradient-card shadow-card hover:shadow-soft transition-all duration-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Category Badge */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="gap-1">
                    <myth.icon className="w-3 h-3" />
                    {myth.category.charAt(0).toUpperCase() + myth.category.slice(1)}
                  </Badge>
                </div>

                {/* Myth */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-red-800 font-medium text-sm">❌ MYTH</span>
                      </div>
                      <p className="text-red-700 font-medium">{myth.myth}</p>
                    </div>
                  </div>
                </div>

                {/* Reality */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-green-800 font-medium text-sm">✅ REALITY</span>
                      </div>
                      <p className="text-green-700 font-medium">{myth.reality}</p>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <myth.icon className="w-5 h-5 text-blue-600 mt-0.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-blue-800 font-medium text-sm">💡 EXPLANATION</span>
                      </div>
                      <p className="text-blue-700 text-sm">{myth.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredMyths.length === 0 && (
        <Card className="bg-muted/20">
          <CardContent className="p-8 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No myths found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search terms or category filter
            </p>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-primary mb-2">
            Still have questions?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Talk to our AI assistant or get connected with verified renewable energy experts
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              Ask AI Assistant
            </Button>
            <Button size="sm">
              Contact Expert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};