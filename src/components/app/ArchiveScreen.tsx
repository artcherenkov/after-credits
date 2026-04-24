import { Download, Search, Upload } from "lucide-react"
import { useDeferredValue, useMemo, useRef, useState } from "react"

import { EmptyState } from "@/components/app/EmptyState"
import { FilterChips } from "@/components/app/FilterChips"
import { FloatingAddButton } from "@/components/app/FloatingAddButton"
import { MovieListItem } from "@/components/app/MovieListItem"
import { Button } from "@/components/ui/button"
import { exportTitles, importTitles } from "@/lib/db"
import type { ArchiveFilter, TitleEntry } from "@/lib/types"

type ArchiveScreenProps = {
  entries: TitleEntry[]
  loading: boolean
  onAdd: () => void
  onEdit: (entry: TitleEntry) => void
  onArchiveChanged: () => void
}

export function ArchiveScreen({
  entries,
  loading,
  onAdd,
  onEdit,
  onArchiveChanged,
}: ArchiveScreenProps) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<ArchiveFilter>("all")
  const [status, setStatus] = useState("")
  const importInputRef = useRef<HTMLInputElement | null>(null)
  const deferredQuery = useDeferredValue(query)

  const visibleEntries = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    return entries.filter((entry) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        entry.title.toLowerCase().includes(normalizedQuery) ||
        entry.note.toLowerCase().includes(normalizedQuery)

      if (!matchesQuery) {
        return false
      }

      if (filter === "together") {
        return entry.watchedBy === "together"
      }

      if (filter === "her") {
        return entry.watchedBy === "her"
      }

      if (filter === "movies") {
        return entry.type === "movie"
      }

      if (filter === "series") {
        return entry.type === "series"
      }

      return true
    })
  }, [deferredQuery, entries, filter])

  const hasSearch = query.trim().length > 0 || filter !== "all"

  return (
    <div className="relative flex min-h-dvh flex-col gap-5 pb-24">
      <header className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-3xl font-semibold leading-tight text-cinema-text">
            Cinema Archive
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2 pt-1">
          <Button
            aria-label="Import archive"
            className="border-white/10 bg-cinema-surface text-cinema-muted hover:bg-cinema-surface-2 hover:text-cinema-text"
            onClick={() => importInputRef.current?.click()}
            size="icon-lg"
            type="button"
            variant="outline"
          >
            <Upload aria-hidden="true" />
          </Button>
          <Button
            aria-label="Export archive"
            className="border-white/10 bg-cinema-surface text-cinema-muted hover:bg-cinema-surface-2 hover:text-cinema-text disabled:opacity-40"
            disabled={entries.length === 0}
            onClick={async () => {
              const archive = await exportTitles()
              const blob = new Blob([JSON.stringify(archive, null, 2)], {
                type: "application/json",
              })
              const url = URL.createObjectURL(blob)
              const link = document.createElement("a")

              link.href = url
              link.download = `after-credits-${new Date()
                .toISOString()
                .slice(0, 10)}.json`
              link.click()
              URL.revokeObjectURL(url)
              setStatus("Archive exported.")
            }}
            size="icon-lg"
            type="button"
            variant="outline"
          >
            <Download aria-hidden="true" />
          </Button>
        </div>
      </header>

      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cinema-muted"
        />
        <label className="sr-only" htmlFor="archive-search">
          Search archive
        </label>
        <input
          autoComplete="off"
          className="h-12 w-full rounded-lg border border-white/10 bg-cinema-surface py-0 pl-10 pr-3 text-base text-cinema-text outline-none transition placeholder:text-cinema-muted/70 focus:border-cinema-amber/50 focus:ring-3 focus:ring-cinema-amber/15"
          id="archive-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search titles"
          type="search"
          value={query}
        />
      </div>

      <FilterChips onChange={setFilter} value={filter} />

      {status ? (
        <p className="rounded-lg border border-white/10 bg-cinema-surface px-3 py-2 text-sm text-cinema-muted">
          {status}
        </p>
      ) : null}

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="grid min-h-[6rem] grid-cols-[3.65rem_minmax(0,1fr)] gap-3 rounded-lg border border-white/10 bg-cinema-surface/80 p-2"
              key={index}
            >
              <div className="h-[5.25rem] rounded-md bg-white/10" />
              <div className="flex flex-col justify-between py-1">
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-3/4 rounded bg-white/10" />
                  <div className="h-3 w-1/2 rounded bg-white/10" />
                </div>
                <div className="h-5 w-2/3 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      ) : visibleEntries.length > 0 ? (
        <div className="flex flex-col gap-3">
          {visibleEntries.map((entry) => (
            <MovieListItem entry={entry} key={entry.id} onOpen={onEdit} />
          ))}
        </div>
      ) : (
        <EmptyState hasSearch={hasSearch} onAdd={onAdd} />
      )}

      <input
        accept="application/json"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0]

          if (!file) {
            return
          }

          try {
            const payload = JSON.parse(await file.text()) as {
              titles?: TitleEntry[]
            }

            if (!Array.isArray(payload.titles)) {
              throw new Error("Invalid archive")
            }

            await importTitles(payload.titles)
            setStatus("Archive imported.")
            onArchiveChanged()
          } catch {
            setStatus("Could not import this archive.")
          } finally {
            event.target.value = ""
          }
        }}
        ref={importInputRef}
        type="file"
      />

      <FloatingAddButton onClick={onAdd} />
    </div>
  )
}
