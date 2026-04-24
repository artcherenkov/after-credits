import { Star } from "lucide-react"

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
  const activeClass =
    accent === "rose"
      ? "text-cinema-rose"
      : "text-cinema-teal"
  const focusClass =
    accent === "rose"
      ? "focus-visible:ring-cinema-rose/30"
      : "focus-visible:ring-cinema-teal/30"

  return (
    <fieldset className="flex min-w-0 flex-col gap-2">
      <legend className="text-xs font-semibold text-cinema-muted">{label}</legend>
      <div className="flex items-center gap-1" role="radiogroup">
        {Array.from({ length: 10 }, (_, index) => {
          const rating = index + 1
          const isActive = value !== null && rating <= value

          return (
            <button
              aria-checked={value === rating}
              aria-label={`${label} ${rating} of 10`}
              className={`flex size-7 items-center justify-center rounded-md text-cinema-muted transition hover:text-cinema-amber focus-visible:outline-none focus-visible:ring-3 ${focusClass} ${
                isActive ? activeClass : ""
              }`}
              key={rating}
              onClick={() => onChange(value === rating ? null : rating)}
              role="radio"
              type="button"
            >
              <Star
                aria-hidden="true"
                className={isActive ? "fill-current" : ""}
              />
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
