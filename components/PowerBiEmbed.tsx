interface PowerBiEmbedProps {
  reportUrl: string;
  pageName?: string;
  height?: string;
  title?: string;
}

export default function PowerBiEmbed({
  reportUrl,
  pageName,
  height = "600px",
  title = "Power BI Report"
}: PowerBiEmbedProps) {
  // Add page parameter if pageName is provided
  const embedUrl = pageName 
    ? `${reportUrl}&pageName=${encodeURIComponent(pageName)}`
    : reportUrl;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
      <div className="bg-gradient-to-r from-[#193C8D] to-[#0B1E3A] px-6 py-4">
        <h3 className="text-white font-bold text-lg">{title}</h3>
      </div>
      <div className="w-full overflow-hidden">
        <iframe
          title={title}
          src={embedUrl}
          frameBorder="0"
          allowFullScreen={true}
          style={{
            width: "100%",
            height,
            border: "none"
          }}
        />
      </div>
    </div>
  );
}
