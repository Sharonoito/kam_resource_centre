import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Simple country coordinates map (expand as needed)
const countryCoords: Record<string, { lat: number; lng: number }> = {
  Kenya: { lat: -1.286389, lng: 36.817223 },
  "United States": { lat: 38.89511, lng: -77.03637 },
  China: { lat: 39.9042, lng: 116.4074 },
  India: { lat: 28.6139, lng: 77.209 },
  "United Kingdom": { lat: 51.5074, lng: -0.1278 },
  // ...add more as needed
};

export async function GET() {
  // Aggregate export value by country (top 20)
  const results = await prisma.icms_master.groupBy({
    by: ["country_name"],
    _sum: { fob_value: true },
    orderBy: { _sum: { fob_value: "desc" } },
    take: 20,
  });

  // Attach coordinates
  const data = results
    .filter((r) => r.country_name && countryCoords[r.country_name])
    .map((r) => ({
      country: r.country_name,
      value: r._sum.fob_value,
      coords: countryCoords[r.country_name],
    }));

  return NextResponse.json(data);
}
