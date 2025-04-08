
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { useFitAssistant } from '@/contexts/FitAssistantContext';
import { MeasurementType, MEASUREMENT_RANGES } from '@/types';
import { Label } from '@/components/ui/label';

interface MeasurementSliderProps {
  type: MeasurementType;
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const MeasurementSlider: React.FC<MeasurementSliderProps> = ({ 
  type, 
  label,
  value,
  onChange 
}) => {
  const { unitSystem, convertToImperial, convertToMetric } = useFitAssistant();
  const [range] = React.useState<[number, number]>(MEASUREMENT_RANGES[type] || [0, 100]);
  
  // Display value based on unit system
  const displayValue = unitSystem === 'imperial' 
    ? convertToImperial(value, type) 
    : value;
  
  // Handle value change with unit conversion
  const handleValueChange = (newValue: number[]) => {
    const value = newValue[0];
    onChange(unitSystem === 'imperial' ? convertToMetric(value, type) : value);
  };
  
  // Format display with units
  const getDisplayText = () => {
    if (type === 'height') {
      return unitSystem === 'metric' 
        ? `${displayValue} cm` 
        : `${Math.floor(displayValue / 12)}'${Math.round(displayValue % 12)}"`;
    }
    if (type === 'weight') {
      return unitSystem === 'metric' 
        ? `${displayValue} kg` 
        : `${displayValue} lbs`;
    }
    return unitSystem === 'metric' 
      ? `${displayValue} cm` 
      : `${displayValue} in`;
  };
  
  // Calculate slider range based on units
  const sliderRange = unitSystem === 'metric' 
    ? range 
    : type === 'weight'
      ? [convertToImperial(range[0], type), convertToImperial(range[1], type)]
      : [convertToImperial(range[0]), convertToImperial(range[1])];
    
  // Calculate step based on unit system
  const step = unitSystem === 'metric' ? 1 : 0.5;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor={`slider-${type}`} className="text-sm font-medium">
          {label}
        </Label>
        <span className="text-sm font-medium">
          {getDisplayText()}
        </span>
      </div>
      <Slider
        id={`slider-${type}`}
        min={sliderRange[0]}
        max={sliderRange[1]}
        step={step}
        value={[displayValue]}
        onValueChange={handleValueChange}
        className="w-full"
      />
    </div>
  );
};

export default MeasurementSlider;
