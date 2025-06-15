
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Leaf, Car, Utensils, Zap, TreePine, Heart, Award } from 'lucide-react';

interface UserInputs {
  electricityUsage: number;
  electricityUnit: 'kwh' | 'rupees' | 'bulbs';
  drivingDistance: number;
  dietType: 'veg' | 'non-veg' | 'mixed';
}

interface CarbonFootprint {
  electricity: number;
  transport: number;
  food: number;
  total: number;
}

interface ReductionTipsProps {
  inputs: UserInputs;
  carbonFootprint: CarbonFootprint;
}

interface Tip {
  icon: React.ReactNode;
  title: string;
  description: string;
  impact: string;
  savingsKg: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'electricity' | 'transport' | 'food';
}

const ReductionTips: React.FC<ReductionTipsProps> = ({ inputs, carbonFootprint }) => {
  const generateTips = (): Tip[] => {
    const tips: Tip[] = [];

    // Electricity tips
    if (carbonFootprint.electricity > 500) {
      tips.push({
        icon: <Lightbulb className="h-5 w-5" />,
        title: "Switch to LED Bulbs",
        description: "Replace incandescent bulbs with LED bulbs to reduce electricity consumption by up to 80%",
        impact: `Save ${Math.round(carbonFootprint.electricity * 0.15)} kg CO₂ annually`,
        savingsKg: Math.round(carbonFootprint.electricity * 0.15),
        difficulty: 'Easy',
        category: 'electricity'
      });

      tips.push({
        icon: <Zap className="h-5 w-5" />,
        title: "Unplug Electronics",
        description: "Unplug devices when not in use to eliminate phantom power consumption",
        impact: `Save ${Math.round(carbonFootprint.electricity * 0.1)} kg CO₂ annually`,
        savingsKg: Math.round(carbonFootprint.electricity * 0.1),
        difficulty: 'Easy',
        category: 'electricity'
      });
    }

    if (carbonFootprint.electricity > 1000) {
      tips.push({
        icon: <Zap className="h-5 w-5" />,
        title: "Energy-Efficient Appliances",
        description: "Upgrade to 5-star rated appliances for significant energy savings",
        impact: `Save ${Math.round(carbonFootprint.electricity * 0.25)} kg CO₂ annually`,
        savingsKg: Math.round(carbonFootprint.electricity * 0.25),
        difficulty: 'Hard',
        category: 'electricity'
      });
    }

    // Transport tips
    if (carbonFootprint.transport > 300) {
      tips.push({
        icon: <Car className="h-5 w-5" />,
        title: "Use Public Transport",
        description: "Replace 20% of car trips with public transport or carpooling",
        impact: `Save ${Math.round(carbonFootprint.transport * 0.2)} kg CO₂ annually`,
        savingsKg: Math.round(carbonFootprint.transport * 0.2),
        difficulty: 'Medium',
        category: 'transport'
      });

      tips.push({
        icon: <Car className="h-5 w-5" />,
        title: "Combine Errands",
        description: "Plan trips efficiently to reduce total driving distance by 15%",
        impact: `Save ${Math.round(carbonFootprint.transport * 0.15)} kg CO₂ annually`,
        savingsKg: Math.round(carbonFootprint.transport * 0.15),
        difficulty: 'Easy',
        category: 'transport'
      });
    }

    if (inputs.drivingDistance > 100) {
      tips.push({
        icon: <Car className="h-5 w-5" />,
        title: "Work from Home",
        description: "Work from home 1-2 days per week to reduce commuting",
        impact: `Save ${Math.round(inputs.drivingDistance * 52 * 0.2 * 0.3)} kg CO₂ annually`,
        savingsKg: Math.round(inputs.drivingDistance * 52 * 0.2 * 0.3),
        difficulty: 'Medium',
        category: 'transport'
      });
    }

    // Food tips
    if (inputs.dietType === 'non-veg') {
      tips.push({
        icon: <Utensils className="h-5 w-5" />,
        title: "Meatless Mondays",
        description: "Go vegetarian one day per week to reduce your food carbon footprint",
        impact: `Save ${Math.round((2.5 - 1.7) * 52)} kg CO₂ annually`,
        savingsKg: Math.round((2.5 - 1.7) * 52),
        difficulty: 'Easy',
        category: 'food'
      });

      tips.push({
        icon: <Leaf className="h-5 w-5" />,
        title: "Choose Local & Seasonal",
        description: "Buy locally grown, seasonal produce to reduce transportation emissions",
        impact: `Save ${Math.round(carbonFootprint.food * 0.1)} kg CO₂ annually`,
        savingsKg: Math.round(carbonFootprint.food * 0.1),
        difficulty: 'Medium',
        category: 'food'
      });
    }

    if (inputs.dietType === 'mixed') {
      tips.push({
        icon: <Utensils className="h-5 w-5" />,
        title: "Reduce Meat Portions",
        description: "Reduce meat consumption by 30% and increase plant-based meals",
        impact: `Save ${Math.round((2.1 - 1.7) * 365 * 0.3)} kg CO₂ annually`,
        savingsKg: Math.round((2.1 - 1.7) * 365 * 0.3),
        difficulty: 'Medium',
        category: 'food'
      });
    }

    // Universal tips
    tips.push({
      icon: <TreePine className="h-5 w-5" />,
      title: "Plant Trees",
      description: "Plant native trees in your area - each tree absorbs ~22kg CO₂ annually",
      impact: `Offset ${22 * Math.ceil(carbonFootprint.total / 22 / 10)} kg CO₂ with ${Math.ceil(carbonFootprint.total / 22 / 10)} trees`,
      savingsKg: 22 * Math.ceil(carbonFootprint.total / 22 / 10),
      difficulty: 'Medium',
      category: 'electricity'
    });

    // Sort by impact (highest savings first)
    return tips.sort((a, b) => b.savingsKg - a.savingsKg).slice(0, 6);
  };

  const tips = generateTips();
  const totalPotentialSavings = tips.reduce((sum, tip) => sum + tip.savingsKg, 0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'electricity': return 'text-yellow-600';
      case 'transport': return 'text-blue-600';
      case 'food': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Award className="h-6 w-6 text-green-600 mr-2" />
              <div>
                <div className="font-semibold text-green-800">Potential Impact</div>
                <div className="text-sm text-green-600">By following these tips, you could save:</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-800">{totalPotentialSavings.toLocaleString()} kg</div>
              <div className="text-sm text-green-600">
                {Math.round((totalPotentialSavings / carbonFootprint.total) * 100)}% reduction
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Grid */}
      <div className="grid gap-4">
        {tips.map((tip, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`p-2 rounded-full bg-green-100 ${getCategoryColor(tip.category)}`}>
                    {tip.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-800">{tip.title}</h4>
                      <Badge className={getDifficultyColor(tip.difficulty)}>
                        {tip.difficulty}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{tip.description}</p>
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-700">{tip.impact}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">-{tip.savingsKg}</div>
                  <div className="text-xs text-gray-500">kg CO₂</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Motivation Footer */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <CardContent className="p-4 text-center">
          <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Every small action counts!</span> Your commitment to reducing carbon emissions 
            helps protect our planet for future generations. Start with the easy changes and gradually work towards the bigger ones.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReductionTips;
