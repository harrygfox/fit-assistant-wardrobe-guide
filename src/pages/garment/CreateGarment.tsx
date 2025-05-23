
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useFitAssistant } from '@/contexts/FitAssistantContext';
import { GarmentFormData, GarmentCreationStep } from '@/types';
import DetailsStep from '@/components/GarmentForm/DetailsStep';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Initial form data
const initialFormData: GarmentFormData = {
  name: '',
  brand: '',
  type: 'tshirt', // Default to a valid GarmentType
  size: '',
  color: '',
  imageUrl: null,
  imageFile: null,
  teachFitAssistant: true,
  measurements: [],
  fit: []
};

const CreateGarment: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const garmentId = searchParams.get('id');
  const { garments } = useFitAssistant();
  
  const [formData, setFormData] = useState<GarmentFormData>(initialFormData);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Load existing garment data if in edit mode
  useEffect(() => {
    if (garmentId) {
      const existingGarment = garments.find(g => g.id === garmentId);
      if (existingGarment) {
        setIsEditMode(true);
        setFormData({
          name: existingGarment.name,
          brand: existingGarment.brand,
          type: existingGarment.type,
          size: existingGarment.size,
          color: existingGarment.color,
          imageUrl: existingGarment.imageUrl,
          imageFile: null,
          teachFitAssistant: existingGarment.teachFitAssistant,
          measurements: [...existingGarment.measurements],
          fit: [...existingGarment.fit]
        });
      }
    }
  }, [garmentId, garments]);
  
  // Handle field changes
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Check if current step is complete
  const isStepComplete = (): boolean => {
    return (
      formData.name.trim() !== '' &&
      formData.brand.trim() !== '' &&
      formData.type !== undefined &&
      formData.size.trim() !== '' &&
      formData.color.trim() !== '' &&
      (formData.imageUrl !== null || formData.imageFile !== null)
    );
  };
  
  // Handle next step
  const handleNext = () => {
    if (isStepComplete()) {
      navigate('/garment/create/measurements', { state: { formData, isEditMode, garmentId } });
    }
  };
  
  // Handle close with confirmation
  const handleClose = () => {
    if (
      formData.name !== '' || 
      formData.imageUrl !== null || 
      formData.measurements.length > 0 ||
      formData.fit.length > 0
    ) {
      setIsExitDialogOpen(true);
    } else {
      navigate('/');
    }
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
              <span>Step 1 of 3: Garment Details</span>
              <span>1/3</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '33.33%' }}></div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="bg-white p-6 rounded-md shadow-sm">
        <DetailsStep garmentData={formData} onChange={handleChange} />
      </main>
      
      <footer className="mt-8 flex justify-end">
        <Button 
          onClick={handleNext}
          disabled={!isStepComplete()}
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

export default CreateGarment;
