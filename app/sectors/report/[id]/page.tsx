import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getPowerBiReportById } from '@/lib/documents';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GlobalReportViewerPage({ params }: Props) {
  const { id } = await params;
  const reportId = parseInt(id, 10);

  if (isNaN(reportId)) notFound();

  const report = await getPowerBiReportById(reportId);
  if (!report) notFound();

  const embedUrl = report.powerbi_embed || report.powerbi_url;
  if (!embedUrl) notFound();

  return (
    <div className="flex flex-col h-screen bg-[#0B1E3A]">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-3 bg-[#0B1E3A] border-b border-white/10 shrink-0">
        <Link
          href="/sectors"
          className="flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold transition-colors"
        >
          <ArrowLeft size={14} />
          All Sectors
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-white text-xs font-bold truncate">{report.title}</span>
      </div>

      {/* Full-screen embed */}
      <iframe
        title={report.title}
        src={embedUrl}
        allowFullScreen
        className="flex-1 w-full border-none"
      />
    </div>
  );
}
