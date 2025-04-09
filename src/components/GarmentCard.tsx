
import React, { useState } from 'react';
import { Garment } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Edit, Trash, CheckCircle } from 'lucide-react';

interface GarmentCardProps {
  garment: Garment;
  onEdit: (garment: Garment) => void;
  onDelete: (id: string) => void;
  onToggleFitAssistant: (id: string, value: boolean) => void;
}

const GarmentCard: React.FC<GarmentCardProps> = ({ 
  garment,
  onEdit,
  onDelete,
  onToggleFitAssistant
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const hasCompleteFitData = garment.measurements.length > 0 && 
    garment.fit.every(f => f.perception !== undefined);
  
  return (
    <>
      <Card className="fit-card h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={garment.imageUrl || '/placeholder.svg'}
            alt={garment.name}
            className="w-full h-full object-cover"
          />
          {garment.teachFitAssistant && hasCompleteFitData && (
            <div className="absolute top-2 right-2">
              <span className="fit-badge bg-fit-accent text-fit-charcoal">
                <CheckCircle className="w-3 h-3 mr-1" /> Fit Assistant
              </span>
            </div>
          )}
        </div>
        
        <CardContent className="flex-grow p-4">
          <div className="mb-1 text-sm text-muted-foreground">{garment.brand}</div>
          <h3 className="font-medium mb-1">{garment.name}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-muted px-2 py-0.5 rounded">{garment.size}</span>
            <span>{garment.color}</span>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 border-t flex-col items-stretch space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm mr-4">Teach Fit Assistant</span>
            <Switch 
              checked={garment.teachFitAssistant} 
              onCheckedChange={(checked) => onToggleFitAssistant(garment.id, checked)}
              disabled={!hasCompleteFitData}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => onEdit(garment)}
            >
              <Edit className="w-4 h-4 mr-1" /> Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 text-destructive hover:bg-destructive/10"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash className="w-4 h-4 mr-1" /> Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Garment</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete "{garment.name}"? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onDelete(garment.id);
                setShowDeleteDialog(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GarmentCard;
