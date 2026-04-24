import { useState } from "react"

type RatingInputProps = {
  label: string
  value: number | null
  accent: "rose" | "teal"
  onChange: (value: number | null) => void
}

export function RatingInput({
  label,
  value,
  accent,
  onChange,
}: RatingInputProps) {
  const [textValue, setTextValue] = useState(formatRatingValue(value))
  const focusClass =
    accent === "rose"
      ? "focus-within:border-cinema-rose focus-within:ring-cinema-rose/20"
      : "focus-within:border-cinema-teal focus-within:ring-cinema-teal/20"

  return (
    <label className="flex w-[8.75rem] flex-col gap-2">
      <span className="text-xs font-semibold text-cinema-muted">{label}</span>
      <span
        className={`flex h-12 w-full items-baseline justify-end rounded-lg border border-white/10 bg-transparent px-2 text-cinema-text transition focus-within:ring-3 ${focusClass}`}
      >
        <input
          aria-label={label}
          className="w-[4.5rem] bg-transparent text-right text-3xl font-semibold leading-none tabular-nums text-cinema-text outline-none placeholder:text-cinema-muted/45"
          inputMode="decimal"
          onBlur={() => setTextValue(formatRatingValue(parseRating(textValue)))}
          onChange={(event) => {
            const nextValue = sanitizeRatingInput(event.target.value)

            setTextValue(nextValue)
            onChange(parseRating(nextValue))
          }}
          pattern="[0-9]*[.,]?[0-9]*"
          placeholder="__"
          type="text"
          value={textValue}
        />
        <span className="ml-1 text-base font-semibold text-cinema-muted">
          /10
        </span>
      </span>
    </label>
  )
}

function sanitizeRatingInput(value: string) {
  const cleanValue = value.replace(/[^0-9.,]/g, "").replace(",", ".")
  const [whole = "", ...fractions] = cleanValue.split(".")
  const fraction = fractions.join("").slice(0, 1)
  const limitedWhole = whole.slice(0, 2)

  if (cleanValue.includes(".")) {
    return `${limitedWhole}.${fraction}`
  }

  return limitedWhole
}

function parseRating(value: string) {
  if (!value || value === ".") {
    return null
  }

  const rating = Number(value)

  if (Number.isNaN(rating)) {
    return null
  }

  return Math.min(10, Math.max(0, Math.round(rating * 10) / 10))
}

function formatRatingValue(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return ""
  }

  return String(value)
}
