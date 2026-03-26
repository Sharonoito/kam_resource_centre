SELECT
  dc.id AS chunk_id,
  dc.document_id,
  dc.chunk_index,
  dc.chunk_text,
  dc.page_number,
  dc.token_count,
  rd.title AS document_title,
  rd.sector,
  rd.document_type,
  rd.publisher,
  rd.year,
  rd.filename,
  (
    ('/api/documents/' :: text || rd.id) || '/download' :: text
  ) AS download_url
FROM
  (
    sector.document_chunks dc
    JOIN sector.resource_documents rd ON ((rd.id = dc.document_id))
  )
WHERE
  (rd.is_active = TRUE);