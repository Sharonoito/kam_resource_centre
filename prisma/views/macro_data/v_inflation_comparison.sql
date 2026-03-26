SELECT
  wb.country_iso3,
  wb.country_name,
  wb.year,
  wb.value AS wb_cpi_pct,
  imf.value AS imf_weo_pct,
  imf.is_projection
FROM
  (
    macro_data.indicators wb FULL
    JOIN macro_data.inflation imf ON (
      (
        (wb.country_iso3 = imf.country_iso3)
        AND (wb.year = imf.year)
      )
    )
  )
WHERE
  (
    (wb.indicator_code = 'FP.CPI.TOTL.ZG' :: text)
    OR (wb.indicator_code IS NULL)
  )
ORDER BY
  wb.country_iso3,
  wb.year;