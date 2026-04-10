SELECT
  year,
  currency_code,
  round(avg(rate_kes), 4) AS avg_rate_kes,
  count(*) AS months_available
FROM
  macro_data.cbk_exchange_rates
WHERE
  ((rate_type) :: text = 'period_average' :: text)
GROUP BY
  year,
  currency_code
ORDER BY
  year,
  currency_code;