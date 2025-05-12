
import React, { useState } from 'react';
import { useFitAssistant } from '@/contexts/FitAssistantContext';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Ruler } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import UnitToggle from './UnitToggle';

const FitAssistantCard: React.FC = () => {
  const { 
    getFitAssistantGarments, 
    userProfile, 
    unitSystem, 
    toggleUnitSystem, 
    updateMeasurement, 
    convertToImperial 
  } = useFitAssistant();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showHeightInput, setShowHeightInput] = useState(false);
  
  const fitGarments = getFitAssistantGarments();
  const isActive = fitGarments.length >= 5;
  const garmentsNeeded = Math.max(0, 5 - fitGarments.length);
  
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
  
  return (
    <>
      <Card 
        className="fit-card h-full flex flex-col cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="relative aspect-square overflow-hidden bg-white flex flex-col items-center justify-center p-6 h-full">
          <div className="w-16 h-16 mb-4 rounded-full bg-fit-beige flex items-center justify-center">
            <span className="text-2xl font-gloock">
              {fitGarments.length}/5
            </span>
          </div>
          
          <h3 className="text-lg font-medium mb-2 text-center">
            {isActive ? 'Fit Assistant Active' : `Add ${garmentsNeeded} more items`}
          </h3>
          
          <p className="text-sm text-center text-muted-foreground">
            {isActive 
              ? 'Personalized fit recommendations ready'
              : 'Complete to unlock personalized recommendations'
            }
          </p>
          
          {getHeightValue() !== null && (
            <p className="mt-2 text-sm text-center">
              Your height: {formatValue(getHeightValue())}
            </p>
          )}
          
          <button className="mt-4 text-sm underline">How it works</button>
          
          {isActive && (
            <div className="absolute top-3 right-3">
              <span className="fit-badge bg-fit-accent text-fit-charcoal">
                <CheckCircle className="w-3 h-3 mr-1" /> Active
              </span>
            </div>
          )}
        </div>
      </Card>
      
      {/* Fit Assistant Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fit Assistant</DialogTitle>
            <DialogDescription>
              {isActive 
                ? 'Your Fit Assistant is active and learning from your garments.'
                : `Add ${garmentsNeeded} more garments with measurements and fit data to activate Fit Assistant.`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {!showHeightInput ? (
              <>
                <div className="flex items-center justify-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-fit-beige flex items-center justify-center">
                    <span className="text-3xl font-gloock">
                      {fitGarments.length}/5
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Your Height</h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddHeight();
                      }}
                    >
                      {getHeightValue() === null ? "Add" : "Edit"}
                    </Button>
                  </div>
                  
                  {getHeightValue() !== null && (
                    <p className="text-sm">
                      Your height: {formatValue(getHeightValue())}
                    </p>
                  )}
                  
                  <h4 className="font-medium">How Fit Assistant Works</h4>
                  <p className="text-sm">
                    Fit Assistant learns from the garments you mark as "Teach Fit Assistant" and your body measurements.
                  </p>
                  <ul className="list-disc pl-5 text-sm space-y-2">
                    <li>The garment's measurements</li>
                    <li>How you perceive the fit (too tight, just right, etc.)</li>
                    <li>Your body measurements in those areas</li>
                  </ul>
                  <p className="text-sm">
                    With 5 or more garments, it identifies patterns in your preferences to make better sizing recommendations.
                  </p>
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
                </div>
                
                <Button onClick={() => setShowHeightInput(false)} variant="outline" className="w-full">
                  Done
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>
              {isActive ? 'Got it' : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FitAssistantCard;
