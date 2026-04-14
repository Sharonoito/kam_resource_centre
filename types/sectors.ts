import { ForwardRefExoticComponent, SVGProps, RefAttributes } from 'react';
import { 
  BeakerIcon, 
  TruckIcon, 
  BuildingOffice2Icon, 
  PresentationChartLineIcon,
  GlobeAltIcon,
  BanknotesIcon,
  BookOpenIcon,
  BoltIcon,
  DocumentTextIcon,
  AcademicCapIcon, 
  ScissorsIcon, 
  ShoppingBagIcon,
  FireIcon,
  CircleStackIcon,
  BriefcaseIcon,
  PuzzlePieceIcon
} from "@heroicons/react/24/outline";

export type HeroIcon = ForwardRefExoticComponent<SVGProps<SVGSVGElement> & { title?: string, titleId?: string } & RefAttributes<SVGSVGElement>>;

export interface HsSection {
  id: string;
  name: string;
  path: string;
  description: string;
  hsCodeRange?: string;
}

export interface KamSector {
  id: number;
  name: string;
  slug: string;
  emoji: string;
  icon: HeroIcon; // Mandatory for the UI
  color: string;
  sections: string[];
  hsChapters: string;
  sectionsData: HsSection[];
}

export const HS_SECTIONS: Record<string, HsSection> = {
  I:     { id: "I",    name: "Live Animals & Products",   path: "/sections/i-live-animals",       description: "Animals and animal products" },
  II:    { id: "II",   name: "Vegetable Products",        path: "/sections/ii-vegetable-products", description: "Agricultural and plant goods" },
  III:   { id: "III",  name: "Fats and Oils",             path: "/sections/iii-fats-oils",         description: "Animal and vegetable oils" },
  IV:    { id: "IV",   name: "Prepared Foodstuffs",       path: "/sections/iv-prepared-food",      description: "Processed food and beverages" },
  V:     { id: "V",    name: "Mineral Products",          path: "/sections/v-mineral-products",    description: "Petroleum, minerals and fuels" },
  VI:    { id: "VI",   name: "Chemical Products",         path: "/sections/vi-chemicals",          description: "Industrial and organic chemicals" },
  VII:   { id: "VII",  name: "Plastics & Rubber",         path: "/sections/vii-plastics-rubber",   description: "Polymer and rubber materials" },
  VIII:  { id: "VIII", name: "Leather Goods",             path: "/sections/viii-leather",          description: "Leather and animal hides" },
  IX:    { id: "IX",   name: "Wood Articles",             path: "/sections/ix-wood",               description: "Timber and wood products" },
  X:     { id: "X",    name: "Paper & Pulp",              path: "/sections/x-paper",               description: "Paper manufacturing materials" },
  XI:    { id: "XI",   name: "Textiles",                  path: "/sections/xi-textiles",           description: "Clothing and fabric materials" },
  XII:   { id: "XII",  name: "Footwear",                  path: "/sections/xii-footwear",          description: "Shoes and footwear products" },
  XIII:  { id: "XIII", name: "Stone & Glass",             path: "/sections/xiii-stone-ceramic",    description: "Ceramics, cement and glass" },
  XIV:   { id: "XIV",  name: "Precious Items",            path: "/sections/xiv-pearls",            description: "Pearls, gems and jewellery" },
  XV:    { id: "XV",   name: "Base Metals",               path: "/sections/xv-base-metals",        description: "Iron, steel and metal goods" },
  XVI:   { id: "XVI",  name: "Machinery",                 path: "/sections/xvi-machinery",         description: "Industrial machinery and equipment" },
  XVII:  { id: "XVII", name: "Transport",                 path: "/sections/xvii-transport",        description: "Vehicles and transport equipment" },
  XVIII: { id: "XVIII",name: "Optical / Medical",         path: "/sections/xviii-optical-medical", description: "Medical and optical instruments" },
  XIX:   { id: "XIX",  name: "Arms & Ammo",               path: "/sections/xix-arms",               description: "Weapons and ammunition" },
  XX:    { id: "XX",   name: "Misc Items",                path: "/sections/xx-miscellaneous",       description: "Various manufactured goods" },
  XXI:   { id: "XXI",  name: "Art & Antiques",            path: "/sections/xxi-art-antiques",       description: "Artworks and antiques" },
};

const s = HS_SECTIONS;

