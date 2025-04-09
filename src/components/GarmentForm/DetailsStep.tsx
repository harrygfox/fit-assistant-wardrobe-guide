
import React, { useState, useRef } from 'react';
import { GarmentFormData, GarmentType } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertOctagon, Camera } from 'lucide-react';

interface DetailsStepProps {
  garmentData: GarmentFormData;
  onChange: (field: string, value: any) => void;
}

// Available colors
const COLORS = [
  'Black', 'White', 'Gray', 'Navy', 'Blue',
  'Red', 'Pink', 'Purple', 'Green', 'Yellow',
  'Orange', 'Brown', 'Beige', 'Multicolor'
];

// Available brands
const BRANDS = [
  'Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo',
  'Gap', 'Levi\'s', 'Gucci', 'Prada', 'Other'
];

const DetailsStep: React.FC<DetailsStepProps> = ({ garmentData, onChange }) => {
  const [imageError, setImageError] = useState<string | null>(null);
  const [customBrand, setCustomBrand] = useState<string>('');
  const [isOtherBrandSelected, setIsOtherBrandSelected] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);
    
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size exceeds 5MB limit');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setImageError('File must be an image');
      return;
    }
    
    onChange('imageFile', file);
    onChange('imageUrl', URL.createObjectURL(file));
  };
  
  // Handle clicking on the upload area
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle brand selection
  const handleBrandChange = (value: string) => {
    if (value === 'Other') {
      setIsOtherBrandSelected(true);
      setCustomBrand('');
      onChange('brand', 'Other');
    } else {
      setIsOtherBrandSelected(false);
      onChange('brand', value);
    }
  };

  // Handle custom brand input change
  const handleCustomBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomBrand(value);
    onChange('brand', value);
  };
  
  // Check if form is complete for this step
  const isComplete = 
    garmentData.name.trim() !== '' &&
    garmentData.brand.trim() !== '' &&
    garmentData.type !== undefined &&
    garmentData.size.trim() !== '' &&
    garmentData.color.trim() !== '' &&
    (garmentData.imageUrl !== null || garmentData.imageFile !== null);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left column - Image upload */}
      <div className="space-y-4">
        <Label htmlFor="image">Garment Image</Label>
        <div className="flex flex-col items-center space-y-4">
          <div 
            className="w-full aspect-square rounded-md border-2 border-dashed border-muted hover:border-primary bg-muted flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-colors"
            onClick={handleUploadClick}
          >
            {garmentData.imageUrl ? (
              <img 
                src={garmentData.imageUrl} 
                alt="Garment preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4">
                <Camera className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-muted-foreground text-center mb-1">
                  Click to upload image
                </span>
                <span className="text-xs text-muted-foreground text-center">
                  Drag and drop or click to browse
                </span>
              </div>
            )}
          </div>
          
          <div className="w-full">
            <Input 
              id="image" 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              ref={fileInputRef}
            />
            {imageError && (
              <p className="text-destructive text-sm mt-1 flex items-center">
                <AlertOctagon className="w-3 h-3 mr-1" />
                {imageError}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Upload a clear photo of your garment
            </p>
          </div>
        </div>
      </div>
      
      {/* Right column - Form inputs */}
      <div className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name"
            value={garmentData.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g. Favorite Blue Jeans"
          />
        </div>
        
        {/* Brand */}
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Select
            value={isOtherBrandSelected ? 'Other' : garmentData.brand}
            onValueChange={handleBrandChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a brand" />
            </SelectTrigger>
            <SelectContent>
              {BRANDS.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isOtherBrandSelected && (
            <Input
              className="mt-2"
              placeholder="Enter brand name"
              value={customBrand}
              onChange={handleCustomBrandChange}
            />
          )}
        </div>
        
        {/* Garment Type */}
        <div className="space-y-2">
          <Label>Garment Type</Label>
          <RadioGroup 
            value={garmentData.type || ''}
            onValueChange={(value) => onChange('type', value)}
            className="grid grid-cols-2 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tshirt" id="type-tshirt" />
              <Label htmlFor="type-tshirt">T-Shirt</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sweater" id="type-sweater" />
              <Label htmlFor="type-sweater">Sweater</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="trousers" id="type-trousers" />
              <Label htmlFor="type-trousers">Trousers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="jeans" id="type-jeans" />
              <Label htmlFor="type-jeans">Jeans</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dress" id="type-dress" />
              <Label htmlFor="type-dress">Dress</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="skirt" id="type-skirt" />
              <Label htmlFor="type-skirt">Skirt</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="shoes" id="type-shoes" />
              <Label htmlFor="type-shoes">Shoes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="jacket" id="type-jacket" />
              <Label htmlFor="type-jacket">Jacket</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="jumpsuit" id="type-jumpsuit" />
              <Label htmlFor="type-jumpsuit">Jumpsuit</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Size */}
        <div className="space-y-2">
          <Label htmlFor="size">Size</Label>
          <Input
            id="size"
            value={garmentData.size}
            onChange={(e) => onChange('size', e.target.value)}
            placeholder="e.g. M, 32, 10, etc."
          />
        </div>
        
        {/* Color */}
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Select
            value={garmentData.color}
            onValueChange={(value) => onChange('color', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              {COLORS.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {!isComplete && (
          <p className="text-amber-500 text-sm italic">
            All fields are required to continue.
          </p>
        )}
      </div>
    </div>
  );
};

export default DetailsStep;
