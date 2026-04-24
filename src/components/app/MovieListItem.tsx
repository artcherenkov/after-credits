import { CalendarDays, Heart, UserRound } from "lucide-react"

import { PosterThumb } from "@/components/app/PosterThumb"
import { formatWatchedMonth } from "@/lib/format"
import type { TitleEntry } from "@/lib/types"

type MovieListItemProps = {
  entry: TitleEntry
  onOpen: (entry: TitleEntry) => void
}

export function MovieListItem({ entry, onOpen }: MovieListItemProps) {
  const watchedTogether = entry.watchedBy === "together"
  const averageRating = getAverageRating(entry.ratingHer, entry.ratingMe)

  return (
    <button
      className="grid min-h-[6rem] w-full grid-cols-[3.65rem_minmax(0,1fr)] gap-3 rounded-lg border border-white/10 bg-cinema-surface/90 p-2 text-left shadow-[0_10px_26px_rgba(0,0,0,0.18)] transition-colors hover:border-white/15 hover:bg-cinema-surface-2/90 focus-visible:border-cinema-amber focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cinema-amber/20"
      onClick={() => onOpen(entry)}
      type="button"
    >
      <PosterThumb poster={entry.poster} title={entry.title} />
      <span className="flex min-w-0 flex-col justify-between gap-2 py-0.5">
        <span className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-[0.98rem] font-semibold leading-5 text-cinema-text">
            {entry.title}
          </span>
          <span className="flex min-w-0 items-center gap-2 text-[0.72rem] font-medium text-cinema-muted">
            <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 capitalize">
              {entry.type}
            </span>
            <span className="inline-flex min-w-0 items-center gap-1">
              <CalendarDays aria-hidden="true" className="size-3.5" />
              <span className="truncate">
                {formatWatchedMonth(entry.watchedAt)}
              </span>
            </span>
          </span>
        </span>
        <span className="flex min-w-0 items-center justify-between gap-2">
          <span
            className={`inline-flex h-6 items-center gap-1 rounded-md border px-1.5 text-[0.68rem] font-semibold ${
              watchedTogether
                ? "border-cinema-amber/30 bg-cinema-amber/10 text-cinema-amber"
                : "border-cinema-rose/30 bg-cinema-rose/10 text-cinema-rose"
            }`}
          >
            {watchedTogether ? (
              <Heart aria-hidden="true" className="size-3.5" />
            ) : (
              <UserRound aria-hidden="true" className="size-3.5" />
            )}
            {watchedTogether ? "Together" : "Her"}
          </span>
          <span className="inline-flex h-7 min-w-[4.4rem] items-center justify-center rounded-md border border-cinema-amber/35 bg-cinema-amber/15 px-2.5 font-semibold tabular-nums text-cinema-amber">
            <span className="inline-flex items-baseline justify-center gap-0.5 leading-none">
              <span className="text-[1rem] leading-none">
                {formatAverageRating(averageRating)}
              </span>
              <span className="text-[0.68rem] leading-none text-cinema-muted">
                /10
              </span>
            </span>
          </span>
        </span>
      </span>
    </button>
  )
}

function getAverageRating(...ratings: Array<number | null>) {
  const filledRatings = ratings.filter((rating): rating is number => {
    return rating !== null && !Number.isNaN(rating)
  })

  if (filledRatings.length === 0) {
    return null
  }

  const sum = filledRatings.reduce((total, rating) => total + rating, 0)
  const average = sum / filledRatings.length

  return Math.round(average * 10) / 10
}

function formatAverageRating(rating: number | null) {
  if (rating === null) {
    return "-"
  }

  return String(rating).replace(".", ",")
}
