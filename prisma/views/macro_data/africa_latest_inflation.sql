SELECT
  DISTINCT ON (country_iso3) country_iso3,
  country_name,
  year,
  value AS inflation_pct,
  is_projection,
  source
FROM
  macro_data.inflation
WHERE
  (is_projection = false)
ORDER BY
  country_iso3,
  year DESC;