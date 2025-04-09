
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GarmentFormData } from '@/types';
import MeasurementsStep from '@/components/GarmentForm/MeasurementsStep';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const MeasurementsGarment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<GarmentFormData>(
    location.state?.formData || { 
      name: '', brand: '', type: '', size: '', color: '', 
      imageUrl: null, imageFile: null, 
      teachFitAssistant: true, 
      measurements: [], fit: [] 
    }
  );
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const isEditMode = location.state?.isEditMode || false;
  const garmentId = location.state?.garmentId || null;
  
  // Handle field changes
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Go back to previous step
  const handlePrev = () => {
    navigate('/garment/create', { state: { formData } });
  };
  
  // Go to next step
  const handleNext = () => {
    navigate('/garment/create/fit', { 
      state: { 
        formData,
        isEditMode,
        garmentId
      } 
    });
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
              <span>Step 2 of 3: Garment Measurements (Optional)</span>
              <span>2/3</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '66.66%' }}></div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="bg-white p-6 rounded-md shadow-sm">
        <MeasurementsStep garmentData={formData} onChange={handleChange} />
      </main>
      
      <footer className="mt-8 flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrev}
          className="flex items-center md:w-auto sm:w-auto"
          aria-label="Previous"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> 
          <span className="hidden sm:inline">Previous</span>
        </Button>
        <Button 
          onClick={handleNext}
          className="flex items-center"
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
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

export default MeasurementsGarment;
