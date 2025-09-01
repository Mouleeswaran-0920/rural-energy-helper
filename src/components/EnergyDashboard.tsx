import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sun, 
  Wind, 
  Droplets, 
  Sprout, 
  Zap, 
  TrendingUp, 
  Users, 
  MapPin,
  Info,
  ArrowRight 
} from 'lucide-react';

interface EnergyScheme {
  id: string;
  name: string;
  description: string;
  subsidy: string;
  eligibility: string;
  type: 'solar' | 'wind' | 'hydro' | 'bio';
  status: 'active' | 'new' | 'limited';
}

interface EnergyStats {
  totalCapacity: string;
  ruralConnections: string;
  subsidyDistributed: string;
  activeSchemes: number;
}

const energySchemes: EnergyScheme[] = [
  {
    id: '1',
    name: 'PM-KUSUM (Solar Pumps)',
    description: 'Solar pumps for irrigation and drinking water',
    subsidy: 'Up to 60%',
    eligibility: 'Farmers with land ownership',
    type: 'solar',
    status: 'active'
  },
  {
    id: '2',
    name: 'Rooftop Solar Scheme',
    description: 'Solar panels for residential and commercial use',
    subsidy: '20-40%',
    eligibility: 'All building owners',
    type: 'solar',
    status: 'active'
  },
  {
    id: '3',
    name: 'Small Wind Energy',
    description: 'Wind turbines for rural electrification',
    subsidy: 'Up to 30%',
    eligibility: 'Communities with wind resources',
    type: 'wind',
    status: 'new'
  },
  {
    id: '4',
    name: 'Biogas Plant Scheme',
    description: 'Family-type biogas plants for cooking and lighting',
    subsidy: 'Rs. 10,000-15,000',
    eligibility: 'Rural households with cattle',
    type: 'bio',
    status: 'active'
  },
  {
    id: '5',
    name: 'Micro Hydro Power',
    description: 'Small-scale hydro power for remote villages',
    subsidy: 'Up to 50%',
    eligibility: 'Villages near water sources',
    type: 'hydro',
    status: 'limited'
  }
];

const energyStats: EnergyStats = {
  totalCapacity: '175 GW',
  ruralConnections: '28.5 Crore',
  subsidyDistributed: '₹12,450 Cr',
  activeSchemes: 25
};

const getEnergyIcon = (type: EnergyScheme['type']) => {
  switch (type) {
    case 'solar': return Sun;
    case 'wind': return Wind;
    case 'hydro': return Droplets;
    case 'bio': return Sprout;
    default: return Zap;
  }
};

const getEnergyColor = (type: EnergyScheme['type']) => {
  switch (type) {
    case 'solar': return 'text-energy-solar';
    case 'wind': return 'text-energy-wind';
    case 'hydro': return 'text-energy-hydro';
    case 'bio': return 'text-energy-bio';
    default: return 'text-primary';
  }
};

const getStatusColor = (status: EnergyScheme['status']) => {
  switch (status) {
    case 'active': return 'bg-primary text-primary-foreground';
    case 'new': return 'bg-accent text-accent-foreground';
    case 'limited': return 'bg-secondary text-secondary-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

interface EnergyDashboardProps {
  onSchemeSelect: (scheme: EnergyScheme) => void;
}

export const EnergyDashboard: React.FC<EnergyDashboardProps> = ({ onSchemeSelect }) => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-hero rounded-xl p-6 text-primary-foreground shadow-glow">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          Renewable Energy Assistant
        </h1>
        <p className="text-primary-foreground/90 mb-4">
          Government schemes and renewable energy solutions for rural India
        </p>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4" />
          <span>Government of India | Ministry of New & Renewable Energy</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Total Capacity</span>
            </div>
            <p className="text-xl font-bold text-primary">{energyStats.totalCapacity}</p>
            <p className="text-xs text-muted-foreground">Renewable Energy</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Rural Connections</span>
            </div>
            <p className="text-xl font-bold text-primary">{energyStats.ruralConnections}</p>
            <p className="text-xs text-muted-foreground">Households</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Subsidy Given</span>
            </div>
            <p className="text-xl font-bold text-primary">{energyStats.subsidyDistributed}</p>
            <p className="text-xs text-muted-foreground">This Year</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Active Schemes</span>
            </div>
            <p className="text-xl font-bold text-primary">{energyStats.activeSchemes}</p>
            <p className="text-xs text-muted-foreground">Available Now</p>
          </CardContent>
        </Card>
      </div>

      {/* Energy Schemes */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Government Energy Schemes
        </h2>
        <div className="grid gap-4">
          {energySchemes.map((scheme) => {
            const Icon = getEnergyIcon(scheme.type);
            return (
              <Card key={scheme.id} className="bg-gradient-card shadow-card hover:shadow-soft transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-primary-light/20`}>
                        <Icon className={`w-6 h-6 ${getEnergyColor(scheme.type)}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{scheme.name}</h3>
                        <Badge variant="secondary" className={getStatusColor(scheme.status)}>
                          {scheme.status === 'active' ? 'Active' : scheme.status === 'new' ? 'New' : 'Limited'}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSchemeSelect(scheme)}
                      className="hover:bg-primary-light"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">{scheme.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-primary">Subsidy: </span>
                      <span className="text-foreground">{scheme.subsidy}</span>
                    </div>
                    <div>
                      <span className="font-medium text-primary">Eligibility: </span>
                      <span className="text-foreground">{scheme.eligibility}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Energy Tips */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-primary animate-float" />
            Quick Energy Tips for Rural Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Solar Energy</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Best for areas with 300+ sunny days</li>
                <li>• Rooftop solar saves ₹1000+ monthly</li>
                <li>• 25-year lifespan with warranty</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Wind Energy</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Suitable for coastal and hilly areas</li>
                <li>• Works even during night time</li>
                <li>• Complements solar energy perfectly</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Biogas</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Perfect for cattle-owning families</li>
                <li>• Provides cooking gas and fertilizer</li>
                <li>• Reduces dependency on LPG</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Micro Hydro</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Ideal for mountainous regions</li>
                <li>• 24/7 power generation</li>
                <li>• Community-based solutions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};