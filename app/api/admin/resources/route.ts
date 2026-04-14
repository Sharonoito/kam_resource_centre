import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { HS_SECTORS_ONLY, NAV_SECTORS } from "@/types/sectors"
import fs from "node:fs/promises"
import path from "node:path"

type ResourceCategory = "SECTOR_SPECIFIC" | "GENERAL_GLOBAL"
type ResourceType = "PDF" | "POWERBI" | "DATABASE" | "TRADE_DATA" | "LINK"
type SourceMode = "LINK" | "UPLOAD"

const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

const safeFileName = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "-")

const parseJsonArray = (raw: string | null): string[] => {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map((n) => String(n).trim()).filter(Boolean) : []
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Session & Permission Check
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as { role?: string; email?: string | null; name?: string | null }
    if (user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Forbidden: SUPERADMIN only" }, { status: 403 })
    }

    const contentTypeHeader = req.headers.get("content-type") || ""

    // 2. Initialize variables
    let title = ""
    let description = ""
    let documentType = "PDF" as ResourceType
    let downloadUrl = ""
    let resourceCategory = "SECTOR_SPECIFIC" as ResourceCategory
    let sourceMode = "LINK" as SourceMode
    let sectorSlug: string | null = null
    let inputSectionNames: string[] = []
    let inputTags: string[] = []
    let uploadedFile: File | null = null
    let isSubscription = false
    let subscriptionType = "free"
    let paybillStr = ""
    let generalNav = ""
    let generalSubNav = ""

    // 3. Extract Data (Multipart vs JSON)
    if (contentTypeHeader.includes("multipart/form-data")) {
      const form = await req.formData()
      title = String(form.get("title") ?? "").trim()
      description = String(form.get("description") ?? "").trim()
      documentType = String(form.get("document_type") ?? "PDF").trim().toUpperCase() as ResourceType
      downloadUrl = String(form.get("download_url") ?? "").trim()
      resourceCategory = String(form.get("resource_category") ?? "SECTOR_SPECIFIC") as ResourceCategory
      sourceMode = String(form.get("source_mode") ?? "LINK") as SourceMode
      sectorSlug = form.get("sector_slug") ? String(form.get("sector_slug")).trim() : null
      inputSectionNames = parseJsonArray(form.get("section_names")?.toString() ?? null)
      inputTags = parseJsonArray(form.get("tags")?.toString() ?? null)
      isSubscription = form.get("is_subscription") === "true"
      subscriptionType = String(form.get("subscription_type") ?? "free").trim()
      paybillStr = String(form.get("paybill") ?? "").trim()
      generalNav = String(form.get("general_nav") ?? "").trim()
      generalSubNav = String(form.get("general_subnav") ?? "").trim()
      const maybeFile = form.get("file")
      uploadedFile = maybeFile instanceof File && maybeFile.size > 0 ? maybeFile : null
    } else {
      const body = await req.json()
      title = String(body.title ?? "").trim()
      description = String(body.description ?? "").trim()
      documentType = String(body.document_type ?? "PDF").trim().toUpperCase() as ResourceType
      downloadUrl = String(body.download_url ?? "").trim()
      resourceCategory = String(body.resource_category ?? "SECTOR_SPECIFIC") as ResourceCategory
      sourceMode = "LINK"
      sectorSlug = body.sector_slug ? String(body.sector_slug) : null
      inputSectionNames = Array.isArray(body.section_names) ? body.section_names.map((n: any) => String(n).trim()).filter(Boolean) : []
      inputTags = Array.isArray(body.tags) ? body.tags.map((n: any) => String(n).trim()).filter(Boolean) : []
      isSubscription = body.is_subscription === true
      subscriptionType = String(body.subscription_type ?? "free").trim()
      paybillStr = String(body.paybill ?? "").trim()
      generalNav = String(body.general_nav ?? "").trim()
      generalSubNav = String(body.general_subnav ?? "").trim()
    }

    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 })

    let kamSectorId = 0
    let officialKamSectorName = "General/Other"
    let sectionNames: string[] = []

    // 4. Sector & Page Mapping Logic
    if (resourceCategory === "SECTOR_SPECIFIC") {
      const selectedSector = HS_SECTORS_ONLY.find((s) => s.slug === sectorSlug)
      if (!selectedSector) return NextResponse.json({ error: "Invalid sector slug" }, { status: 400 })

      kamSectorId = selectedSector.id
      officialKamSectorName = selectedSector.name
      const allowedSectionNames = selectedSector.sectionsData.map((s) => s.name)
      sectionNames = inputSectionNames.length
        ? inputSectionNames.filter((name) => allowedSectionNames.includes(name))
        : allowedSectionNames
    } 
    else if (resourceCategory === "GENERAL_GLOBAL") {
      if (generalNav === "tax") {
        kamSectorId = -3;
        officialKamSectorName = "Tax";
      } else if (generalNav === "trade" || sectorSlug === "TRADE_HUB_GENERAL") {
        kamSectorId = -5;
        officialKamSectorName = "Trade";
      } else {
        const navSector = NAV_SECTORS.find(s => s.slug === generalNav);
        kamSectorId = navSector?.id ?? 0;
        officialKamSectorName = navSector?.name ?? "General/Other";
      }
      
      sectionNames = generalSubNav ? [generalSubNav] : (generalNav ? [generalNav] : ["Research Hub"]);
    }

    // 5. Build Tags & Metadata
    const tags = Array.from(new Set([
      ...inputTags,
      ...sectionNames,
      officialKamSectorName,
      ...(resourceCategory === "GENERAL_GLOBAL" ? ["General"] : []),
    ]))

    const createdBy = user.name || user.email || "SUPERADMIN"
    const mappedContentTypeValue = documentType === "TRADE_DATA" ? "DATABASE" : documentType;

    const baseSlug = normalizeSlug(title)
    const uniqueSlug = `${baseSlug}-${Date.now()}`

    // 6. Handle Physical File Upload
    if (sourceMode === "UPLOAD" && uploadedFile) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "admin")
      await fs.mkdir(uploadDir, { recursive: true })
      const ext = path.extname(uploadedFile.name) || ".bin"
      const fileName = `${uniqueSlug}${ext}`
      const fullPath = path.join(uploadDir, safeFileName(fileName))
      const bytes = await uploadedFile.arrayBuffer()
      await fs.writeFile(fullPath, Buffer.from(bytes))
      downloadUrl = `/uploads/admin/${safeFileName(fileName)}`
    }

    // 7. Save to Database
    const created = await prisma.kam_content.create({
      data: {
        title,
        slug: uniqueSlug,
        description: description || null,
        content_type: mappedContentTypeValue,
        is_active: true,
        sector_id: kamSectorId !== 0 ? kamSectorId : null,
        
        // Assert as any to satisfy compiler while keeping the string logic
        visibility: (isSubscription 
          ? (subscriptionType === "free" ? "MEMBER" : "PUBLIC")
          : "PUBLIC") as any,

        pricing_tier: (isSubscription 
          ? (subscriptionType === "free" ? "FREE" : "PAID") 
          : "FREE") as any,

        price_kes: isSubscription && subscriptionType === "paid" ? parseFloat(paybillStr) : null,
        tags: tags.join(", "),
        keywords: tags.join(", "),
        author: createdBy,
        pdf_url: mappedContentTypeValue === "PDF" ? downloadUrl : null,
        powerbi_url: mappedContentTypeValue === "POWERBI" ? downloadUrl : null,
        external_url: (mappedContentTypeValue === "LINK" || mappedContentTypeValue === "DATABASE") ? downloadUrl : null,
      },
    })

    return NextResponse.json({ success: true, resource: created })
  } catch (error) {
    console.error("RESOURCE_CREATE_ERROR", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
