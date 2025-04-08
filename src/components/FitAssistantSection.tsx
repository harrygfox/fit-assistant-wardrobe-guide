
import React from 'react';
import { useFitAssistant } from '@/contexts/FitAssistantContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FitAssistantSection: React.FC = () => {
  const { getFitAssistantGarments } = useFitAssistant();
  
  const fitGarments = getFitAssistantGarments();
  const isActive = fitGarments.length >= 5;
  const garmentsNeeded = Math.max(0, 5 - fitGarments.length);
  
  return (
    <section className="my-12 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-gloock">Fit Assistant</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm">
            {isActive ? 'Active' : 'Inactive'}
          </span>
          <Switch checked={isActive} disabled />
        </div>
      </div>
      
      <Card className="bg-fit-light border border-fit-beige">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-fit-beige flex items-center justify-center">
                <span className="text-3xl font-gloock">
                  {fitGarments.length}/5
                </span>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <h3 className="text-xl font-medium mb-2">
                {isActive 
                  ? 'Your Fit Assistant is active!' 
                  : `Add ${garmentsNeeded} more garments to activate`
                }
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4">
                {isActive 
                  ? 'Fit Assistant is learning from your garments and will provide personalized fit recommendations.'
                  : 'Fit Assistant needs at least 5 garments with complete measurement and fit data to provide accurate recommendations.'
                }
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="how-it-works">
                  <AccordionTrigger className="text-sm font-medium">
                    How Fit Assistant Works
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm mb-2">
                      Fit Assistant learns from the garments you mark as "Teach Fit Assistant" and your body measurements.
                    </p>
                    <p className="text-sm mb-2">
                      For each garment, it understands:
                    </p>
                    <ul className="list-disc pl-5 text-sm mb-2 space-y-1">
                      <li>The garment's measurements</li>
                      <li>How you perceive the fit (too tight, just right, etc.)</li>
                      <li>Your body measurements in those areas</li>
                    </ul>
                    <p className="text-sm">
                      With 5 or more garments, it identifies patterns in your preferences to make better sizing recommendations.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FitAssistantSection;
