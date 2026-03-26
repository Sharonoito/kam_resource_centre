SELECT
  DISTINCT ON (indicator_code, country_iso3) indicator_code,
  indicator_name,
  country_iso3,
  country_name,
  year,
  value,
  unit
FROM
  macro_data.indicators
ORDER BY
  indicator_code,
  country_iso3,
  year DESC;