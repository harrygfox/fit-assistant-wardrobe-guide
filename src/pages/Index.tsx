
import React, { useState } from 'react';
import { FitAssistantProvider } from '@/contexts/FitAssistantContext';
import MeasurementsSection from '@/components/MeasurementsSection';
import FitAssistantSection from '@/components/FitAssistantSection';
import ClosetSection from '@/components/ClosetSection';
import GarmentForm from '@/components/GarmentForm';
import { Garment } from '@/types';

const Index = () => {
  const [isGarmentFormOpen, setIsGarmentFormOpen] = useState(false);
  const [editingGarment, setEditingGarment] = useState<Garment | undefined>(undefined);
  
  const handleOpenGarmentForm = () => {
    setEditingGarment(undefined);
    setIsGarmentFormOpen(true);
  };
  
  const handleEditGarment = (garment: Garment) => {
    setEditingGarment(garment);
    setIsGarmentFormOpen(true);
  };
  
  const handleCloseGarmentForm = () => {
    setIsGarmentFormOpen(false);
    setEditingGarment(undefined);
  };

  return (
    <FitAssistantProvider>
      <div className="container py-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-gloock mb-2">My Closet</h1>
          <p className="text-muted-foreground">
            Track your garments and get personalized fit recommendations
          </p>
        </header>
        
        <MeasurementsSection />
        
        <FitAssistantSection />
        
        <ClosetSection 
          onAddGarment={handleOpenGarmentForm}
          onEditGarment={handleEditGarment}
        />
        
        <GarmentForm 
          isOpen={isGarmentFormOpen}
          onClose={handleCloseGarmentForm}
          editGarment={editingGarment}
        />
      </div>
    </FitAssistantProvider>
  );
};

export default Index;
