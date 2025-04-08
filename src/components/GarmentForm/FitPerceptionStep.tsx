
import React from 'react';
import { GarmentFormData, GarmentType, GARMENT_MEASUREMENTS, MeasurementType, FitPerception } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface FitPerceptionStepProps {
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

const FitPerceptionStep: React.FC<FitPerceptionStepProps> = ({ garmentData, onChange }) => {
  const fitTypes = GARMENT_MEASUREMENTS[garmentData.type as GarmentType] || [];
  const hasMeasurements = garmentData.measurements.length > 0;
  
  const updateFitPerception = (measurementType: MeasurementType, perception: FitPerception) => {
    const updatedFit = [...garmentData.fit];
    const existingIndex = updatedFit.findIndex(f => f.measurementType === measurementType);
    
    if (existingIndex >= 0) {
      updatedFit[existingIndex] = { ...updatedFit[existingIndex], perception };
    } else {
      updatedFit.push({ measurementType, perception });
    }
    
    onChange('fit', updatedFit);
  };
  
  const getPerceptionValue = (measurementType: MeasurementType): FitPerception => {
    const fit = garmentData.fit.find(f => f.measurementType === measurementType);
    return fit ? fit.perception : undefined;
  };
  
  if (!hasMeasurements) {
    return (
      <Alert variant="warning" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          This garment won't be used by the Fit Assistant unless measurements and fit perception are provided.
          Please go back to Step 2 to add measurements first.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        How does this garment feel when you wear it? This helps Fit Assistant understand your preferences.
      </p>
      
      {fitTypes.length === 0 ? (
        <Alert>
          <AlertDescription>
            No fit areas are defined for this garment type. Please select a different garment type.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {fitTypes.map(measurementType => (
            <div key={measurementType} className="space-y-2">
              <label className="text-sm font-medium">
                {MEASUREMENT_LABELS[measurementType]} Fit
              </label>
              <Select
                value={getPerceptionValue(measurementType) || ''}
                onValueChange={(value) => updateFitPerception(
                  measurementType, 
                  value === '' ? undefined : value as FitPerception
                )}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fit perception" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Not specified</SelectItem>
                  <SelectItem value="too tight">Too Tight</SelectItem>
                  <SelectItem value="slightly tight">Slightly Tight</SelectItem>
                  <SelectItem value="just right">Just Right</SelectItem>
                  <SelectItem value="slightly loose">Slightly Loose</SelectItem>
                  <SelectItem value="too loose">Too Loose</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FitPerceptionStep;
