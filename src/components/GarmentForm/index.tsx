
import React, { useState, useEffect } from 'react';
import { useFitAssistant } from '@/contexts/FitAssistantContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import DetailsStep from './DetailsStep';
import MeasurementsStep from './MeasurementsStep';
import FitPerceptionStep from './FitPerceptionStep';
import { GarmentFormData, GarmentCreationStep, Garment, FitPerception } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface GarmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  editGarment?: Garment;
}

const STEP_TITLES = [
  'Garment Details',
  'Garment Measurements (Optional)',
  'Fit Perception (Optional)'
];

// Initial form data
const initialFormData: GarmentFormData = {
  name: '',
  brand: '',
  type: 'tshirt',
  size: '',
  color: '',
  imageUrl: null,
  imageFile: null,
  teachFitAssistant: true,
  measurements: [],
  fit: []
};

const GarmentForm: React.FC<GarmentFormProps> = ({ isOpen, onClose, editGarment }) => {
  const { addGarment, updateGarment, hasConflictingFitData } = useFitAssistant();
  const { toast } = useToast();
  
  const [step, setStep] = useState<GarmentCreationStep>(1);
  const [formData, setFormData] = useState<GarmentFormData>(initialFormData);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isSkipDialogOpen, setIsSkipDialogOpen] = useState(false);
  const [isConflictDialogOpen, setIsConflictDialogOpen] = useState(false);
  const [conflictingGarments, setConflictingGarments] = useState<Garment[]>([]);
  
  // Setup form when editing a garment
  useEffect(() => {
    if (editGarment) {
      setFormData({
        name: editGarment.name,
        brand: editGarment.brand,
        type: editGarment.type,
        size: editGarment.size,
        color: editGarment.color,
        imageUrl: editGarment.imageUrl,
        imageFile: null,
        teachFitAssistant: editGarment.teachFitAssistant,
        measurements: [...editGarment.measurements],
        fit: [...editGarment.fit]
      });
    } else {
      // Reset form when adding a new garment
      setFormData(initialFormData);
      setStep(1);
    }
  }, [editGarment, isOpen]);
  
  // Handle field changes
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Next step
  const handleNext = () => {
    if (step < 3) {
      setStep(prev => (prev + 1) as GarmentCreationStep);
    } else {
      handleSubmit();
    }
  };
  
  // Previous step
  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => (prev - 1) as GarmentCreationStep);
    }
  };
  
  // Check if current step is complete
  const isStepComplete = (): boolean => {
    switch (step) {
      case 1:
        return (
          formData.name.trim() !== '' &&
          formData.brand.trim() !== '' &&
          // Fix: Check if type is a valid GarmentType instead of comparing to empty string
          formData.type !== undefined &&
          formData.size.trim() !== '' &&
          formData.color.trim() !== '' &&
          (formData.imageUrl !== null || formData.imageFile !== null)
        );
      case 2:
        // Step 2 is optional, always allow proceeding
        return true;
      case 3:
        // Step 3 is optional, always allow proceeding
        return true;
      default:
        return false;
    }
  };
  
  // Check if measurements and fit data are complete
  const hasMeasurementsAndFit = (): boolean => {
    return formData.measurements.length > 0 && 
      formData.fit.some(f => f.perception !== undefined);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Check if garment has complete fit data
    const shouldEnableFitAssistant = hasMeasurementsAndFit();
    
    // Update the teachFitAssistant flag based on data completeness
    const finalFormData = {
      ...formData,
      teachFitAssistant: shouldEnableFitAssistant && formData.teachFitAssistant
    };
    
    // Check for conflicts only if teaching Fit Assistant
    if (finalFormData.teachFitAssistant) {
      const conflicts = hasConflictingFitData(finalFormData);
      if (conflicts.length > 0) {
        setConflictingGarments(conflicts);
        setIsConflictDialogOpen(true);
        return;
      }
    }
    
    // Proceed with submission
    finalizeSubmission(finalFormData);
  };
  
  // Complete the submission process
  const finalizeSubmission = (data: GarmentFormData) => {
    if (editGarment) {
      updateGarment(editGarment.id, {
        name: data.name,
        brand: data.brand,
        type: data.type,
        size: data.size,
        color: data.color,
        imageUrl: data.imageFile ? URL.createObjectURL(data.imageFile) : data.imageUrl,
        teachFitAssistant: data.teachFitAssistant,
        measurements: data.measurements,
        fit: data.fit
      });
      toast({
        title: "Garment Updated",
        description: `${data.name} has been updated in your closet.`
      });
    } else {
      addGarment(data);
      toast({
        title: "Garment Added",
        description: `${data.name} has been added to your closet.`
      });
    }
    
    // Reset and close
    handleCloseForm();
  };
  
  // Handle form close with confirmation if needed
  const handleCloseForm = () => {
    if (
      formData.name !== '' || 
      formData.imageUrl !== null || 
      formData.measurements.length > 0 ||
      formData.fit.length > 0
    ) {
      setIsExitDialogOpen(true);
    } else {
      resetAndClose();
    }
  };
  
  // Reset form and close modal
  const resetAndClose = () => {
    setFormData(initialFormData);
    setStep(1);
    onClose();
  };
  
  // Handle skip confirmation
  const handleSkipConfirmation = () => {
    if (!hasMeasurementsAndFit() && formData.teachFitAssistant) {
      setIsSkipDialogOpen(true);
    } else {
      handleSubmit();
    }
  };
  
  // Update existing garments to match this one's fit
  const updateConflictingGarments = () => {
    conflictingGarments.forEach(garment => {
      const updatedFit = [...garment.fit];
      
      formData.fit.forEach(newFit => {
        if (newFit.perception !== undefined) {
          const existingIndex = updatedFit.findIndex(
            f => f.measurementType === newFit.measurementType
          );
          
          if (existingIndex >= 0) {
            updatedFit[existingIndex].perception = newFit.perception;
          }
        }
      });
      
      updateGarment(garment.id, { fit: updatedFit });
    });
    
    finalizeSubmission(formData);
  };
  
  // Update this garment to match the existing ones
  const updateCurrentGarment = () => {
    const updatedFit = [...formData.fit];
    
    if (conflictingGarments.length > 0) {
      const referenceGarment = conflictingGarments[0];
      
      updatedFit.forEach((fit, index) => {
        const referenceFit = referenceGarment.fit.find(
          f => f.measurementType === fit.measurementType
        );
        
        if (referenceFit && referenceFit.perception !== undefined) {
          updatedFit[index].perception = referenceFit.perception;
        }
      });
    }
    
    finalizeSubmission({
      ...formData,
      fit: updatedFit
    });
  };
  
  // Skip Fit Assistant
  const skipFitAssistant = () => {
    finalizeSubmission({
      ...formData,
      teachFitAssistant: false
    });
  };
  
  // Render form step
  const renderStep = () => {
    switch (step) {
      case 1:
        return <DetailsStep garmentData={formData} onChange={handleChange} />;
      case 2:
        return <MeasurementsStep garmentData={formData} onChange={handleChange} />;
      case 3:
        return <FitPerceptionStep garmentData={formData} onChange={handleChange} />;
      default:
        return null;
    }
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md md:max-w-lg" onInteractOutside={(e) => {
          e.preventDefault();
          handleCloseForm();
        }}>
          <DialogHeader>
            <DialogTitle>
              {editGarment ? 'Edit Garment' : 'Add Garment'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Step {step} of 3: {STEP_TITLES[step-1]}</span>
              <span>{step}/3</span>
            </div>
            <Progress value={step * 33.33} className="h-2" />
          </div>
          
          {renderStep()}
          
          <DialogFooter className="flex-col sm:flex-row gap-2 justify-between">
            <Button variant="ghost" onClick={handleCloseForm}>
              Cancel
            </Button>
            
            <div className="flex gap-2">
              {step > 1 && (
                <Button variant="outline" onClick={handlePrev}>
                  Previous
                </Button>
              )}
              
              {step < 3 ? (
                <Button 
                  onClick={handleNext}
                  disabled={!isStepComplete()}
                >
                  Next
                </Button>
              ) : (
                <Button onClick={handleSkipConfirmation}>
                  {editGarment ? 'Save Changes' : 'Add to Closet'}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Exit Confirmation Dialog */}
      <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
            <AlertDialogDescription>
              You've started adding a new garment, but your changes haven't been saved. 
              If you leave now, this garment will be lost from your closet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsExitDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={resetAndClose}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Discard Garment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Skip Confirmation Dialog */}
      <AlertDialog open={isSkipDialogOpen} onOpenChange={setIsSkipDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Missing fit data</AlertDialogTitle>
            <AlertDialogDescription>
              You're adding this garment without measurements or fit data. 
              It will not help train your Fit Assistant. You can edit this later from your Closet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsSkipDialogOpen(false)}>
              Go Back and Add Fit Info
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setIsSkipDialogOpen(false);
              finalizeSubmission({
                ...formData,
                teachFitAssistant: false
              });
            }}>
              Continue Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Conflict Resolution Dialog */}
      <AlertDialog open={isConflictDialogOpen} onOpenChange={setIsConflictDialogOpen}>
        <AlertDialogContent className="max-w-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Fit Perception Conflict</AlertDialogTitle>
            <AlertDialogDescription>
              This garment's fit information conflicts with similar garments in your closet.
              How would you like to resolve this?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">New Garment</h4>
              <p className="text-sm">{formData.name}</p>
              <p className="text-sm">{formData.size}</p>
              <div className="mt-2">
                <h5 className="text-sm font-medium">Fit Perception:</h5>
                <ul className="text-sm">
                  {formData.fit
                    .filter(f => f.perception !== undefined)
                    .map(f => (
                      <li key={f.measurementType}>
                        {f.measurementType}: {f.perception}
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Conflicting Garments</h4>
              <ul className="text-sm space-y-2">
                {conflictingGarments.map(garment => (
                  <li key={garment.id} className="border-b pb-2">
                    <p>{garment.name}</p>
                    <p>{garment.size}</p>
                    {garment.fit
                      .filter(f => f.perception !== undefined)
                      .map(f => (
                        <span key={f.measurementType} className="block text-xs">
                          {f.measurementType}: {f.perception}
                        </span>
                      ))
                    }
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <AlertDialogFooter className="flex-col space-y-2">
            <Button 
              className="w-full" 
              onClick={updateCurrentGarment}
            >
              Update this garment to match existing ones
            </Button>
            <Button 
              className="w-full" 
              onClick={updateConflictingGarments}
            >
              Update existing garments to match this one
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={skipFitAssistant}
            >
              Skip and exclude from Fit Assistant
            </Button>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GarmentForm;
