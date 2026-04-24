import { Clapperboard, Tv } from "lucide-react"

import type { TitleType } from "@/lib/types"

type TypeToggleProps = {
  value: TitleType
  onChange: (value: TitleType) => void
}

export function TypeToggle({ value, onChange }: TypeToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-2" role="radiogroup">
      <button
        aria-checked={value === "movie"}
        className="flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-cinema-surface-2 text-sm font-semibold text-cinema-muted transition-colors aria-checked:border-cinema-amber/40 aria-checked:bg-cinema-amber/15 aria-checked:text-cinema-amber"
        onClick={() => onChange("movie")}
        role="radio"
        type="button"
      >
        <Clapperboard aria-hidden="true" />
        Movie
      </button>
      <button
        aria-checked={value === "series"}
        className="flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-cinema-surface-2 text-sm font-semibold text-cinema-muted transition-colors aria-checked:border-cinema-teal/40 aria-checked:bg-cinema-teal/15 aria-checked:text-cinema-teal"
        onClick={() => onChange("series")}
        role="radio"
        type="button"
      >
        <Tv aria-hidden="true" />
        Series
      </button>
    </div>
  )
}
