
import React, { useState } from 'react';
import { useFitAssistant } from '@/contexts/FitAssistantContext';
import { MeasurementType } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MeasurementSlider from './MeasurementSlider';
import UnitToggle from './UnitToggle';
import { Plus } from 'lucide-react';

// Measurement labels
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

const MeasurementsSection: React.FC = () => {
  const { 
    userProfile, 
    unitSystem, 
    toggleUnitSystem, 
    updateMeasurement,
    addMeasurement
  } = useFitAssistant();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Get value for a specific measurement type
  const getMeasurementValue = (type: MeasurementType): number => {
    if (!userProfile) return 0;
    const measurement = userProfile.measurements.find(m => m.type === type);
    return measurement ? measurement.value : 0;
  };
  
  // Check if a measurement exists in profile
  const hasMeasurement = (type: MeasurementType): boolean => {
    return userProfile?.measurements.some(m => m.type === type) || false;
  };
  
  // Get all measurement types that haven't been added yet
  const getAvailableMeasurements = (): MeasurementType[] => {
    return (Object.keys(MEASUREMENT_LABELS) as MeasurementType[])
      .filter(type => !hasMeasurement(type));
  };
  
  // All measurements have been added
  const allMeasurementsAdded = getAvailableMeasurements().length === 0;
  
  return (
    <section className="my-8 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-gloock mb-4 md:mb-0">My Measurements</h2>
        <UnitToggle value={unitSystem} onChange={toggleUnitSystem} />
      </div>
      
      {userProfile && (
        <div className="space-y-6">
          {userProfile.measurements.map((measurement) => (
            <MeasurementSlider
              key={measurement.type}
              type={measurement.type}
              label={MEASUREMENT_LABELS[measurement.type]}
              value={measurement.value}
              onChange={(value) => updateMeasurement(measurement.type, value)}
            />
          ))}
          
          {!allMeasurementsAdded && (
            <Button 
              variant="outline" 
              className="w-full mt-4 border-dashed"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" /> Add a Measurement
            </Button>
          )}
        </div>
      )}
      
      {/* Add Measurement Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a Measurement</DialogTitle>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6 py-4">
            <div className="hidden md:block">
              {/* Placeholder for body illustration */}
              <div className="aspect-[3/5] bg-fit-beige rounded-lg flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Body measurement illustration</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {getAvailableMeasurements().map((type) => (
                <div 
                  key={type} 
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                  onClick={() => {
                    addMeasurement(type);
                    setIsAddDialogOpen(false);
                  }}
                >
                  <div className="w-4 h-4 rounded-full border border-primary flex-shrink-0" />
                  <span>{MEASUREMENT_LABELS[type]}</span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MeasurementsSection;
