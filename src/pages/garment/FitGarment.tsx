
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useFitAssistant } from '@/contexts/FitAssistantContext';
import { GarmentFormData } from '@/types';
import FitPerceptionStep from '@/components/GarmentForm/FitPerceptionStep';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ArrowLeft, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FitGarment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addGarment, updateGarment } = useFitAssistant();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<GarmentFormData>(
    location.state?.formData || { 
      name: '', brand: '', type: '', size: '', color: '', 
      imageUrl: null, imageFile: null, 
      teachFitAssistant: true, 
      measurements: [], fit: [] 
    }
  );
  const isEditMode = location.state?.isEditMode || false;
  const garmentId = location.state?.garmentId || null;
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  
  // Check if measurements and fit data are complete
  const hasMeasurementsAndFit = (): boolean => {
    return formData.measurements.length > 0 && 
      formData.fit.some(f => f.perception !== undefined);
  };
  
  // Handle field changes
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Go back to previous step
  const handlePrev = () => {
    navigate('/garment/create/measurements', { 
      state: { 
        formData,
        isEditMode,
        garmentId
      } 
    });
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
    
    if (isEditMode && garmentId) {
      updateGarment(garmentId, {
        name: finalFormData.name,
        brand: finalFormData.brand,
        type: finalFormData.type,
        size: finalFormData.size,
        color: finalFormData.color,
        imageUrl: finalFormData.imageFile ? URL.createObjectURL(finalFormData.imageFile) : finalFormData.imageUrl,
        teachFitAssistant: finalFormData.teachFitAssistant,
        measurements: finalFormData.measurements,
        fit: finalFormData.fit
      });
      toast({
        title: "Garment Updated",
        description: `${finalFormData.name} has been updated in your closet.`
      });
    } else {
      addGarment(finalFormData);
      toast({
        title: "Garment Added",
        description: `${finalFormData.name} has been added to your closet.`
      });
    }
    navigate('/');
  };
  
  // Handle close with confirmation
  const handleClose = () => {
    setIsExitDialogOpen(true);
  };
  
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-gloock">{isEditMode ? 'Edit Garment' : 'Add New Garment'}</h1>
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
          aria-label="Previous"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> 
          <span className="hidden sm:inline">Previous</span>
        </Button>
        <Button 
          onClick={handleSubmit}
          className="flex items-center"
        >
          {isEditMode ? 'Save Changes' : 'Add to Closet'} <Check className="ml-2 h-4 w-4" />
        </Button>
      </footer>
      
      {/* Exit Confirmation Dialog */}
      <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
            <AlertDialogDescription>
              You've started {isEditMode ? 'editing' : 'adding'} a garment, but your changes haven't been saved. 
              If you leave now, your changes will be lost.
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
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FitGarment;
