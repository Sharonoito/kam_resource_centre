import { 
  Sprout, Beef, Droplets, Utensils, Pickaxe, 
  FlaskConical, Container, Footprints, Layers, 
  Cpu, Truck, Microscope, ShieldAlert, Palette 
} from "lucide-react";

export const HS_SECTIONS_MAP: Record<string, any> = {
  "i-live-animals": { 
    number: "01", 
    name: "Live Animals & Products", 
    description: "Comprehensive trade data for animal products and derivatives.", 
    icon: Beef, 
    hsCodeRange: "01-05",
    powerBiUrl: "https://app.powerbi.com/view?r=eyJrIjoiYzcyNjY0ZTYtM2QyMy00YjczLTgwNTEtNTU1MzMwYzU4OWUyIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9&pageName=5174b7720480096b117c"
  },
  "ii-vegetable-products": { 
    number: "02", 
    name: "Vegetable Products", 
    description: "Crops, edible vegetables, roots, and tubers.", 
    icon: Sprout, 
    hsCodeRange: "06-14",
    powerBiUrl: "https://app.powerbi.com/view?r=eyJrIjoiYzcyNjY0ZTYtM2QyMy00YjczLTgwNTEtNTU1MzMwYzU4OWUyIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9&pageName=a07fc76b3ed0c671875c" 
  },
  "iii-fats-oils": { 
    number: "03", 
    name: "Fats and Oils", 
    description: "Animal or vegetable fats and their cleavage products.", 
    icon: Droplets, 
    hsCodeRange: "15",
    powerBiUrl: "https://app.powerbi.com/view?r=eyJrIjoiYzcyNjY0ZTYtM2QyMy00YjczLTgwNTEtNTU1MzMwYzU4OWUyIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9&pageName=5cb0946bc8c254a71ad0"
  },
  "iv-prepared-food": { 
    number: "04", 
    name: "Prepared Foodstuffs", 
    description: "Processed food items, beverages, spirits, and tobacco.", 
    icon: Utensils, 
    hsCodeRange: "16-24",
    powerBiUrl: "https://app.powerbi.com/view?r=eyJrIjoiYzcyNjY0ZTYtM2QyMy00YjczLTgwNTEtNTU1MzMwYzU4OWUyIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9&pageName=e0b70589900315438756"
  },
  "v-mineral-products": { 
    number: "05", 
    name: "Mineral Products", 
    description: "Salt, sulfur, earths, stone, and mineral fuels.", 
    icon: Pickaxe, 
    hsCodeRange: "25-27",
    powerBiUrl: "https://app.powerbi.com/view?r=eyJrIjoiYzcyNjY0ZTYtM2QyMy00YjczLTgwNTEtNTU1MzMwYzU4OWUyIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9&pageName=eef57ede27775b057dd4"
  }
};