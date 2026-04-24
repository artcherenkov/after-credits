export type TitleType = "movie" | "series"

export type WatchedBy = "her" | "together"

export type TitleEntry = {
  id?: number
  title: string
  type: TitleType
  poster: string | null
  watchedBy: WatchedBy
  watchedAt: string
  ratingHer: number | null
  ratingMe: number | null
  note: string
  createdAt: string
  updatedAt: string
}

export type TitleDraft = Omit<TitleEntry, "id" | "createdAt" | "updatedAt">

export type ArchiveFilter = "all" | "together" | "her" | "movies" | "series"
