
import React, { useState } from 'react';
import { useFitAssistant } from '@/contexts/FitAssistantContext';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const FitAssistantCard: React.FC = () => {
  const { getFitAssistantGarments } = useFitAssistant();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const fitGarments = getFitAssistantGarments();
  const isActive = fitGarments.length >= 5;
  const garmentsNeeded = Math.max(0, 5 - fitGarments.length);
  
  return (
    <>
      <Card 
        className="fit-card h-full flex flex-col cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="relative aspect-square overflow-hidden bg-white flex flex-col items-center justify-center p-6 h-full">
          <div className="w-16 h-16 mb-4 rounded-full bg-fit-beige flex items-center justify-center">
            <span className="text-2xl font-gloock">
              {fitGarments.length}/5
            </span>
          </div>
          
          <h3 className="text-lg font-medium mb-2 text-center">
            {isActive ? 'Fit Assistant Active' : `Add ${garmentsNeeded} more items`}
          </h3>
          
          <p className="text-sm text-center text-muted-foreground">
            {isActive 
              ? 'Personalized fit recommendations ready'
              : 'Complete to unlock personalized recommendations'
            }
          </p>
          
          <button className="mt-4 text-sm underline">How it works</button>
          
          {isActive && (
            <div className="absolute top-3 right-3">
              <span className="fit-badge bg-fit-accent text-fit-charcoal">
                <CheckCircle className="w-3 h-3 mr-1" /> Active
              </span>
            </div>
          )}
        </div>
      </Card>
      
      {/* Fit Assistant Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fit Assistant</DialogTitle>
            <DialogDescription>
              {isActive 
                ? 'Your Fit Assistant is active and learning from your garments.'
                : `Add ${garmentsNeeded} more garments with measurements and fit data to activate Fit Assistant.`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-fit-beige flex items-center justify-center">
                <span className="text-3xl font-gloock">
                  {fitGarments.length}/5
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">How Fit Assistant Works</h4>
              <p className="text-sm">
                Fit Assistant learns from the garments you mark as "Teach Fit Assistant" and your body measurements.
              </p>
              <ul className="list-disc pl-5 text-sm space-y-2">
                <li>The garment's measurements</li>
                <li>How you perceive the fit (too tight, just right, etc.)</li>
                <li>Your body measurements in those areas</li>
              </ul>
              <p className="text-sm">
                With 5 or more garments, it identifies patterns in your preferences to make better sizing recommendations.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>
              {isActive ? 'Got it' : 'Add garments later'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FitAssistantCard;
