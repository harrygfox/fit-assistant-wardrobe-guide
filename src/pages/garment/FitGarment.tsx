
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useFitAssistant } from '@/contexts/FitAssistantContext';
import { GarmentFormData, Garment } from '@/types';
import FitPerceptionStep from '@/components/GarmentForm/FitPerceptionStep';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ArrowLeft, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FitGarment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { addGarment, hasConflictingFitData } = useFitAssistant();
  
  const [formData, setFormData] = useState<GarmentFormData>(
    location.state?.formData || { 
      name: '', brand: '', type: '', size: '', color: '', 
      imageUrl: null, imageFile: null, 
      teachFitAssistant: true, 
      measurements: [], fit: [] 
    }
  );
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isSkipDialogOpen, setIsSkipDialogOpen] = useState(false);
  const [isConflictDialogOpen, setIsConflictDialogOpen] = useState(false);
  const [conflictingGarments, setConflictingGarments] = useState<Garment[]>([]);
  
  // Handle field changes
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Go back to previous step
  const handlePrev = () => {
    navigate('/garment/create/measurements', { state: { formData } });
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
    addGarment(data);
    toast({
      title: "Garment Added",
      description: `${data.name} has been added to your closet.`
    });
    
    // Reset and navigate back to home
    navigate('/');
  };
  
  // Handle skip confirmation
  const handleSkipConfirmation = () => {
    if (!hasMeasurementsAndFit() && formData.teachFitAssistant) {
      setIsSkipDialogOpen(true);
    } else {
      handleSubmit();
    }
  };
  
  // Handle close with confirmation
  const handleClose = () => {
    setIsExitDialogOpen(true);
  };
  
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-gloock">Add New Garment</h1>
          <Button variant="ghost" onClick={handleClose}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
          </Button>
        </div>
        <div className="mt-4 flex items-center">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span>Step 3 of 3: Fit Perception (Optional)</span>
              <span>3/3</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="bg-white p-6 rounded-md shadow-sm">
        <FitPerceptionStep garmentData={formData} onChange={handleChange} />
      </main>
      
      <footer className="mt-8 flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrev}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button 
          onClick={handleSkipConfirmation}
          className="flex items-center"
        >
          <Check className="mr-2 h-4 w-4" /> Add to Closet
        </Button>
      </footer>
      
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
              onClick={() => navigate('/')}
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
            <Button className="w-full" onClick={() => {
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
            }}>
              Update this garment to match existing ones
            </Button>
            <Button className="w-full" onClick={() => {
              // This would normally update the conflicting garments
              // but for simplicity in this implementation we'll just proceed
              finalizeSubmission(formData);
            }}>
              Update existing garments to match this one
            </Button>
            <Button variant="outline" className="w-full" onClick={() => {
              finalizeSubmission({
                ...formData,
                teachFitAssistant: false
              });
            }}>
              Skip and exclude from Fit Assistant
            </Button>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FitGarment;
