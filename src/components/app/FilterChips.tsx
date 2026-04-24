import type { ArchiveFilter } from "@/lib/types"

const filters: Array<{ label: string; value: ArchiveFilter }> = [
  { label: "All", value: "all" },
  { label: "Together", value: "together" },
  { label: "Her", value: "her" },
  { label: "Movies", value: "movies" },
  { label: "Series", value: "series" },
]

type FilterChipsProps = {
  value: ArchiveFilter
  onChange: (value: ArchiveFilter) => void
}

export function FilterChips({ value, onChange }: FilterChipsProps) {
  return (
    <div
      aria-label="Archive filters"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="listbox"
    >
      {filters.map((filter) => (
        <button
          aria-selected={filter.value === value}
          className="h-9 shrink-0 rounded-lg border border-white/10 bg-cinema-surface px-3 text-sm font-medium text-cinema-muted transition-colors hover:text-cinema-text aria-selected:border-cinema-amber/40 aria-selected:bg-cinema-amber/15 aria-selected:text-cinema-amber"
          key={filter.value}
          onClick={() => onChange(filter.value)}
          role="option"
          type="button"
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
