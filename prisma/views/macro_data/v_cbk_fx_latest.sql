SELECT
  DISTINCT ON (currency_code) currency_code,
  year,
  MONTH,
  rate_kes,
  rate_type,
  updated_at
FROM
  macro_data.cbk_exchange_rates
WHERE
  ((rate_type) :: text = 'period_average' :: text)
ORDER BY
  currency_code,
  year DESC,
  MONTH DESC;