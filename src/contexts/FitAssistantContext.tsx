
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

// LOCAL STORAGE KEYS
const STORAGE_KEYS = {
  GARMENTS: 'fit_assistant_garments',
  USER_PROFILE: 'fit_assistant_user_profile',
  UNIT_SYSTEM: 'fit_assistant_unit_system'
};

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

// Helper function to safely parse stored garments
const parseStoredGarments = (storedGarments: string | null): Garment[] => {
  if (!storedGarments) return [];
  
  try {
    const parsedGarments = JSON.parse(storedGarments);
    return parsedGarments.map((garment: any) => ({
      ...garment,
      createdAt: new Date(garment.createdAt),
      updatedAt: new Date(garment.updatedAt)
    }));
  } catch (error) {
    console.error('Error parsing stored garments:', error);
    return [];
  }
};

// Helper function to safely parse stored user profile
const parseStoredUserProfile = (storedProfile: string | null): UserProfile | null => {
  if (!storedProfile) return DEFAULT_PROFILE;
  
  try {
    return JSON.parse(storedProfile);
  } catch (error) {
    console.error('Error parsing stored user profile:', error);
    return DEFAULT_PROFILE;
  }
};

export const FitAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with values from localStorage if available
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const storedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return parseStoredUserProfile(storedProfile);
  });
  
  const [garments, setGarments] = useState<Garment[]>(() => {
    const storedGarments = localStorage.getItem(STORAGE_KEYS.GARMENTS);
    return parseStoredGarments(storedGarments);
  });
  
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() => {
    const storedUnitSystem = localStorage.getItem(STORAGE_KEYS.UNIT_SYSTEM);
    return (storedUnitSystem as UnitSystem) || 'metric';
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Persist garments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GARMENTS, JSON.stringify(garments));
  }, [garments]);
  
  // Persist user profile to localStorage whenever it changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
    }
  }, [userProfile]);
  
  // Persist unit system to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UNIT_SYSTEM, unitSystem);
  }, [unitSystem]);
  
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
