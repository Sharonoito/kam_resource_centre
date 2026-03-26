import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  ExternalLink 
} from "lucide-react";
import Link from "next/link";
import { KAM_SECTORS } from "@/types/sectors";

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

  // Use sector_id directly from your prisma model
  const sectorMetadata = KAM_SECTORS.find(s => s.id === resource.sector_id);

  const displaySector = sectorMetadata || { 
    name: "General", 
    slug: "general" 
  };
  const pdfProxyUrl = `/api/documents/download/${resource.id}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link 
            href={`/sectors/${displaySector.slug}`} 
            className="flex items-center gap-2 text-gray-600 hover:text-[#193C8D] transition-colors"
          >
            <ArrowLeft size={18} />
            Back to {displaySector.name}
          </Link>
          
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
              <Share2 size={20} />
            </button>
            {resource.pdf_url && (
              <a 
                href={`${pdfProxyUrl}?mode=download`} 
                className="bg-[#193C8D] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold hover:bg-[#142C55] transition-colors"
              >
                <Download size={16} /> Download PDF
              </a>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0B1E3A] mb-4">
              {resource.title}
            </h1>
            {resource.description && (
              <p className="text-gray-600 leading-relaxed max-w-3xl">
                {resource.description}
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden min-h-[700px]">
            {resource.content_type === "POWERBI" ? (
              <iframe 
                src={resource.powerbi_embed || ""} 
                className="w-full h-[800px] border-0" 
                allowFullScreen 
              />
            ) : resource.content_type === "PDF" ? (
              <iframe 
                src={`${pdfProxyUrl}?mode=preview#toolbar=0`} 
                className="w-full h-[800px] border-0" 
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[600px] text-center p-12">
                <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-6">
                  <ExternalLink className="w-10 h-10 text-[#E7B947]" />
                </div>
                <h2 className="text-2xl font-bold text-[#0B1E3A] mb-2">External Resource</h2>
                <p className="text-gray-600 mb-8 max-w-sm">
                  This resource is hosted on an external platform and cannot be previewed directly.
                </p>
                <a 
                  href={resource.external_url || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#E7B947] text-[#0B1E3A] px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  Open Resource in New Tab
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}




// import { notFound } from "next/navigation";
// import prisma from "@/lib/prisma";
// import { 
//   FileText, 
//   ArrowLeft, 
//   Download, 
//   Share2, 
//   BarChart3, 
//   ExternalLink 
// } from "lucide-react";
// import Link from "next/link";

// export default async function ResourceViewPage({ 
//   params 
// }: { 
//   params: Promise<{ id: string }> 
// }) {
//   const { id } = await params;
  
//   const resource = await prisma.kam_content.findUnique({
//     where: { 
//       id: parseInt(id), 
//       is_active: true 
//     },
//     include: { 
//       sector: true 
//     }
//   });

//   // This handles the "resource.sector is possibly null" error
//   if (!resource || !resource.sector) {
//     notFound();
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       <nav className="bg-white border-b py-4">
//         <div className="container mx-auto px-6 flex items-center justify-between">
//           <Link 
//             href={`/sectors/${resource.sector.slug}`} 
//             className="flex items-center gap-2 text-gray-600 hover:text-[#193C8D] transition-colors"
//           >
//             <ArrowLeft size={18} />
//             Back to {resource.sector.name}
//           </Link>
          
//           <div className="flex items-center gap-3">
//             <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
//               <Share2 size={20} />
//             </button>
//             {resource.pdf_url && (
//               <a 
//                 href={resource.pdf_url} 
//                 download 
//                 className="bg-[#193C8D] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold"
//               >
//                 <Download size={16} /> Download PDF
//               </a>
//             )}
//           </div>
//         </div>
//       </nav>

//       <main className="container mx-auto px-6 py-12">
//         <div className="max-w-5xl mx-auto">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-[#0B1E3A] mb-4">{resource.title}</h1>
//             <p className="text-gray-600 leading-relaxed">{resource.description}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden min-h-[700px]">
//             {resource.content_type === "POWERBI" ? (
//               <iframe 
//                 src={resource.powerbi_embed || ""} 
//                 className="w-full h-[800px] border-0" 
//                 allowFullScreen 
//               />
//             ) : resource.content_type === "PDF" ? (
//               <iframe 
//                 src={`${resource.pdf_url}#toolbar=0`} 
//                 className="w-full h-[800px] border-0" 
//               />
//             ) : (
//               <div className="flex flex-col items-center justify-center h-[600px] text-center p-12">
//                 <ExternalLink className="w-16 h-16 text-gray-300 mb-4" />
//                 <h2 className="text-xl font-bold mb-2">External Resource</h2>
//                 <a 
//                   href={resource.external_url || "#"} 
//                   target="_blank" 
//                   className="bg-[#E7B947] text-[#0B1E3A] px-8 py-3 rounded-xl font-bold"
//                 >
//                   Open External Link
//                 </a>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
