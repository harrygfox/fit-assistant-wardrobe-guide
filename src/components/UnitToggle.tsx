
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { UnitSystem } from '@/types';

interface UnitToggleProps {
  value: UnitSystem;
  onChange: () => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center space-x-4">
      <span className={`text-sm ${value === 'metric' ? 'font-medium' : 'text-muted-foreground'}`}>
        cm/kg
      </span>
      <Switch 
        checked={value === 'imperial'} 
        onCheckedChange={onChange}
      />
      <span className={`text-sm ${value === 'imperial' ? 'font-medium' : 'text-muted-foreground'}`}>
        in/lbs
      </span>
    </div>
  );
};

export default UnitToggle;
