// app/sections/[slug]/pdf/[id]/page.tsx

export default async function PDFViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Ensure this matches the EXACT filename in public/documents/sector-reports/
  const pdfPath = `/documents/sector-reports/${id}.pdf`;

  return (
    <div className="h-screen w-full flex flex-col bg-zinc-900">
      {/* Header with Download Button */}
      <div className="p-4 bg-[#193C8D] flex justify-between items-center text-white">
        <h1 className="font-bold uppercase text-sm">Viewing: {id.replace(/-/g, ' ')}</h1>
        <a 
          href={pdfPath} 
          download 
          className="bg-[#E7B947] text-[#193C8D] px-6 py-2 rounded-lg font-black text-xs hover:bg-yellow-500 transition-colors"
        >
          DOWNLOAD PDF
        </a>
      </div>

      {/* The Actual PDF Viewer - Using iframe for better compatibility */}
      <div className="flex-1 bg-[#242424] p-4 flex justify-center">
        <div className="w-full max-w-5xl h-full bg-white rounded-lg shadow-2xl overflow-hidden">
          <iframe
            src={`${pdfPath}#toolbar=1`}
            className="w-full h-full border-none"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>
  );
}