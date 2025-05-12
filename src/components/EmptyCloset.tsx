
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Ruler, Shirt, Bookmark } from 'lucide-react';
import { useFitAssistant } from '@/contexts/FitAssistantContext';
import { Slider } from '@/components/ui/slider';
import UnitToggle from './UnitToggle';
import { Skeleton } from '@/components/ui/skeleton';

interface EmptyClosetProps {
  onAddGarment: () => void;
}

const EmptyCloset: React.FC<EmptyClosetProps> = ({ onAddGarment }) => {
  const { userProfile, unitSystem, toggleUnitSystem, updateMeasurement, convertToImperial } = useFitAssistant();
  const [showHeightInput, setShowHeightInput] = useState(false);
  
  // Get current height value from user profile
  const getHeightValue = (): number | null => {
    if (!userProfile) return null;
    const measurement = userProfile.measurements.find(m => m.type === 'height');
    return measurement ? measurement.value : null;
  };
  
  // Format display value with units
  const formatValue = (value: number | null): string => {
    if (value === null) return "Not set";
    // Convert to imperial if needed
    const displayValue = unitSystem === 'imperial' ? convertToImperial(value, 'height') : value;
    return unitSystem === 'metric' ? `${displayValue} cm` : `${displayValue} in`;
  };
  
  const handleAddHeight = () => {
    setShowHeightInput(true);
    // Set default height if not already set
    if (getHeightValue() === null) {
      updateMeasurement('height', 170); // Default to 170cm
    }
  };
  
  const GarmentSkeleton = () => (
    <div className="relative w-full h-48 mb-4 animate-pulse">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
        <Bookmark className="w-12 h-12 text-muted-foreground" />
      </div>
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-[80%] h-40 bg-muted rounded-md flex items-center justify-center">
        <Shirt className="w-20 h-20 text-muted-foreground opacity-30" />
      </div>
    </div>
  );

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
          {!showHeightInput ? (
            <>
              <GarmentSkeleton />
              
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Your Closet Awaits!</h3>
                <p className="text-sm text-muted-foreground">
                  Start building your digital wardrobe to get personalized fit recommendations
                </p>
              </div>
              
              <div className="flex flex-col space-y-4 w-full max-w-sm">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Did you know?</p>
                  <p className="text-xs text-muted-foreground">
                    Adding just 5 garments that fit you well teaches Fit Assistant to make accurate recommendations for new items.
                  </p>
                </div>
                
                <Button onClick={onAddGarment} className="w-full" size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Garment
                </Button>
                
                <Button onClick={handleAddHeight} variant="outline" className="w-full" size="sm">
                  <Ruler className="mr-2 h-4 w-4" />
                  Add Your Height
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Your Height
                </h3>
                <UnitToggle value={unitSystem} onChange={toggleUnitSystem} />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between flex-wrap">
                    <span className="text-sm font-medium">Height</span>
                    <span className="text-sm">
                      {formatValue(getHeightValue())}
                    </span>
                  </div>
                  
                  <Slider
                    min={0}
                    max={unitSystem === 'metric' ? 220 : convertToImperial(220, 'height')}
                    step={unitSystem === 'metric' ? 1 : 0.5}
                    value={[unitSystem === 'metric' ? 
                      getHeightValue() || 170 : 
                      convertToImperial(getHeightValue() || 170, 'height')
                    ]}
                    onValueChange={(values) => {
                      const value = values[0];
                      const metricValue = unitSystem === 'metric' ? value : 
                        Math.round(value * 2.54); // Convert inches to cm
                      updateMeasurement('height', metricValue);
                    }}
                  />
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">
                    Height helps estimate other body measurements for better fit recommendations.
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={() => setShowHeightInput(false)} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button onClick={onAddGarment} className="flex-1">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Garment
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyCloset;
