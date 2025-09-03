import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calculator, Zap, TrendingDown, Clock, IndianRupee, Sun, Home, Factory } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CostEstimate {
  systemSize: number;
  totalCost: number;
  subsidyAmount: number;
  netCost: number;
  monthlyBill: number;
  monthlySavings: number;
  paybackPeriod: number;
  annualSavings: number;
  co2Savings: number;
}

export default function CostCalculator() {
  const [systemType, setSystemType] = useState<'residential' | 'commercial'>('residential');
  const [monthlyBill, setMonthlyBill] = useState<number>(3000);
  const [roofArea, setRoofArea] = useState<number>(500);
  const [location, setLocation] = useState<string>('delhi');
  const [systemSize, setSystemSize] = useState<number[]>([3]);
  const [estimate, setEstimate] = useState<CostEstimate | null>(null);

  // Pricing data (₹ per kW)
  const pricingData = {
    residential: {
      costPerKw: 65000, // ₹65,000 per kW
      subsidyRate: 0.4, // 40% subsidy up to 3kW
      subsidyRateHigher: 0.2, // 20% subsidy for 3-10kW
    },
    commercial: {
      costPerKw: 55000, // ₹55,000 per kW (economies of scale)
      subsidyRate: 0.3, // 30% accelerated depreciation benefit
      subsidyRateHigher: 0.3,
    }
  };

  // Location factors (solar irradiance multiplier)
  const locationFactors = {
    delhi: 4.5,
    mumbai: 4.8,
    chennai: 5.2,
    bangalore: 5.0,
    hyderabad: 5.1,
    pune: 4.9,
    kolkata: 4.3,
    jaipur: 5.5,
  };

  const calculateEstimate = () => {
    const size = systemSize[0];
    const pricing = pricingData[systemType];
    const solarIrradiance = locationFactors[location as keyof typeof locationFactors] || 4.5;
    
    // Calculate total system cost
    const totalCost = size * pricing.costPerKw;
    
    // Calculate subsidy
    let subsidyAmount = 0;
    if (systemType === 'residential') {
      if (size <= 3) {
        subsidyAmount = totalCost * pricing.subsidyRate;
      } else {
        const firstThreeKwCost = 3 * pricing.costPerKw;
        const remainingCost = (size - 3) * pricing.costPerKw;
        subsidyAmount = (firstThreeKwCost * pricing.subsidyRate) + (remainingCost * pricing.subsidyRateHigher);
      }
    } else {
      subsidyAmount = totalCost * pricing.subsidyRate;
    }
    
    const netCost = totalCost - subsidyAmount;
    
    // Calculate energy generation and savings
    const dailyGeneration = size * solarIrradiance; // kWh per day
    const monthlyGeneration = dailyGeneration * 30;
    const annualGeneration = dailyGeneration * 365;
    
    // Electricity tariff (₹ per unit)
    const electricityTariff = 6.5; // Average ₹6.5 per kWh
    
    const monthlySavings = monthlyGeneration * electricityTariff;
    const annualSavings = annualGeneration * electricityTariff;
    
    // Payback period in years
    const paybackPeriod = netCost / annualSavings;
    
    // CO2 savings (kg CO2 per kWh = 0.82)
    const co2Savings = annualGeneration * 0.82;
    
    setEstimate({
      systemSize: size,
      totalCost,
      subsidyAmount,
      netCost,
      monthlyBill,
      monthlySavings,
      paybackPeriod,
      annualSavings,
      co2Savings
    });
  };

  useEffect(() => {
    calculateEstimate();
  }, [systemType, systemSize, location, monthlyBill]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getSystemSizeRecommendation = () => {
    // Rough estimate: 1kW system generates ~120 units per month
    const unitsPerMonth = monthlyBill / 6.5; // Assuming ₹6.5 per unit
    const recommendedSize = Math.ceil(unitsPerMonth / 120);
    return Math.max(1, Math.min(recommendedSize, 10));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
            <Calculator className="w-8 h-8 text-primary" />
            Solar Cost Calculator
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Calculate the cost, savings, and payback period for your solar installation. 
            Get accurate estimates based on your location and electricity consumption.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-primary" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* System Type */}
              <div className="space-y-2">
                <Label>Installation Type</Label>
                <div className="flex gap-2">
                  <Button
                    variant={systemType === 'residential' ? 'default' : 'outline'}
                    onClick={() => setSystemType('residential')}
                    className="flex-1 gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Residential
                  </Button>
                  <Button
                    variant={systemType === 'commercial' ? 'default' : 'outline'}
                    onClick={() => setSystemType('commercial')}
                    className="flex-1 gap-2"
                  >
                    <Factory className="w-4 h-4" />
                    Commercial
                  </Button>
                </div>
              </div>

              {/* Monthly Bill */}
              <div className="space-y-2">
                <Label>Monthly Electricity Bill (₹)</Label>
                <Input
                  type="number"
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(Number(e.target.value))}
                  placeholder="3000"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended system size: {getSystemSizeRecommendation()}kW
                </p>
              </div>

              {/* System Size Slider */}
              <div className="space-y-4">
                <Label>Solar System Size: {systemSize[0]}kW</Label>
                <Slider
                  value={systemSize}
                  onValueChange={setSystemSize}
                  max={systemType === 'residential' ? 10 : 100}
                  min={1}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1kW</span>
                  <span>{systemType === 'residential' ? '10kW' : '100kW'}</span>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                    <SelectItem value="kolkata">Kolkata</SelectItem>
                    <SelectItem value="jaipur">Jaipur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Roof Area */}
              <div className="space-y-2">
                <Label>Available Roof Area (sq ft)</Label>
                <Input
                  type="number"
                  value={roofArea}
                  onChange={(e) => setRoofArea(Number(e.target.value))}
                  placeholder="500"
                />
                <p className="text-xs text-muted-foreground">
                  1kW system requires ~80 sq ft of roof space
                </p>
              </div>

              <Button onClick={calculateEstimate} className="w-full gap-2">
                <Calculator className="w-4 h-4" />
                Recalculate Estimate
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          {estimate && (
            <div className="space-y-6">
              {/* Cost Breakdown */}
              <Card className="bg-gradient-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IndianRupee className="w-5 h-5" />
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm opacity-90">System Size</p>
                      <p className="text-2xl font-bold">{estimate.systemSize}kW</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Total Cost</p>
                      <p className="text-2xl font-bold">{formatCurrency(estimate.totalCost)}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Subsidy</p>
                      <p className="text-xl font-bold text-green-200">-{formatCurrency(estimate.subsidyAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Net Cost</p>
                      <p className="text-2xl font-bold">{formatCurrency(estimate.netCost)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Savings Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    Savings Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">Monthly Savings</p>
                      <p className="text-xl font-bold text-green-700">{formatCurrency(estimate.monthlySavings)}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Annual Savings</p>
                      <p className="text-xl font-bold text-blue-700">{formatCurrency(estimate.annualSavings)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Payback Period</span>
                      <span className="font-semibold">{estimate.paybackPeriod.toFixed(1)} years</span>
                    </div>
                    <Progress value={(1 / estimate.paybackPeriod) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Environmental Impact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    Environmental Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Annual CO₂ Savings</p>
                    <p className="text-2xl font-bold text-green-700">{estimate.co2Savings.toFixed(0)} kg</p>
                    <p className="text-xs text-green-600 mt-1">
                      Equivalent to planting {Math.round(estimate.co2Savings / 22)} trees
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Key Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <Badge variant="secondary" className="justify-start p-3 h-auto">
                      <Clock className="w-4 h-4 mr-2" />
                      25-year system warranty with minimal maintenance
                    </Badge>
                    <Badge variant="secondary" className="justify-start p-3 h-auto">
                      <TrendingDown className="w-4 h-4 mr-2" />
                      Net metering allows selling excess power back to grid
                    </Badge>
                    <Badge variant="secondary" className="justify-start p-3 h-auto">
                      <Zap className="w-4 h-4 mr-2" />
                      Increases property value by 4-8%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-border/50">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Disclaimer:</strong> These estimates are indicative and based on average market rates and conditions. 
            Actual costs may vary based on roof conditions, local regulations, equipment quality, and installation complexity. 
            Please consult with certified solar installers for detailed quotations.
          </p>
        </div>
      </div>
    </div>
  );
}