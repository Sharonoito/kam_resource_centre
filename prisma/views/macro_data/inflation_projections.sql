SELECT
  country_iso3,
  country_name,
  year,
  value,
  source,
  updated_at
FROM
  macro_data.inflation
WHERE
  (is_projection = TRUE)
ORDER BY
  country_iso3,
  year;