
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GarmentFormData } from '@/types';
import MeasurementsStep from '@/components/GarmentForm/MeasurementsStep';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FitAssistantProvider } from '@/contexts/FitAssistantContext';

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
    navigate('/garment/create/fit', { state: { formData } });
  };
  
  // Handle close with confirmation
  const handleClose = () => {
    setIsExitDialogOpen(true);
  };
  
  return (
    <FitAssistantProvider>
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
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
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
      </div>
    </FitAssistantProvider>
  );
};

export default MeasurementsGarment;