export const HS_SECTORS_ONLY: KamSector[] = [
  { 
    id: 1, 
    name: "Agriculture and Food Processing", 
    slug: "agriculture",
    emoji: "🌾",
    icon: PuzzlePieceIcon,
    color: "#10b981",
    sections: ["Live Animals", "Vegetable Products", "Fats and Oils", "Prepared Foodstuffs"],
    hsChapters: "1-24",
    sectionsData: [s.I, s.II, s.III, s.IV],
  },
  { 
    id: 2, 
    name: "Food and Beverages", 
    slug: "food-beverages",
    emoji: "🍷",
    icon: FireIcon,
    color: "#f59e0b",
    sections: ["Prepared Foodstuffs"],
    hsChapters: "21-22",
    sectionsData: [s.IV],
  },
  { 
    id: 3, 
    name: "Timber Sector", 
    slug: "timber",
    emoji: "🪵",
    icon: BriefcaseIcon,
    color: "#846046",
    sections: ["Wood and Articles of Wood"],
    hsChapters: "44-46",
    sectionsData: [s.IX],
  },
  { 
    id: 4, 
    name: "Leather and Footwear", 
    slug: "leather",
    emoji: "👞",
    icon: ShoppingBagIcon,
    color: "#b45309",
    sections: ["Raw Hides", "Leather", "Footwear"],
    hsChapters: "41-43, 64",
    sectionsData: [s.VIII, s.XII],
  },
  { 
    id: 5, 
    name: "Textiles and Apparel", 
    slug: "textiles",
    emoji: "👕",
    icon: ScissorsIcon,
    color: "#3b82f6",
    sections: ["Textiles and Textile Articles"],
    hsChapters: "50-63",
    sectionsData: [s.XI],
  },
  { 
    id: 6, 
    name: "Plastics and Rubber", 
    slug: "plastics",
    emoji: "🧪",
    icon: CircleStackIcon,
    color: "#ec4899",
    sections: ["Plastics and Rubber"],
    hsChapters: "39-40",
    sectionsData: [s.VII],
  },
  { 
    id: 7, 
    name: "Pharmaceutical Sector", 
    slug: "pharmaceutical",
    emoji: "💊",
    icon: AcademicCapIcon,
    color: "#ef4444",
    sections: ["Chemical Products", "Optical", "Medical Instruments"],
    hsChapters: "30, 90",
    sectionsData: [s.VI, s.XVIII],
  },
  { 
    id: 8, 
    name: "Paper Sector", 
    slug: "paper",
    emoji: "📄",
    icon: DocumentTextIcon,
    color: "#6b7280",
    sections: ["Pulp", "Paper and Paperboard"],
    hsChapters: "47-49",
    sectionsData: [s.X],
  },
  { 
    id: 9, 
    name: "Metal and Allied", 
    slug: "metal",
    emoji: "🏗️",
    icon: BuildingOffice2Icon,
    color: "#4b5563",
    sections: ["Base Metals and Articles of Base Metal"],
    hsChapters: "72-83",
    sectionsData: [s.XV],
  },
  { 
    id: 10, 
    name: "Chemicals and Allied", 
    slug: "chemicals",
    emoji: "⚗️",
    icon: BeakerIcon,
    color: "#8b5cf6",
    sections: ["Chemical Products"],
    hsChapters: "28-38",
    sectionsData: [s.VI],
  },
  { 
    id: 11, 
    name: "Energy and Electricals", 
    slug: "energy",
    emoji: "⚡",
    icon: BoltIcon,
    color: "#facc15",
    sections: ["Machinery", "Mechanical Appliances", "Electrical Equipment"],
    hsChapters: "27, 83-85",
    sectionsData: [s.V, s.XVI],
  },
  { 
    id: 12, 
    name: "Building, Mining and Construction", 
    slug: "construction",
    emoji: "🧱",
    icon: BuildingOffice2Icon,
    color: "#fb923c",
    sections: ["Mineral Products", "Stone", "Plaster", "Cement", "Glassware"],
    hsChapters: "25-26, 68-70, 78",
    sectionsData: [s.V, s.XIII, s.XV],
  },
  { 
    id: 13, 
    name: "Automotive Sector", 
    slug: "automotive",
    emoji: "🚗",
    icon: TruckIcon,
    color: "#1e293b",
    sections: ["Vehicles", "Transport Equipment"],
    hsChapters: "87",
    sectionsData: [s.XVII],
  },
];

export const NAV_SECTORS: KamSector[] = [
  { 
    id: -1, 
    name: "Research Hub", 
    slug: "research",
    emoji: "🔬",
    icon: PresentationChartLineIcon,
    color: "#3b82f6",
    sections: ["Barometer", "Data Hub", "Macro Data"],
    hsChapters: "N/A",
    sectionsData: [],
  },
  { 
    id: -2, 
    name: "Trade Hub", 
    slug: "trade",
    emoji: "🌍",
    icon: GlobeAltIcon,
    color: "#10b981",
    sections: ["Free Trade Areas", "Customs"],
    hsChapters: "N/A", 
    sectionsData: [],
  },
  { 
    id: -3, 
    name: "Tax Hub", 
    slug: "tax",
    emoji: "₵",
    icon: BanknotesIcon,
    color: "#ef4444",
    sections: ["Performance Reports", "Trends"],
    hsChapters: "N/A", 
    sectionsData: [],
  },
  { 
    id: -4, 
    name: "Publications", 
    slug: "publications",
    emoji: "📚",
    icon: BookOpenIcon,
    color: "#8b5cf6",
    sections: ["Reports", "Profiles"],
    hsChapters: "N/A", 
    sectionsData: [],
  }
];

export const ALL_SECTORS: KamSector[] = [...NAV_SECTORS, ...HS_SECTORS_ONLY];

export const mapDbSectorToId = (dbSector: string | null | undefined): number | null => {
  if (!dbSector) return null;
  const sector = dbSector.toLowerCase();
  if (sector.includes("sugar") || sector.includes("agriculture")) return 1;
  if (sector.includes("food") || sector.includes("beverage")) return 2;
  if (sector.includes("timber")) return 3;
  if (sector.includes("leather")) return 4;
  if (sector.includes("automotive")) return 13;
  if (sector.includes("research")) return -1;
  if (sector.includes("trade")) return -2;
  if (sector.includes("general")) return 0; 
  return null;
};
