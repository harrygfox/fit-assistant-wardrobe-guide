
// Measurement units
export type UnitSystem = 'metric' | 'imperial';

// Body measurement types
export type MeasurementType = 
  | 'height'
  | 'weight'
  | 'shoulders'
  | 'chest'
  | 'bust'
  | 'underbust'
  | 'waist'
  | 'abdomen'
  | 'hip'
  | 'thighs'
  | 'inseam'
  | 'sleeve';

// Fit perception values  
export type FitPerception = 
  | 'too tight'
  | 'slightly tight'
  | 'just right'
  | 'slightly loose'
  | 'too loose'
  | undefined;
  
// Garment types
export type GarmentType = 
  | 'tshirt'
  | 'sweater'
  | 'trousers'
  | 'jeans'
  | 'dress'
  | 'skirt'
  | 'shoes'
  | 'jacket'
  | 'jumpsuit';

// Mapping of garment types to measurement fields
export const GARMENT_MEASUREMENTS: Record<GarmentType, MeasurementType[]> = {
  tshirt: ['shoulders', 'chest', 'waist'],
  sweater: ['shoulders', 'chest', 'waist'],
  trousers: ['waist', 'hip', 'inseam'],
  jeans: ['waist', 'hip', 'inseam'],
  dress: ['chest', 'waist', 'hip'],
  skirt: ['waist', 'hip'],
  shoes: ['thighs'], // Using thighs as a placeholder for shoe length/width
  jacket: ['shoulders', 'chest', 'sleeve'],
  jumpsuit: ['shoulders', 'chest', 'waist', 'hip', 'inseam']
};

// Measurement ranges (in cm)
export const MEASUREMENT_RANGES: Record<MeasurementType, [number, number]> = {
  height: [120, 220],
  weight: [30, 200],
  shoulders: [30, 60],
  chest: [60, 140],
  bust: [60, 140],
  underbust: [50, 120],
  waist: [50, 140],
  abdomen: [60, 150],
  hip: [70, 160],
  thighs: [30, 90],
  inseam: [50, 100],
  sleeve: [40, 80]
};

// Body measurement
export interface BodyMeasurement {
  type: MeasurementType;
  value: number;
}

// User profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  measurements: BodyMeasurement[];
  preferredUnits: UnitSystem;
}

// Garment fit data
export interface GarmentFit {
  measurementType: MeasurementType;
  perception: FitPerception;
}

// Garment data
export interface Garment {
  id: string;
  name: string;
  brand: string;
  type: GarmentType;
  size: string;
  color: string;
  imageUrl: string;
  teachFitAssistant: boolean;
  measurements: BodyMeasurement[];
  fit: GarmentFit[];
  createdAt: Date;
  updatedAt: Date;
}

// Garment creation steps
export type GarmentCreationStep = 1 | 2 | 3;

// Garment form data (for creating/editing)
export interface GarmentFormData {
  name: string;
  brand: string;
  type: GarmentType;
  size: string;
  color: string;
  imageUrl: string | null;
  imageFile: File | null;
  teachFitAssistant: boolean;
  measurements: BodyMeasurement[];
  fit: GarmentFit[];
}
