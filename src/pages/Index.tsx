
import React from 'react';
import MeasurementsAccordion from '@/components/MeasurementsAccordion';
import FitAssistantSection from '@/components/FitAssistantSection';
import ClosetSection from '@/components/ClosetSection';
import { useNavigate } from 'react-router-dom';
import { Garment } from '@/types';

const Index = () => {
  const navigate = useNavigate();
  
  const handleOpenGarmentForm = () => {
    navigate('/garment/create');
  };
  
  const handleEditGarment = (garment: Garment) => {
    // For now, we'll only implement adding new garments
    // Editing will be implemented in a future update
    console.log("Edit garment:", garment);
  };

  return (
    <div className="container py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-gloock mb-2">My Closet</h1>
        <p className="text-muted-foreground">
          Track your garments and get personalized fit recommendations
        </p>
      </header>
      
      <MeasurementsAccordion />
      
      <FitAssistantSection />
      
      <ClosetSection 
        onAddGarment={handleOpenGarmentForm}
        onEditGarment={handleEditGarment}
      />
    </div>
  );
};

export default Index;
