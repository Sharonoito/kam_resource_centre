import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Simple country coordinates map
const countryCoords: Record<string, { lat: number; lng: number }> = {
  Kenya: { lat: -1.286389, lng: 36.817223 },
  "United States": { lat: 38.89511, lng: -77.03637 },
  China: { lat: 39.9042, lng: 116.4074 },
  India: { lat: 28.6139, lng: 77.209 },
  "United Kingdom": { lat: 51.5074, lng: -0.1278 },
  Uganda: { lat: 0.3476, lng: 32.5825 },
  Tanzania: { lat: -6.7924, lng: 39.2083 },
  Rwanda: { lat: -1.9403, lng: 29.8739 },
  Germany: { lat: 52.52, lng: 13.405 },
  Netherlands: { lat: 52.3676, lng: 4.9041 },
  Pakistan: { lat: 33.6844, lng: 73.0479 },
  Egypt: { lat: 30.0444, lng: 31.2357 },
  UAE: { lat: 25.2048, lng: 55.2708 },
};

export async function GET() {
  try {
    // Aggregate export value by country (top 20)
    const results = await prisma.icms_master.groupBy({
      by: ["country_name"],
      _sum: { fob_value: true },
      orderBy: { 
        _sum: { 
          fob_value: "desc" 
        } 
      },
      take: 20,
    });

    /**
     * FIX: Use a type guard or non-null assertion.
     * We filter to ensure country_name exists AND is present in our coordinate map.
     */
    const data = results
      .filter((r) => r.country_name !== null && countryCoords[r.country_name as string])
      .map((r) => {
        // At this point, we know country_name is a string and exists in our map
        const countryName = r.country_name as string;
        
        return {
          country: countryName,
          value: Number(r._sum.fob_value) || 0,
          coords: countryCoords[countryName],
        };
      });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Export markets fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch export markets" }, { status: 500 });
  }
}