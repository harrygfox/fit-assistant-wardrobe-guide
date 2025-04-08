
import React, { useState } from 'react';
import { useFitAssistant } from '@/contexts/FitAssistantContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GarmentCard from './GarmentCard';
import EmptyCloset from './EmptyCloset';
import { Plus } from 'lucide-react';
import { Garment } from '@/types';

type SortOption = 'fitAssistant' | 'updated' | 'type';

const ClosetSection: React.FC<{
  onAddGarment: () => void;
  onEditGarment: (garment: Garment) => void;
}> = ({ onAddGarment, onEditGarment }) => {
  const { garments, updateGarment, deleteGarment } = useFitAssistant();
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  
  // Sort garments based on selected option
  const sortedGarments = [...garments].sort((a, b) => {
    switch (sortBy) {
      case 'fitAssistant':
        if (a.teachFitAssistant === b.teachFitAssistant) {
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        }
        return a.teachFitAssistant ? -1 : 1;
      case 'updated':
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      case 'type':
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });
  
  // Toggle Fit Assistant for a garment
  const handleToggleFitAssistant = (id: string, value: boolean) => {
    updateGarment(id, { teachFitAssistant: value });
  };
  
  return (
    <section className="my-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-gloock mb-4 sm:mb-0">My Closet</h2>
        
        <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          {garments.length > 0 && (
            <Select 
              defaultValue="updated"
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="fitAssistant">Fit Assistant</SelectItem>
                <SelectItem value="type">Garment Type</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          <Button onClick={onAddGarment}>
            <Plus className="w-4 h-4 mr-2" /> Add Garment
          </Button>
        </div>
      </div>
      
      {garments.length === 0 ? (
        <EmptyCloset onAddGarment={onAddGarment} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedGarments.map((garment) => (
            <GarmentCard 
              key={garment.id} 
              garment={garment}
              onEdit={onEditGarment}
              onDelete={deleteGarment}
              onToggleFitAssistant={handleToggleFitAssistant}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ClosetSection;
