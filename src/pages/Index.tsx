
import React from 'react';
import ClosetSection from '@/components/ClosetSection';
import { useNavigate } from 'react-router-dom';
import { Garment } from '@/types';

const Index = () => {
  const navigate = useNavigate();
  
  const handleOpenGarmentForm = () => {
    navigate('/garment/create');
  };
  
  const handleEditGarment = (garment: Garment) => {
    // Navigate to the edit page
    // For now, we'll just log the garment as edit functionality 
    // will be implemented in a future update
    console.log("Edit garment:", garment);
    navigate(`/garment/create?id=${garment.id}`);
  };

  return (
    <div className="container py-8">
      <ClosetSection 
        onAddGarment={handleOpenGarmentForm}
        onEditGarment={handleEditGarment}
      />
    </div>
  );
};

export default Index;
