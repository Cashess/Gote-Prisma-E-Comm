const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 0,
})

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount)
}

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US')

export function forematNumber(number: number) {
  return NUMBER_FORMATTER.format(number)
}
export function formatPrice(price: number) {
  return (price / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}
