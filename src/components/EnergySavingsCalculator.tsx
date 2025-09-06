import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Calculator, 
  Sun, 
  Zap, 
  TrendingUp, 
  Clock, 
  IndianRupee,
  Lightbulb,
  Fan,
  Tv,
  Refrigerator,
  Brain,
  Sparkles
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const API_KEY = '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';

interface Appliance {
  name: string;
  icon: any;
  power: number; // watts
  hoursPerDay: number;
}

interface SavingsData {
  systemSize: number;
  monthlySavings: number;
  paybackPeriod: number;
  fiveYearSavings: number;
  tenYearSavings: number;
  systemCost: number;
  subsidy: number;
  netCost: number;
  aiRecommendation?: string;
}

const appliances: Appliance[] = [
  { name: 'Fan', icon: Fan, power: 75, hoursPerDay: 12 },
  { name: 'TV', icon: Tv, power: 150, hoursPerDay: 5 },
  { name: 'Refrigerator', icon: Refrigerator, power: 200, hoursPerDay: 24 },
  { name: 'Water Pump', icon: Zap, power: 1000, hoursPerDay: 2 },
  { name: 'LED Lights (5)', icon: Lightbulb, power: 50, hoursPerDay: 6 }
];

export const EnergySavingsCalculator: React.FC = () => {
  const { toast } = useToast();
  const [monthlyBill, setMonthlyBill] = useState<string>('');
  const [monthlyUnits, setMonthlyUnits] = useState<string>('');
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [savingsData, setSavingsData] = useState<SavingsData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Pricing constants
  const COST_PER_KW = 50000; // Cost per kW of solar system
  const SUBSIDY_RATE = 0.3; // 30% subsidy
  const ELECTRICITY_TARIFF = 6; // Rs per kWh
  const ANNUAL_INFLATION = 0.05; // 5% annual electricity price increase
  const SYSTEM_DEGRADATION = 0.005; // 0.5% annual system degradation

  const getAIRecommendation = async (data: Omit<SavingsData, 'aiRecommendation'>) => {
    try {
      const prompt = `Based on this solar system analysis:
- System Size: ${data.systemSize} kW
- Monthly Bill: ₹${monthlyBill || 'Not specified'}
- Monthly Units: ${monthlyUnits || 'Calculated'} kWh
- Selected Appliances: ${selectedAppliances.join(', ') || 'None specified'}
- Monthly Savings: ₹${data.monthlySavings}
- Payback Period: ${data.paybackPeriod.toFixed(1)} years
- Net Cost: ₹${data.netCost}

Provide a concise recommendation (max 100 words) for this rural Indian household about whether this solar system is good for them. Focus on practical benefits, mention government subsidies, and use simple language suitable for villagers.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct:free',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful solar energy advisor for rural India. Give practical, easy-to-understand advice in simple Hindi-English language.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.choices?.[0]?.message?.content || '';
      }
    } catch (error) {
      console.error('AI recommendation error:', error);
    }
    return '';
  };

  const calculateSavings = async () => {
    if (isCalculating) return;
    
    setIsCalculating(true);
    
    try {
    let units = 0;
    
    if (monthlyUnits) {
      units = parseFloat(monthlyUnits);
    } else if (monthlyBill) {
      units = parseFloat(monthlyBill) / ELECTRICITY_TARIFF;
    }

    // Add appliance consumption
    const applianceConsumption = selectedAppliances.reduce((total, appName) => {
      const appliance = appliances.find(a => a.name === appName);
      if (appliance) {
        return total + (appliance.power * appliance.hoursPerDay * 30) / 1000; // kWh per month
      }
      return total;
    }, 0);

    units += applianceConsumption;

    if (units <= 0) {
      setIsCalculating(false);
      return;
    }

    // Recommend system size (assume 80% of consumption can be met by solar)
    const systemSize = Math.ceil((units * 1.2) / 120); // 120 kWh per kW per month
    const systemCost = systemSize * COST_PER_KW;
    const subsidy = systemCost * SUBSIDY_RATE;
    const netCost = systemCost - subsidy;

    // Calculate monthly generation (assuming 120 kWh per kW per month)
    const monthlyGeneration = systemSize * 120;
    const monthlySavings = Math.min(units, monthlyGeneration) * ELECTRICITY_TARIFF;

    // Payback period
    const paybackPeriod = netCost / (monthlySavings * 12);

    // Long-term savings
    let fiveYearSavings = 0;
    let tenYearSavings = 0;

    for (let year = 1; year <= 10; year++) {
      const currentTariff = ELECTRICITY_TARIFF * Math.pow(1 + ANNUAL_INFLATION, year);
      const systemEfficiency = Math.pow(1 - SYSTEM_DEGRADATION, year);
      const annualGeneration = monthlyGeneration * 12 * systemEfficiency;
      const annualSavings = Math.min(units * 12, annualGeneration) * currentTariff;
      
      if (year <= 5) fiveYearSavings += annualSavings;
      tenYearSavings += annualSavings;
    }

    const basicData = {
      systemSize,
      monthlySavings,
      paybackPeriod,
      fiveYearSavings,
      tenYearSavings,
      systemCost,
      subsidy,
      netCost,
    };

    // Get AI recommendation
    const aiRecommendation = await getAIRecommendation(basicData);

    setSavingsData({
      ...basicData,
      aiRecommendation,
    });

    toast({
      title: "Calculation Complete!",
      description: `${systemSize} kW system recommended with ₹${Math.round(monthlySavings)}/month savings`,
    });

    } catch (error) {
      console.error('Calculation error:', error);
      toast({
        title: "Calculation Error",
        description: "Please check your inputs and try again",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleApplianceToggle = (applianceName: string) => {
    setSelectedAppliances(prev => 
      prev.includes(applianceName)
        ? prev.filter(name => name !== applianceName)
        : [...prev, applianceName]
    );
  };

  useEffect(() => {
    // Only auto-calculate basic validation, not the full AI calculation
    if ((monthlyBill && parseFloat(monthlyBill) > 0) || (monthlyUnits && parseFloat(monthlyUnits) > 0)) {
      // Just validate inputs, don't auto-calculate to avoid excessive API calls
    }
  }, [monthlyBill, monthlyUnits, selectedAppliances]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Chart data
  const chartData = savingsData ? [
    { year: '5 Years', savings: savingsData.fiveYearSavings },
    { year: '10 Years', savings: savingsData.tenYearSavings },
  ] : [];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="w-6 h-6 text-primary" />
            Energy Savings Calculator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Calculate solar panel size and potential savings for your home
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Inputs */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly-bill">Monthly Electricity Bill (₹)</Label>
              <Input
                id="monthly-bill"
                type="number"
                placeholder="Enter your monthly bill"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-units">Monthly Units (kWh)</Label>
              <Input
                id="monthly-units"
                type="number"
                placeholder="Enter your monthly consumption"
                value={monthlyUnits}
                onChange={(e) => setMonthlyUnits(e.target.value)}
              />
            </div>
          </div>

          {/* Appliances Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Appliances Used (Optional)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {appliances.map((appliance) => (
                <div
                  key={appliance.name}
                  className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer"
                  onClick={() => handleApplianceToggle(appliance.name)}
                >
                  <Checkbox
                    checked={selectedAppliances.includes(appliance.name)}
                    onChange={() => handleApplianceToggle(appliance.name)}
                  />
                  <appliance.icon className="w-4 h-4 text-primary" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{appliance.name}</span>
                    <p className="text-xs text-muted-foreground">
                      {appliance.power}W × {appliance.hoursPerDay}h
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={calculateSavings} 
            className="w-full gap-2" 
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <Brain className="w-4 h-4 animate-spin" />
                Calculating with AI...
              </>
            ) : (
              <>
                <Sun className="w-4 h-4" />
                Calculate Solar System
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {savingsData && (
        <div className="space-y-6">
          {/* System Recommendation */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-primary" />
                Recommended Solar System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-primary">
                  {savingsData.systemSize} kW
                </div>
                <p className="text-muted-foreground">
                  Perfect size for your energy needs
                </p>

                {/* AI Recommendation */}
                {savingsData.aiRecommendation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-800 mb-1">AI Recommendation</h4>
                        <p className="text-sm text-blue-700">{savingsData.aiRecommendation}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">System Cost</p>
                    <p className="font-semibold">{formatCurrency(savingsData.systemCost)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Subsidy (30%)</p>
                    <p className="font-semibold text-green-600">-{formatCurrency(savingsData.subsidy)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Net Cost</p>
                    <p className="font-semibold text-primary">{formatCurrency(savingsData.netCost)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Savings */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <IndianRupee className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-green-800">Monthly Savings</h3>
              </div>
              <div className="text-3xl font-bold text-green-700">
                {formatCurrency(savingsData.monthlySavings)}
              </div>
              <p className="text-sm text-green-600 mt-2">
                Save money every month on your electricity bill
              </p>
            </CardContent>
          </Card>

          {/* Payback Period */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">Payback Period</h3>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {savingsData.paybackPeriod.toFixed(1)} Years
                </div>
                <p className="text-sm text-blue-600 mt-2">
                  Time to recover your investment
                </p>
                <div className="mt-4">
                  <Progress 
                    value={Math.min(100, (5 / savingsData.paybackPeriod) * 100)} 
                    className="h-3"
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    {savingsData.paybackPeriod <= 5 ? 'Excellent' : 
                     savingsData.paybackPeriod <= 7 ? 'Good' : 'Fair'} payback period
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Long-term Savings */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Long-term Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">5 Year Savings</p>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(savingsData.fiveYearSavings)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">10 Year Savings</p>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(savingsData.tenYearSavings)}
                    </p>
                  </div>
                </div>

                {/* Chart */}
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), 'Savings']}
                      />
                      <Bar dataKey="savings" fill="hsl(var(--primary))" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Summary */}
                <div className="bg-accent/20 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">💡 Summary:</p>
                  <p className="text-sm text-muted-foreground">
                    You can save <strong>{formatCurrency(savingsData.monthlySavings)}/month</strong>. 
                    In 5 years you save <strong>{formatCurrency(savingsData.fiveYearSavings)}</strong>.
                    Total 10-year savings: <strong>{formatCurrency(savingsData.tenYearSavings)}</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Benefits */}
      <Card className="bg-gradient-card shadow-card">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Additional Benefits
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">✓</Badge>
              <span>25-year system warranty</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">✓</Badge>
              <span>Net metering available</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">✓</Badge>
              <span>Increases property value</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">✓</Badge>
              <span>Zero maintenance for 5 years</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};