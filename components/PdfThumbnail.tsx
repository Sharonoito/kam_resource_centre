"use client";

import { useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";

// ---------------------------------------------------------------------------
// Module-level caches — survive React StrictMode double-fire and remounts
// ---------------------------------------------------------------------------
let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;
function getPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist")
      .then((lib) => {
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        return lib;
      })
      .catch((e) => {
        pdfjsPromise = null;
        throw e;
      });
  }
  return pdfjsPromise;
}

// Stores rendered pages as JPEG data-URLs so remounts restore instantly
const imageCache = new Map<string, string | "error">();

interface PdfThumbnailProps {
  pdfUrl: string;
  className?: string;
  /** Pass index * 150 to stagger concurrent SharePoint fetches */
  delay?: number;
}

export default function PdfThumbnail({
  pdfUrl,
  className = "w-20 h-28",
  delay = 0,
}: PdfThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [mounted, setMounted] = useState(false);

  // Only render thumbnail logic on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // ── 1. Instant restore from cache ──────────────────────────────────────
    const cached = imageCache.get(pdfUrl);
    if (cached === "error") {
      setStatus("error");
      return;
    }
    if (cached) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const img = new Image();
      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d")?.drawImage(img, 0, 0);
        setStatus("done");
      };
      img.src = cached;
      return;
    }

    // ── 2. Lazy-load when scrolled into view ───────────────────────────────
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          timer = setTimeout(() => {
            if (!cancelled) renderThumbnail();
          }, delay);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (timer !== null) clearTimeout(timer);
    };

    async function renderThumbnail() {
      setStatus("loading");
      try {
        const pdfjsLib = await getPdfjs();

        const pdf = await pdfjsLib.getDocument({
          url: pdfUrl,
          withCredentials: false,
          disableAutoFetch: true,
          disableStream: false,
          rangeChunkSize: 65536,
        }).promise;

        if (cancelled) return;
        const page = await pdf.getPage(1);

        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;

        const naturalVp = page.getViewport({ scale: 1 });
        const scale = Math.min(160 / naturalVp.width, 220 / naturalVp.height);
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d");
        if (!ctx || cancelled) return;

        await page.render({ canvasContext: ctx, canvas, viewport }).promise;
        if (cancelled) return;

        // Cache as JPEG data-URL for instant restore on future mounts
        imageCache.set(pdfUrl, canvas.toDataURL("image/jpeg", 0.85));
        setStatus("done");
      } catch {
        if (!cancelled) {
          imageCache.set(pdfUrl, "error");
          setStatus("error");
        }
      }
    }
  }, [pdfUrl, delay, mounted]);

  // Only render the thumbnail UI on the client to avoid hydration mismatch
  if (!mounted) {
    return (
      <div
        className={`${className} shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-white relative shadow-sm`}
      >
        {/* Static placeholder for SSR */}
        <div className="absolute inset-0 flex flex-col">
          <div className="h-[18%] bg-[#193C8D] flex items-center px-2 gap-1 shrink-0" />
          <div className="flex-1 bg-gray-50 flex flex-col justify-center gap-1.5 px-2 py-2" />
          <div className="h-[10%] bg-gray-100 shrink-0" />
        </div>
      </div>
    );
  }
  return (
    <div
      ref={containerRef}
      className={`${className} shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-white relative shadow-sm`}
    >
      {/* ── Document skeleton / fallback ──────────────────────────────────── */}
      {status !== "done" && (
        <div className="absolute inset-0 flex flex-col">
          {/* Header strip */}
          <div className={`h-[18%] bg-[#193C8D] flex items-center px-2 gap-1 shrink-0 ${status === "loading" ? "animate-pulse" : ""}`}>
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <div className="h-1 rounded bg-white/20 flex-1" />
          </div>
          {/* Body: shimmer lines representing page content */}
          <div className={`flex-1 bg-gray-50 flex flex-col justify-center gap-1.5 px-2 py-2 ${status === "loading" ? "animate-pulse" : ""}`}>
            {status === "loading" ? (
              <>
                <div className="h-1.5 rounded bg-gray-200 w-full" />
                <div className="h-1.5 rounded bg-gray-200 w-[90%]" />
                <div className="h-1.5 rounded bg-gray-200 w-[95%]" />
                <div className="h-1.5 rounded bg-gray-200 w-[70%]" />
                <div className="h-1.5 rounded bg-gray-200 w-full mt-1" />
                <div className="h-1.5 rounded bg-gray-200 w-[85%]" />
                <div className="h-1.5 rounded bg-gray-200 w-[60%]" />
              </>
            ) : (
              /* Error state */
              <div className="flex flex-col items-center justify-center h-full gap-1">
                <FileText size={18} className="text-gray-300" />
                <span className="text-[7px] font-bold text-gray-300 uppercase tracking-widest">PDF</span>
              </div>
            )}
          </div>
          {/* Footer strip */}
          <div className={`h-[10%] bg-gray-100 shrink-0 ${status === "loading" ? "animate-pulse" : ""}`} />
        </div>
      )}

      {/* ── Rendered PDF canvas ───────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        style={{
          display: status === "done" ? "block" : "none",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
