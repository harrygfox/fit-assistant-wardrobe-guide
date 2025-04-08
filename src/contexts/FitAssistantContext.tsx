
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  Garment, 
  UnitSystem, 
  MeasurementType,
  BodyMeasurement,
  GarmentFormData,
  FitPerception,
  GarmentFit
} from '../types';

interface FitAssistantContextType {
  userProfile: UserProfile | null;
  garments: Garment[];
  unitSystem: UnitSystem;
  isLoading: boolean;
  setUserProfile: (profile: UserProfile) => void;
  addGarment: (garment: GarmentFormData) => void;
  updateGarment: (id: string, garment: Partial<Garment>) => void;
  deleteGarment: (id: string) => void;
  toggleUnitSystem: () => void;
  updateMeasurement: (type: MeasurementType, value: number) => void;
  addMeasurement: (type: MeasurementType) => void;
  removeMeasurement: (type: MeasurementType) => void;
  convertToImperial: (value: number, type?: MeasurementType) => number;
  convertToMetric: (value: number, type?: MeasurementType) => number;
  getFitAssistantGarments: () => Garment[];
  hasConflictingFitData: (newGarment: GarmentFormData) => Garment[];
}

const FitAssistantContext = createContext<FitAssistantContextType | undefined>(undefined);

// Simulated user profile for now
const DEFAULT_PROFILE: UserProfile = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  measurements: [
    { type: 'height', value: 170 }
  ],
  preferredUnits: 'metric'
};

// Convert cm to inches (rounded to nearest 0.5)
const cmToInches = (cm: number): number => {
  const rawInches = cm / 2.54;
  return Math.round(rawInches * 2) / 2;
};

// Convert kg to lbs
const kgToLbs = (kg: number): number => {
  return Math.round(kg * 2.20462 * 10) / 10;
};

// Convert inches to cm (rounded to nearest cm)
const inchesToCm = (inches: number): number => {
  return Math.round(inches * 2.54);
};

// Convert lbs to kg
const lbsToKg = (lbs: number): number => {
  return Math.round(lbs / 2.20462);
};

export const FitAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(DEFAULT_PROFILE);
  const [garments, setGarments] = useState<Garment[]>([]);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [isLoading, setIsLoading] = useState(false);

  // Toggle between metric and imperial
  const toggleUnitSystem = () => {
    setUnitSystem(prev => prev === 'metric' ? 'imperial' : 'metric');
  };
  
  // Convert to imperial for display
  const convertToImperial = (value: number, type?: MeasurementType): number => {
    if (type === 'weight') {
      return kgToLbs(value);
    }
    return cmToInches(value);
  };
  
  // Convert to metric for storage
  const convertToMetric = (value: number, type?: MeasurementType): number => {
    if (type === 'weight') {
      return lbsToKg(value);
    }
    return inchesToCm(value);
  };
  
  // Add a garment
  const addGarment = (garmentData: GarmentFormData) => {
    const newGarment: Garment = {
      id: `g-${Date.now()}`,
      name: garmentData.name,
      brand: garmentData.brand,
      type: garmentData.type,
      size: garmentData.size,
      color: garmentData.color,
      imageUrl: garmentData.imageFile ? URL.createObjectURL(garmentData.imageFile) : 
               (garmentData.imageUrl || '/placeholder.svg'),
      teachFitAssistant: garmentData.teachFitAssistant,
      measurements: garmentData.measurements,
      fit: garmentData.fit,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setGarments(prev => [...prev, newGarment]);
  };
  
  // Update a garment
  const updateGarment = (id: string, updatedGarment: Partial<Garment>) => {
    setGarments(prev => prev.map(garment => 
      garment.id === id ? { ...garment, ...updatedGarment, updatedAt: new Date() } : garment
    ));
  };
  
  // Delete a garment
  const deleteGarment = (id: string) => {
    setGarments(prev => prev.filter(garment => garment.id !== id));
  };
  
  // Update a body measurement
  const updateMeasurement = (type: MeasurementType, value: number) => {
    if (!userProfile) return;
    
    const updatedMeasurements = userProfile.measurements.map(measurement => 
      measurement.type === type ? { ...measurement, value } : measurement
    );
    
    setUserProfile({
      ...userProfile,
      measurements: updatedMeasurements
    });
  };
  
  // Add a body measurement
  const addMeasurement = (type: MeasurementType) => {
    if (!userProfile) return;
    
    // Check if measurement already exists
    if (userProfile.measurements.some(m => m.type === type)) return;
    
    setUserProfile({
      ...userProfile,
      measurements: [
        ...userProfile.measurements,
        { type, value: 0 } // Default value
      ]
    });
  };
  
  // Remove a body measurement
  const removeMeasurement = (type: MeasurementType) => {
    if (!userProfile) return;
    
    // Don't allow removing height (required)
    if (type === 'height') return;
    
    setUserProfile({
      ...userProfile,
      measurements: userProfile.measurements.filter(m => m.type !== type)
    });
  };
  
  // Get garments used by Fit Assistant
  const getFitAssistantGarments = () => {
    return garments.filter(g => g.teachFitAssistant);
  };
  
  // Check for conflicting fit data
  const hasConflictingFitData = (newGarment: GarmentFormData): Garment[] => {
    const conflicts: Garment[] = [];
    
    // Only check if teaching fit assistant
    if (!newGarment.teachFitAssistant) return conflicts;
    
    // Get existing garments of same type and size
    const similarGarments = garments.filter(g => 
      g.teachFitAssistant && g.type === newGarment.type && g.size === newGarment.size
    );
    
    // Check each fit perception for conflicts
    newGarment.fit.forEach(newFit => {
      // Skip undefined perceptions
      if (newFit.perception === undefined) return;
      
      similarGarments.forEach(existingGarment => {
        const existingFit = existingGarment.fit.find(
          f => f.measurementType === newFit.measurementType
        );
        
        if (existingFit && existingFit.perception !== undefined && 
            existingFit.perception !== newFit.perception) {
          if (!conflicts.includes(existingGarment)) {
            conflicts.push(existingGarment);
          }
        }
      });
    });
    
    return conflicts;
  };
  
  const value = {
    userProfile,
    garments,
    unitSystem,
    isLoading,
    setUserProfile,
    addGarment,
    updateGarment,
    deleteGarment,
    toggleUnitSystem,
    updateMeasurement,
    addMeasurement,
    removeMeasurement,
    convertToImperial,
    convertToMetric,
    getFitAssistantGarments,
    hasConflictingFitData
  };
  
  return (
    <FitAssistantContext.Provider value={value}>
      {children}
    </FitAssistantContext.Provider>
  );
};

export const useFitAssistant = () => {
  const context = useContext(FitAssistantContext);
  if (context === undefined) {
    throw new Error('useFitAssistant must be used within a FitAssistantProvider');
  }
  return context;
};
