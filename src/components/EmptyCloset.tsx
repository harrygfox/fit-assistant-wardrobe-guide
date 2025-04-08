
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyClosetProps {
  onAddGarment: () => void;
}

const EmptyCloset: React.FC<EmptyClosetProps> = ({ onAddGarment }) => {
  return (
    <div className="border-2 border-dashed border-fit-beige rounded-lg p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-fit-beige rounded-full flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-10 h-10 text-fit-taupe"
            >
              <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z" />
              <path d="M3 10h18" />
              <path d="M7 3v14" />
            </svg>
          </div>
          
          <h3 className="text-xl font-gloock mb-2">Let's build your smart wardrobe</h3>
          <p className="text-muted-foreground mb-6">
            Add your first piece and help Fit Assistant learn what fits you best.
          </p>
        </div>
        
        <Button onClick={onAddGarment} className="mb-6">
          <Plus className="w-4 h-4 mr-2" /> Add Your First Garment
        </Button>
        
        <p className="text-sm text-muted-foreground">
          Start with something you wear often and love the fit of.
        </p>
        
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-muted p-4 rounded-lg aspect-square flex items-center justify-center text-sm text-muted-foreground">
            <p>Where your favorite jeans go</p>
          </div>
          <div className="bg-muted p-4 rounded-lg aspect-square flex items-center justify-center text-sm text-muted-foreground">
            <p>The shirt that fits just right</p>
          </div>
        </div>
        
        <p className="mt-6 text-xs text-muted-foreground">
          0 garments teaching Fit Assistant. Add one to start improving your recommendations.
        </p>
      </div>
    </div>
  );
};

export default EmptyCloset;
