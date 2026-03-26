SELECT
  year,
  value AS inflation_pct,
  is_projection,
  source,
  updated_at
FROM
  macro_data.inflation
WHERE
  (country_iso3 = 'KEN' :: text)
ORDER BY
  year;