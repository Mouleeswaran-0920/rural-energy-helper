import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Leaf, TreePine, Zap, TrendingDown, Calculator, Recycle } from 'lucide-react';

interface CO2Data {
  monthlyEmissions: number;
  renewableEmissions: number;
  co2Saved: number;
  treesEquivalent: number;
  annualSavings: number;
}

export const CO2Tracker: React.FC = () => {
  const [monthlyBill, setMonthlyBill] = useState<string>('');
  const [monthlyUnits, setMonthlyUnits] = useState<string>('');
  const [inputType, setInputType] = useState<'bill' | 'units'>('bill');
  const [co2Data, setCO2Data] = useState<CO2Data | null>(null);

  // CO2 emission factors (kg CO2 per kWh)
  const GRID_EMISSION_FACTOR = 0.82; // India's grid emission factor
  const RENEWABLE_EMISSION_FACTOR = 0.05; // Solar/Wind lifecycle emissions
  const TREE_CO2_ABSORPTION = 22; // kg CO2 per tree per year
  const AVG_TARIFF = 6; // Average electricity tariff per kWh in INR

  const calculateCO2 = () => {
    let units = 0;
    
    if (inputType === 'bill' && monthlyBill) {
      units = parseFloat(monthlyBill) / AVG_TARIFF;
    } else if (inputType === 'units' && monthlyUnits) {
      units = parseFloat(monthlyUnits);
    }

    if (units <= 0) return;

    const monthlyEmissions = units * GRID_EMISSION_FACTOR;
    const renewableEmissions = units * RENEWABLE_EMISSION_FACTOR;
    const co2Saved = monthlyEmissions - renewableEmissions;
    const annualSavings = co2Saved * 12;
    const treesEquivalent = Math.round(annualSavings / TREE_CO2_ABSORPTION);

    setCO2Data({
      monthlyEmissions,
      renewableEmissions,
      co2Saved,
      treesEquivalent,
      annualSavings,
    });
  };

  useEffect(() => {
    if ((inputType === 'bill' && monthlyBill) || (inputType === 'units' && monthlyUnits)) {
      calculateCO2();
    }
  }, [monthlyBill, monthlyUnits, inputType]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(num));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Leaf className="w-6 h-6 text-green-600" />
            CO₂ Savings Tracker
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            See how much carbon you can save by switching to renewable energy
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input Type Toggle */}
          <div className="flex gap-2">
            <Button
              variant={inputType === 'bill' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputType('bill')}
              className="flex-1"
            >
              Monthly Bill (₹)
            </Button>
            <Button
              variant={inputType === 'units' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputType('units')}
              className="flex-1"
            >
              Monthly Units (kWh)
            </Button>
          </div>

          {/* Input Field */}
          <div className="space-y-2">
            {inputType === 'bill' ? (
              <>
                <Label htmlFor="monthly-bill">Monthly Electricity Bill (₹)</Label>
                <Input
                  id="monthly-bill"
                  type="number"
                  placeholder="Enter your monthly bill amount"
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(e.target.value)}
                />
              </>
            ) : (
              <>
                <Label htmlFor="monthly-units">Monthly Units (kWh)</Label>
                <Input
                  id="monthly-units"
                  type="number"
                  placeholder="Enter your monthly electricity consumption"
                  value={monthlyUnits}
                  onChange={(e) => setMonthlyUnits(e.target.value)}
                />
              </>
            )}
          </div>

          <Button onClick={calculateCO2} className="w-full gap-2">
            <Calculator className="w-4 h-4" />
            Calculate CO₂ Impact
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {co2Data && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Current Grid Emissions */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">Grid Electricity</span>
              </div>
              <p className="text-2xl font-bold text-red-700">
                {formatNumber(co2Data.monthlyEmissions)} kg
              </p>
              <p className="text-sm text-red-600">CO₂ per month</p>
            </CardContent>
          </Card>

          {/* Renewable Energy Emissions */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Recycle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Renewable Energy</span>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {formatNumber(co2Data.renewableEmissions)} kg
              </p>
              <p className="text-sm text-green-600">CO₂ per month</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CO2 Savings */}
      {co2Data && (
        <Card className="bg-gradient-card shadow-card border-green-200">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingDown className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-green-800">Carbon Saved</h3>
              </div>
              
              <div className="text-4xl font-bold text-green-700">
                {formatNumber(co2Data.co2Saved)} kg/month
              </div>
              
              <div className="text-lg text-green-600">
                {formatNumber(co2Data.annualSavings)} kg/year
              </div>

              {/* Trees Equivalent */}
              <div className="bg-green-100 rounded-lg p-4 mt-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TreePine className="w-8 h-8 text-green-600" />
                  <span className="text-lg font-semibold text-green-800">
                    = {co2Data.treesEquivalent} Trees Planted
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Your yearly CO₂ savings equal planting {co2Data.treesEquivalent} trees!
                </p>
              </div>

              {/* Progress Visualization */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>CO₂ Reduction</span>
                  <span>{Math.round((co2Data.co2Saved / co2Data.monthlyEmissions) * 100)}%</span>
                </div>
                <Progress 
                  value={(co2Data.co2Saved / co2Data.monthlyEmissions) * 100} 
                  className="h-3"
                />
                <p className="text-xs text-center text-muted-foreground">
                  Switching to renewable energy reduces your carbon footprint by{' '}
                  {Math.round((co2Data.co2Saved / co2Data.monthlyEmissions) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Environmental Impact Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-800 mb-2">🌍 Why This Matters</h4>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• India's electricity grid produces 0.82 kg CO₂ per kWh</p>
            <p>• Renewable energy produces 94% less CO₂ emissions</p>
            <p>• One tree absorbs about 22 kg CO₂ per year</p>
            <p>• Every kWh from solar/wind prevents 0.77 kg CO₂ emissions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};