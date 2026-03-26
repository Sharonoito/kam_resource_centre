SELECT
  indicator_code,
  indicator_name,
  year,
  value,
  unit
FROM
  macro_data.indicators
WHERE
  (country_iso3 = 'KEN' :: text)
ORDER BY
  indicator_code,
  year;