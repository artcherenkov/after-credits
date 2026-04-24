const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
})

export function formatWatchedMonth(value: string) {
  if (!value) {
    return "No month"
  }

  const normalizedMonth = normalizeWatchedMonth(value)
  const date = new Date(`${normalizedMonth}-01T12:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return monthFormatter.format(date)
}

export function currentMonthInputValue() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60_000

  return new Date(now.getTime() - offset).toISOString().slice(0, 7)
}

export function normalizeWatchedMonth(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})/)

  if (match) {
    return `${match[1]}-${match[2]}`
  }

  return currentMonthInputValue()
}

export function watchedMonthTimestamp(value: string) {
  const date = new Date(`${normalizeWatchedMonth(value)}-01T12:00:00`)

  if (Number.isNaN(date.getTime())) {
    return 0
  }

  return date.getTime()
}
