
import React, { useState } from 'react';
import { GarmentFormData, GarmentType } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertOctagon } from 'lucide-react';

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
  
  // Check if form is complete for this step
  const isComplete = 
    garmentData.name.trim() !== '' &&
    garmentData.brand.trim() !== '' &&
    garmentData.type !== '' &&
    garmentData.size.trim() !== '' &&
    garmentData.color.trim() !== '' &&
    (garmentData.imageUrl !== null || garmentData.imageFile !== null);
  
  return (
    <div className="space-y-6">
      {/* Image upload */}
      <div className="space-y-2">
        <Label htmlFor="image">Garment Image</Label>
        <div className="flex items-center space-x-4">
          <div 
            className="w-24 h-24 rounded-md bg-muted flex items-center justify-center overflow-hidden"
          >
            {garmentData.imageUrl ? (
              <img 
                src={garmentData.imageUrl} 
                alt="Garment preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground text-xs text-center px-2">
                Upload Image
              </span>
            )}
          </div>
          
          <div className="flex-1">
            <Input 
              id="image" 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer"
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
          value={garmentData.brand}
          onValueChange={(value) => onChange('brand', value)}
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
        {garmentData.brand === 'Other' && (
          <Input
            className="mt-2"
            placeholder="Enter brand name"
            value={garmentData.brand === 'Other' ? '' : garmentData.brand}
            onChange={(e) => onChange('brand', e.target.value)}
          />
        )}
      </div>
      
      {/* Garment Type */}
      <div className="space-y-2">
        <Label>Garment Type</Label>
        <RadioGroup 
          value={garmentData.type}
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
  );
};

export default DetailsStep;
