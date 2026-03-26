SELECT
  rd.id AS document_id,
  rd.title,
  rd.sector,
  rd.chunk_count AS total_chunks,
  de.model_name,
  count(de.id) AS embedded_chunks,
  (rd.chunk_count - count(de.id)) AS pending_chunks,
  round(
    (
      ((count(de.id)) :: numeric * 100.0) / (NULLIF(rd.chunk_count, 0)) :: numeric
    ),
    1
  ) AS pct_complete
FROM
  (
    (
      sector.resource_documents rd
      LEFT JOIN sector.document_chunks dc ON ((dc.document_id = rd.id))
    )
    LEFT JOIN sector.document_embeddings de ON ((de.chunk_id = dc.id))
  )
WHERE
  (
    (rd.is_active = TRUE)
    AND ((rd.extraction_status) :: text = 'done' :: text)
  )
GROUP BY
  rd.id,
  rd.title,
  rd.sector,
  rd.chunk_count,
  de.model_name
ORDER BY
  rd.id,
  de.model_name;