SELECT
  id,
  title,
  sector,
  document_type,
  publisher,
  year,
  filename,
  original_filename,
  was_converted,
  file_size_bytes,
  sharepoint_file_id,
  extraction_status,
  chunk_count,
  page_count,
  extracted_at,
  is_published,
  is_active,
  download_count,
  created_at,
  updated_at,
  (
    ('/api/documents/' :: text || id) || '/download' :: text
  ) AS download_url
FROM
  sector.resource_documents
WHERE
  (is_active = TRUE)
ORDER BY
  created_at DESC;