import { Heart, UserRound } from "lucide-react"

import type { WatchedBy } from "@/lib/types"

type WatchedByToggleProps = {
  value: WatchedBy
  onChange: (value: WatchedBy) => void
}

export function WatchedByToggle({ value, onChange }: WatchedByToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-2" role="radiogroup">
      <button
        aria-checked={value === "her"}
        className="flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-cinema-surface-2 text-sm font-semibold text-cinema-muted transition-colors aria-checked:border-cinema-rose/40 aria-checked:bg-cinema-rose/15 aria-checked:text-cinema-rose"
        onClick={() => onChange("her")}
        role="radio"
        type="button"
      >
        <UserRound aria-hidden="true" />
        Her
      </button>
      <button
        aria-checked={value === "together"}
        className="flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-cinema-surface-2 text-sm font-semibold text-cinema-muted transition-colors aria-checked:border-cinema-amber/40 aria-checked:bg-cinema-amber/15 aria-checked:text-cinema-amber"
        onClick={() => onChange("together")}
        role="radio"
        type="button"
      >
        <Heart aria-hidden="true" />
        Together
      </button>
    </div>
  )
}
