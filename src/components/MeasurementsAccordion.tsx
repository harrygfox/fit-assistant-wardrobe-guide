
import React, { useState, useEffect } from 'react';
import { useFitAssistant } from '@/contexts/FitAssistantContext';
import { MeasurementType } from '@/types';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MeasurementSlider from './MeasurementSlider';
import UnitToggle from './UnitToggle';
import { Plus, Ruler } from 'lucide-react';

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

const MeasurementsAccordion: React.FC = () => {
  const { 
    userProfile, 
    unitSystem, 
    toggleUnitSystem, 
    updateMeasurement,
    addMeasurement
  } = useFitAssistant();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [accordionValue, setAccordionValue] = useState<string>('');

  // Determine if user has added any measurements
  const hasMeasurements = userProfile?.measurements.length > 0;
  
  // Effect to handle the default open/close state based on measurements
  useEffect(() => {
    if (!hasMeasurements) {
      // First use or no measurements - open by default
      setAccordionValue('measurements');
    } else {
      // Has measurements - check localStorage for previous state
      const savedState = localStorage.getItem('measurementsAccordionState');
      if (savedState) {
        setAccordionValue(savedState);
      } else {
        // Default to closed after user has added measurements
        setAccordionValue('');
      }
    }
  }, [hasMeasurements]);

  // Save the accordion state when it changes
  const handleAccordionChange = (value: string) => {
    setAccordionValue(value);
    if (hasMeasurements) {
      localStorage.setItem('measurementsAccordionState', value);
    }
  };
  
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
  
  // Calculate the measurements badge content
  const measurementsBadge = userProfile ? 
    `${userProfile.measurements.length}/${Object.keys(MEASUREMENT_LABELS).length}` : 
    '0/12';
  
  return (
    <section className="my-8 max-w-3xl mx-auto">
      <Accordion 
        type="single" 
        collapsible 
        className="w-full" 
        value={accordionValue}
        onValueChange={handleAccordionChange}
      >
        <AccordionItem value="measurements">
          <AccordionTrigger className="flex justify-between py-4">
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              <span>My Measurements</span>
              <Badge variant="measurement" className="ml-2 text-xs">
                {measurementsBadge}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 pb-2">
              <div className="flex justify-end mb-6">
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
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Add Measurement Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a Measurement</DialogTitle>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6 py-4">
            <div className="bg-fit-beige hidden md:flex items-center justify-center h-full">
              <div className="aspect-[3/5] rounded-lg flex items-center justify-center">
                <img 
                  src={`${import.meta.env.BASE_URL}dressmakers-dummy.png`}
                  alt="Body measurement illustration" 
                  className="h-full object-contain"
                />
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

export default MeasurementsAccordion;
