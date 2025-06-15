
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Leaf, Zap, Car, Utensils, Lightbulb, TreePine, Recycle } from 'lucide-react';
import CarbonChart from '@/components/CarbonChart';
import ReductionTips from '@/components/ReductionTips';

interface CarbonFootprint {
  electricity: number;
  transport: number;
  food: number;
  total: number;
}

interface UserInputs {
  electricityUsage: number;
  electricityUnit: 'kwh' | 'rupees' | 'bulbs';
  drivingDistance: number;
  dietType: 'veg' | 'non-veg' | 'mixed';
}

const Index = () => {
  const [inputs, setInputs] = useState<UserInputs>({
    electricityUsage: 0,
    electricityUnit: 'kwh',
    drivingDistance: 0,
    dietType: 'mixed'
  });
  
  const [carbonFootprint, setCarbonFootprint] = useState<CarbonFootprint>({
    electricity: 0,
    transport: 0,
    food: 0,
    total: 0
  });

  const [isCalculated, setIsCalculated] = useState(false);

  // Emission factors
  const EMISSION_FACTORS = {
    electricity: {
      kwh: 0.82, // kg CO₂ per kWh
      rupees: 0.82 * 0.15, // assuming 1 rupee = ~0.15 kWh (rough estimate)
      bulbs: 0.82 * 5 * 30 * 12 / 1000 // 5W LED bulb, 30 days, 12 hours = annual kWh
    },
    transport: 0.2, // kg CO₂ per km
    food: {
      veg: 1.7, // kg CO₂ per day
      'non-veg': 2.5,
      mixed: 2.1
    }
  };

  const calculateCarbonFootprint = () => {
    console.log('Calculating carbon footprint with inputs:', inputs);
    
    // Calculate electricity emissions (annual)
    let electricityEmissions = 0;
    if (inputs.electricityUnit === 'kwh') {
      electricityEmissions = inputs.electricityUsage * 12 * EMISSION_FACTORS.electricity.kwh;
    } else if (inputs.electricityUnit === 'rupees') {
      electricityEmissions = inputs.electricityUsage * 12 * EMISSION_FACTORS.electricity.rupees;
    } else if (inputs.electricityUnit === 'bulbs') {
      electricityEmissions = inputs.electricityUsage * EMISSION_FACTORS.electricity.bulbs;
    }

    // Calculate transport emissions (annual)
    const transportEmissions = inputs.drivingDistance * 52 * EMISSION_FACTORS.transport; // weekly * 52 weeks

    // Calculate food emissions (annual)
    const foodEmissions = EMISSION_FACTORS.food[inputs.dietType] * 365;

    const total = electricityEmissions + transportEmissions + foodEmissions;

    const footprint = {
      electricity: Math.round(electricityEmissions),
      transport: Math.round(transportEmissions),
      food: Math.round(foodEmissions),
      total: Math.round(total)
    };

    console.log('Calculated footprint:', footprint);
    setCarbonFootprint(footprint);
    setIsCalculated(true);
  };

  const handleInputChange = (field: keyof UserInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setIsCalculated(false);
  };

  const getElectricityLabel = () => {
    switch (inputs.electricityUnit) {
      case 'kwh': return 'Monthly Electricity Usage (kWh)';
      case 'rupees': return 'Monthly Electricity Bill (₹)';
      case 'bulbs': return 'Number of Light Bulbs';
      default: return 'Monthly Electricity Usage';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-500 rounded-full p-3 mr-3">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Carbon Footprint Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your household's annual CO₂ emissions and discover personalized ways to reduce your environmental impact
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Input Form */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Your Lifestyle Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Electricity Section */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Electricity Usage</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="electricity-unit">Unit Type</Label>
                    <Select value={inputs.electricityUnit} onValueChange={(value: 'kwh' | 'rupees' | 'bulbs') => handleInputChange('electricityUnit', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kwh">kWh (Units)</SelectItem>
                        <SelectItem value="rupees">₹ (Rupees)</SelectItem>
                        <SelectItem value="bulbs">Light Bulbs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="electricity-usage">{getElectricityLabel()}</Label>
                    <Input
                      id="electricity-usage"
                      type="number"
                      placeholder="0"
                      value={inputs.electricityUsage || ''}
                      onChange={(e) => handleInputChange('electricityUsage', parseFloat(e.target.value) || 0)}
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Transport Section */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Car className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Transportation</h3>
                </div>
                
                <div>
                  <Label htmlFor="driving-distance">Weekly Driving Distance (km)</Label>
                  <Input
                    id="driving-distance"
                    type="number"
                    placeholder="0"
                    value={inputs.drivingDistance || ''}
                    onChange={(e) => handleInputChange('drivingDistance', parseFloat(e.target.value) || 0)}
                    className="bg-white"
                  />
                </div>
              </div>

              <Separator />

              {/* Diet Section */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Utensils className="h-5 w-5 text-orange-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Dietary Habits</h3>
                </div>
                
                <div>
                  <Label htmlFor="diet-type">Diet Type</Label>
                  <Select value={inputs.dietType} onValueChange={(value: 'veg' | 'non-veg' | 'mixed') => handleInputChange('dietType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veg">Vegetarian</SelectItem>
                      <SelectItem value="mixed">Mixed Diet</SelectItem>
                      <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={calculateCarbonFootprint}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Calculate My Carbon Footprint
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Total Emissions Card */}
            {isCalculated && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-gray-800 mb-2">
                      {carbonFootprint.total.toLocaleString()} kg
                    </div>
                    <div className="text-lg text-gray-600">Annual CO₂ Emissions</div>
                    <Badge variant="outline" className="mt-2 text-emerald-600 border-emerald-600">
                      <TreePine className="h-4 w-4 mr-1" />
                      Equivalent to {Math.round(carbonFootprint.total / 22)} trees needed annually
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                      <div className="font-semibold text-gray-800">{carbonFootprint.electricity} kg</div>
                      <div className="text-sm text-gray-600">Electricity</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <Car className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                      <div className="font-semibold text-gray-800">{carbonFootprint.transport} kg</div>
                      <div className="text-sm text-gray-600">Transport</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <Utensils className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                      <div className="font-semibold text-gray-800">{carbonFootprint.food} kg</div>
                      <div className="text-sm text-gray-600">Food</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Chart Visualization */}
            {isCalculated && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Recycle className="mr-2 h-5 w-5 text-green-500" />
                    Emissions Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CarbonChart data={carbonFootprint} />
                </CardContent>
              </Card>
            )}

            {/* Reduction Tips */}
            {isCalculated && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                    Personalized Reduction Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ReductionTips inputs={inputs} carbonFootprint={carbonFootprint} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
