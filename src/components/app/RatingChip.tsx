type RatingChipProps = {
  label: string
  value: number | null
  tone: "rose" | "teal" | "amber"
}

export function RatingChip({ label, value, tone }: RatingChipProps) {
  const toneClass = {
    amber: "border-cinema-amber/35 bg-cinema-amber/15 text-cinema-amber",
    rose: "border-cinema-rose/30 bg-cinema-rose/15 text-cinema-rose",
    teal: "border-cinema-teal/30 bg-cinema-teal/15 text-cinema-teal",
  }[tone]

  return (
    <span
      className={`inline-flex h-6 min-w-0 items-center gap-1 rounded-md border px-2 text-[0.68rem] font-semibold tabular-nums ${toneClass}`}
    >
      <span className="text-cinema-text/70">{label}</span>
      <span>{value ?? "-"}</span>
    </span>
  )
}
