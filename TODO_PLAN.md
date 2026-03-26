# Trade Resource Intelligence Page

**Information Gathered:**
- kra/page.tsx: Header, sidebar filters/search, PowerBI iframe (2/3), insights (1/3), table pagination.
- PageSizeSelector.tsx: Rows selector client component.
- KraCharts.tsx: Highcharts column (revenue by month), pie (declaration types).
- Schema: No "trade" schema - use sector.resource_documents (title, sector, document_type, publisher, year, filename, file_size_bytes, is_published, is_active, created_at).
- vDocumentsAdmin view for table.

**Plan:**
1. app/research/trade/page.tsx: Clone kra/page.tsx, replace ICMS with resource_documents queries (year, document_type, publisher filters/search).
2. Copy app/research/kra/PageSizeSelector.tsx → trade/PageSizeSelector.tsx.
3
