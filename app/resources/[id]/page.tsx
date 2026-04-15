import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function ResourceViewPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  const resource = await prisma.kam_content.findUnique({
    where: { 
      id: parseInt(id), 
      is_active: true 
    }
  });

  if (!resource) {
    notFound();
  }

  const pdfProxyUrl = `/api/documents/download/${resource.id}`;
  const powerBiSrc = resource.powerbi_embed || resource.powerbi_url;

  return (
    // 'max-h-screen' and 'overflow-hidden' on the wrapper prevents the body from scrolling
    <div className="h-screen w-full bg-[#F1F5F9] flex flex-col overflow-hidden relative">
      
      {/* 1. Moved the button to be fixed relative to the screen to ensure it never moves */}
      <div className="absolute top-4 left-4 z-[100]">
        <Link 
          href="/trade" 
          className="flex items-center gap-2 bg-[#193C8D] hover:bg-[#0B1E3A] text-white px-4 py-2 rounded-lg transition-all shadow-xl text-[10px] font-black uppercase tracking-widest border border-white/20"
        >
          <ArrowLeft size={16} />
          Exit Dashboard
        </Link>
      </div>

      {/* 2. The Main Container uses calc to ensure it stays within the viewport minus small padding */}
      <main className="w-full h-full flex flex-col overflow-hidden bg-white">
        {resource.content_type === "POWERBI" && powerBiSrc ? (
          <div className="w-full h-full overflow-hidden">
            <iframe 
              src={powerBiSrc} 
              // 'block' and 'overflow-hidden' prevents the iframe from creating ghost scroll area
              className="w-full h-full border-0 block overflow-hidden" 
              allowFullScreen={true}
              title={resource.title}
              // This is the secret for PowerBI: force the embed to fit the frame
              style={{ height: '100%', width: '100%', overflow: 'hidden' }}
            />
          </div>
        ) : resource.content_type === "PDF" ? (
          <div className="w-full h-full overflow-hidden">
             <iframe 
              src={`${pdfProxyUrl}?mode=preview#toolbar=0`} 
              className="w-full h-full border-0 block" 
              title={resource.title}
              style={{ height: '100%', width: '100%' }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-12">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <ExternalLink className="w-8 h-8 text-[#193C8D]" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Resource View Restricted</h2>
            <p className="text-slate-500 mb-8 max-w-xs text-xs font-medium leading-relaxed">
              This resource requires external authentication.
            </p>
            <a 
              href={resource.external_url || powerBiSrc || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#193C8D] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#E7B947] hover:text-[#193C8D] transition-all shadow-xl"
            >
              Open Externally
            </a>
          </div>
        )}
      </main>

      {/* 3. Global CSS to kill the scrollbars completely on this page only */}
      <style dangerouslySetInnerHTML={{ __html: `
        html, body { 
          overflow: hidden !important; 
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        iframe {
          overflow: hidden !important;
        }
      `}} />
    </div>
  );
}
