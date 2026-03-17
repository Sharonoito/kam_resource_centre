// Your Power BI Report URL (shared/public link)
export const POWERBI_REPORT_URL = "https://app.powerbi.com/view?r=eyJrIjoiYzcyNjY0ZTYtM2QyMy00YjczLTgwNTEtNTU1MzMwYzU4OWUyIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9";

// Using the specific Page IDs you provided for the public URL
export const SECTION_POWERBI_PAGES: Record<string, string> = {
  "i-live-animals": "5174b7720480096b117c",
  "ii-vegetable-products": "946bc8c254a71ad0",
  "iii-fats-oils": "5cb0946bc8c254a71ad0",
  "iv-prepared-food": "e0b70589900315438756",
  "v-mineral-products": "eef57ede27775b057dd4",
  // Add other sections here as you get their specific page IDs from the Power BI URL bar
};

/**
 * Builds the Power BI embed URL.
 * If a slug is found in our map, it directs to that specific page.
 * Otherwise, it returns the base overview URL.
 */
export function buildPowerBiEmbedUrl(slug?: string): string {
  if (!slug || !SECTION_POWERBI_PAGES[slug]) {
    return POWERBI_REPORT_URL;
  }

  const pageId = SECTION_POWERBI_PAGES[slug];
  
  // pageName=ID is the standard for public Power BI view links
  return `${POWERBI_REPORT_URL}&pageName=${pageId}`;
}

/**
 * Helper to get the config object if your other components still expect one,
 * though buildPowerBiEmbedUrl(slug) is now the main workhorse.
 */
export function getPowerBiConfigForSection(sectionSlug: string) {
  return {
    pageId: SECTION_POWERBI_PAGES[sectionSlug],
    exists: !!SECTION_POWERBI_PAGES[sectionSlug]
  };
}

// // Your Power BI Report URL (shared/public link)
// export const POWERBI_REPORT_URL = "https://app.powerbi.com/view?r=eyJrIjoiYzcyNjY0ZTYtM2QyMy00YjczLTgwNTEtNTU1MzMwYzU4OWUyIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9";

// // Configure Power BI pages for each HS Section with filters
// // Filters will be automatically applied when the section page loads
// interface PowerBiPageConfig {
//   pageName: string;        // Name of the page in Power BI (e.g., "Imports Reports")
//   filters?: Record<string, string>;  // Filters to apply: { "FieldName": "Value" }
// }

// export const SECTION_POWERBI_CONFIG: Record<string, PowerBiPageConfig> = {
//   "i-live-animals": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "I: Live Animals; Animal Products" }
//   },
//   "ii-vegetable-products": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "II: Vegetable Products" }
//   },
//   "iii-fats-oils": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "III: Fats and Oils" }
//   },
//   "iv-prepared-food": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "IV: Prepared Foodstuffs" }
//   },
//   "v-mineral-products": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "V: Mineral Products" }
//   },
//   "vi-chemicals": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "VI: Chemical Products" }
//   },
//   "vii-plastics-rubber": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "VII: Plastics and Rubber" }
//   },
//   "viii-leather": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "VIII: Hides, Skins and Leather" }
//   },
//   "ix-wood": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "IX: Wood and Articles of Wood" }
//   },
//   "x-paper": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "X: Pulp, Paper & Paperboard" }
//   },
//   "xi-textiles": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "XI: Textiles and Textile Articles" }
//   },
//   "xii-footwear": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "XII: Footwear and Headgear" }
//   },
//   "xiii-stone-ceramic": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "XIII: Stone, Ceramic and Glass" }
//   },
//   "xiv-pearls": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "XIV: Pearls and Precious Stones" }
//   },
//   "xv-base-metals": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "XV: Base Metals and Articles of Base Metal" }
//   },
//   "xvi-machinery": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "XVI: Machinery and Electrical Equipment" }
//   },
//   "xvii-transport": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "XVII: Transport Equipment" }
//   },
//   "xviii-optical-medical": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "XVIII: Optical and Medical Instruments" }
//   },
//   "xix-arms": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "XIX: Arms and Ammunition" }
//   },
//   "xx-miscellaneous": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "XX: Miscellaneous Articles" }
//   },
//   "xxi-art-antiques": { 
//     pageName: "Imports Reports",
//     filters: { "HS Section": "XXI: Works of Art and Antiques" }
//   },
// };

// // Get the Power BI page config for a section
// export function getPowerBiConfigForSection(sectionSlug: string): PowerBiPageConfig | undefined {
//   return SECTION_POWERBI_CONFIG[sectionSlug];
// }

// // Build Power BI embed URL with page navigation and filters
// // Power BI filter format: &filter=TableName/ColumnName eq 'Value'
// export function buildPowerBiEmbedUrl(config?: PowerBiPageConfig): string {
//   let url = POWERBI_REPORT_URL;
  
//   if (!config) return url;
  
//   // Add page name
//   if (config.pageName) {
//     url += `&pageName=${encodeURIComponent(config.pageName)}`;
//   }
  
//   // Add filters - Power BI format: &filter=Table/Column eq 'Value'
//   // For multiple filters, join with: and Table/Column eq 'Value'
//   if (config.filters && Object.keys(config.filters).length > 0) {
//     const filterParts: string[] = [];
    
//     // Assuming the table name in Power BI is something like 'ICMS' or 'Data'
//     // You may need to adjust 'ICMS' to match your actual table name
//     for (const [fieldName, fieldValue] of Object.entries(config.filters)) {
//       // Format: ICMS/HS Section eq 'II: Vegetable Products'
//       filterParts.push(`ICMS/${fieldName} eq '${fieldValue}'`);
//     }
    
//     const filterString = filterParts.join(' and ');
//     url += `&filter=${encodeURIComponent(filterString)}`;
//   }
  
//   return url;
// }
