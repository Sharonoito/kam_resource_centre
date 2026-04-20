

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from "date-fns";
import Link from "next/link";
import prisma from "@/lib/prisma";
import AdminContentClient from "./AdminContentClient";


// Dummy data for demonstration; replace with server data fetch if needed
const initialContent = [];

export const dynamic = "force-dynamic";

async function getContentLibrary() {
  try {
    return await prisma.kam_content.findMany({
      include: {
        sector_relation: {
          select: { name: true }
        }
      },
      orderBy: { updated_at: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching admin content:", error);
    return [];
  }
}

export default async function AdminContentPage() {
  const content = await getContentLibrary();
  return <AdminContentClient content={content} />;
}
