SELECT
  id,
  title,
  sector,
  document_type,
  publisher,
  year,
  description,
  tags,
  filename,
  file_size_bytes,
  was_converted,
  download_count,
  extraction_status,
  chunk_count,
  page_count,
  created_at,
  (
    ('/api/documents/' :: text || id) || '/download' :: text
  ) AS download_url
FROM
  sector.resource_documents
WHERE
  (
    (is_published = TRUE)
    AND (is_active = TRUE)
  )
ORDER BY
  year DESC NULLS LAST,
  created_at DESC;