
import React from 'react';
import { useFitAssistant } from '@/contexts/FitAssistantContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import UnitToggle from './UnitToggle';
import { MeasurementType } from '@/types';
import { Height } from 'lucide-react';

const HeightMeasurement: React.FC = () => {
  const { userProfile, unitSystem, toggleUnitSystem, updateMeasurement, convertToImperial } = useFitAssistant();
  
  // Get current height value from user profile
  const getHeightValue = (): number => {
    if (!userProfile) return 170; // Default height in cm
    const measurement = userProfile.measurements.find(m => m.type === 'height');
    return measurement ? measurement.value : 170;
  };
  
  // Format display value with units
  const formatValue = (value: number): string => {
    // Convert to imperial if needed
    const displayValue = unitSystem === 'imperial' ? convertToImperial(value, 'height') : value;
    return unitSystem === 'metric' ? `${displayValue} cm` : `${displayValue} in`;
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center gap-2">
            <Height className="h-4 w-4" />
            Height
          </CardTitle>
          <UnitToggle value={unitSystem} onChange={toggleUnitSystem} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between flex-wrap">
              <span className="text-sm font-medium">
                Your Height
              </span>
              <span className="text-sm">
                {formatValue(getHeightValue())}
              </span>
            </div>
            
            <Slider
              min={0}
              max={unitSystem === 'metric' ? 220 : convertToImperial(220, 'height')}
              step={unitSystem === 'metric' ? 1 : 0.5}
              value={[unitSystem === 'metric' ? 
                getHeightValue() : 
                convertToImperial(getHeightValue(), 'height')
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
              Other body measurements are automatically estimated based on your height and garment fit feedback.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeightMeasurement;
