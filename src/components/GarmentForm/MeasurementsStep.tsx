
import React from 'react';
import { useFitAssistant } from '@/contexts/FitAssistantContext';
import { GarmentFormData, GarmentType, GARMENT_MEASUREMENTS, MeasurementType } from '@/types';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import UnitToggle from '@/components/UnitToggle';

interface MeasurementsStepProps {
  garmentData: GarmentFormData;
  onChange: (field: string, value: any) => void;
}

// Mapping of measurement types to human-readable labels
const MEASUREMENT_LABELS: Record<MeasurementType, string> = {
  height: 'Height',
  weight: 'Weight',
  shoulders: 'Shoulders',
  chest: 'Chest',
  bust: 'Bust',
  underbust: 'Underbust',
  waist: 'Waist',
  abdomen: 'Abdomen',
  hip: 'Hips',
  thighs: 'Thighs',
  inseam: 'Inseam',
  sleeve: 'Sleeve Length'
};

// Mapping of measurement types to default ranges in cm
const MEASUREMENT_RANGES: Record<MeasurementType, [number, number]> = {
  height: [120, 220],
  weight: [30, 200],
  shoulders: [30, 60],
  chest: [60, 140],
  bust: [60, 140],
  underbust: [50, 120],
  waist: [50, 140],
  abdomen: [60, 150],
  hip: [70, 160],
  thighs: [30, 90],
  inseam: [50, 100],
  sleeve: [40, 80]
};

const MeasurementsStep: React.FC<MeasurementsStepProps> = ({ garmentData, onChange }) => {
  const { unitSystem, toggleUnitSystem, convertToImperial } = useFitAssistant();
  const measurementTypes = garmentData.type ? GARMENT_MEASUREMENTS[garmentData.type as GarmentType] || [] : [];
  
  const updateMeasurement = (type: MeasurementType, value: number) => {
    const measurements = [...garmentData.measurements];
    const existingIndex = measurements.findIndex(m => m.type === type);
    
    if (existingIndex >= 0) {
      measurements[existingIndex].value = value;
    } else {
      measurements.push({ type, value });
    }
    
    onChange('measurements', measurements);
  };
  
  const getMeasurementValue = (type: MeasurementType): number => {
    const measurement = garmentData.measurements.find(m => m.type === type);
    return measurement ? measurement.value : 0;
  };
  
  // Format display value with units
  const formatValue = (type: MeasurementType, value: number): string => {
    // Convert to imperial if needed
    const displayValue = unitSystem === 'imperial' ? convertToImperial(value, type) : value;
    
    if (type === 'weight') {
      return unitSystem === 'metric' ? `${displayValue} kg` : `${displayValue} lbs`;
    }
    return unitSystem === 'metric' ? `${displayValue} cm` : `${displayValue} in`;
  };
  
  if (measurementTypes.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No measurement areas are defined for this garment type. Please select a different garment type in the previous step.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <p className="text-sm text-muted-foreground mb-4 sm:mb-0 max-w-md">
          Enter the measurements of your garment. These are optional but help improve Fit Assistant's accuracy.
        </p>
        <UnitToggle value={unitSystem} onChange={toggleUnitSystem} />
      </div>
      
      {measurementTypes.map(type => (
        <div key={type} className="space-y-2">
          <div className="flex justify-between flex-wrap">
            <label className="text-sm font-medium">
              {MEASUREMENT_LABELS[type]}
            </label>
            <span className="text-sm">
              {formatValue(type, getMeasurementValue(type))}
            </span>
          </div>
          
          <Slider
            min={0}
            max={unitSystem === 'metric' ? 
              MEASUREMENT_RANGES[type][1] : 
              convertToImperial(MEASUREMENT_RANGES[type][1], type)
            }
            step={unitSystem === 'metric' ? 1 : 0.5}
            value={[unitSystem === 'metric' ? 
              getMeasurementValue(type) : 
              convertToImperial(getMeasurementValue(type), type)
            ]}
            onValueChange={(values) => {
              const value = values[0];
              const metricValue = unitSystem === 'metric' ? value : 
                type === 'weight' ? 
                  Math.round(value / 2.20462) : // Convert pounds to kg
                  Math.round(value * 2.54); // Convert inches to cm
              updateMeasurement(type, metricValue);
            }}
          />
        </div>
      ))}
      
      <div className="pt-4">
        <p className="text-sm text-muted-foreground">
          <strong>Need help?</strong> To measure garments accurately, lay them flat on a surface and measure across the specified areas.
        </p>
      </div>
    </div>
  );
};

export default MeasurementsStep;
