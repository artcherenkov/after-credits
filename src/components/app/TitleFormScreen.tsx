import { ArrowLeft, Save, Trash2 } from "lucide-react"
import { useMemo, useState, type FormEvent } from "react"

import { PosterPicker } from "@/components/app/PosterPicker"
import { RatingInput } from "@/components/app/RatingInput"
import { TypeToggle } from "@/components/app/TypeToggle"
import { WatchedByToggle } from "@/components/app/WatchedByToggle"
import { Button } from "@/components/ui/button"
import { deleteTitle, saveTitle } from "@/lib/db"
import { currentMonthInputValue, normalizeWatchedMonth } from "@/lib/format"
import type { TitleDraft, TitleEntry } from "@/lib/types"

type TitleFormScreenProps = {
  entry: TitleEntry | null
  onClose: () => void
  onSaved: () => void
}

const fieldClass =
  "h-12 rounded-lg border border-white/10 bg-cinema-surface-2 px-3 text-base text-cinema-text outline-none transition placeholder:text-cinema-muted/70 focus:border-cinema-amber/50 focus:ring-3 focus:ring-cinema-amber/15"

export function TitleFormScreen({
  entry,
  onClose,
  onSaved,
}: TitleFormScreenProps) {
  const initialDraft = useMemo<TitleDraft>(
    () => ({
      title: entry?.title ?? "",
      type: entry?.type ?? "movie",
      poster: entry?.poster ?? null,
      watchedBy: entry?.watchedBy ?? "together",
      watchedAt: normalizeWatchedMonth(
        entry?.watchedAt ?? currentMonthInputValue()
      ),
      ratingHer: entry?.ratingHer ?? null,
      ratingMe: entry?.ratingMe ?? null,
      note: entry?.note ?? "",
    }),
    [entry]
  )
  const [draft, setDraft] = useState<TitleDraft>(initialDraft)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const isEditing = Boolean(entry?.id)
  const canSave = draft.title.trim().length > 0 && !saving

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSave) {
      setError("Add a title first.")
      return
    }

    setSaving(true)
    setError("")

    try {
      await saveTitle(draft, entry?.id)
      onSaved()
    } catch {
      setError("Could not save this title.")
      setSaving(false)
    }
  }

  return (
    <form className="flex min-h-dvh flex-col gap-4 pb-36" onSubmit={handleSubmit}>
      <header className="flex items-center justify-between gap-3">
        <Button
          aria-label="Back"
          className="border-white/10 bg-cinema-surface text-cinema-muted hover:bg-cinema-surface-2 hover:text-cinema-text"
          onClick={onClose}
          size="icon-lg"
          type="button"
          variant="outline"
        >
          <ArrowLeft aria-hidden="true" />
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-cinema-muted">
            {isEditing ? "Edit memory" : "New memory"}
          </p>
          <h1 className="truncate text-xl font-semibold text-cinema-text">
            {draft.title || "Cinema Archive"}
          </h1>
        </div>
        {isEditing && entry?.id ? (
          <Button
            aria-label="Delete title"
            className="border-cinema-rose/25 bg-cinema-rose/10 text-cinema-rose hover:bg-cinema-rose/20"
            onClick={async () => {
              if (!confirm("Delete this title?")) {
                return
              }

              await deleteTitle(entry.id!)
              onSaved()
            }}
            size="icon-lg"
            type="button"
            variant="outline"
          >
            <Trash2 aria-hidden="true" />
          </Button>
        ) : null}
      </header>

      <PosterPicker
        onChange={(poster) => setDraft((current) => ({ ...current, poster }))}
        poster={draft.poster}
        title={draft.title}
      />

      <section className="flex flex-col gap-4 rounded-lg border border-white/10 bg-cinema-surface/90 p-3">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-cinema-muted">Title</span>
          <input
            autoComplete="off"
            className={fieldClass}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            placeholder="Movie or series"
            value={draft.title}
          />
        </label>

        <div className="grid gap-3">
          <span className="text-xs font-semibold text-cinema-muted">Type</span>
          <TypeToggle
            onChange={(type) => setDraft((current) => ({ ...current, type }))}
            value={draft.type}
          />
        </div>

        <div className="grid gap-3">
          <span className="text-xs font-semibold text-cinema-muted">
            Watched by
          </span>
          <WatchedByToggle
            onChange={(watchedBy) =>
              setDraft((current) => ({ ...current, watchedBy }))
            }
            value={draft.watchedBy}
          />
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-cinema-muted">
            Watched month
          </span>
          <input
            className={fieldClass}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                watchedAt: event.target.value,
              }))
            }
            type="month"
            value={draft.watchedAt}
          />
        </label>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-white/10 bg-cinema-surface/90 p-3">
        <div className="flex flex-col gap-4">
          <RatingInput
            accent="rose"
            label="She"
            onChange={(ratingHer) =>
              setDraft((current) => ({ ...current, ratingHer }))
            }
            value={draft.ratingHer}
          />
          <RatingInput
            accent="teal"
            label="He"
            onChange={(ratingMe) =>
              setDraft((current) => ({ ...current, ratingMe }))
            }
            value={draft.ratingMe}
          />
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-cinema-muted">Note</span>
          <textarea
            className="min-h-24 resize-none rounded-lg border border-white/10 bg-cinema-surface-2 px-3 py-3 text-base leading-6 text-cinema-text outline-none transition placeholder:text-cinema-muted/70 focus:border-cinema-amber/50 focus:ring-3 focus:ring-cinema-amber/15"
            maxLength={240}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                note: event.target.value,
              }))
            }
            placeholder="Short note"
            value={draft.note}
          />
        </label>
      </section>

      {error ? (
        <p className="rounded-lg border border-cinema-rose/25 bg-cinema-rose/10 px-3 py-2 text-sm text-cinema-rose">
          {error}
        </p>
      ) : null}

      <div
        className="save-rail"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 1.25rem)",
          left: "50%",
          position: "fixed",
          transform: "translateX(-50%)",
          width: "min(calc(100vw - 2rem), 28rem)",
          zIndex: 20,
        }}
      >
        <Button
          className="h-[3.25rem] w-full rounded-lg bg-cinema-amber text-base font-semibold text-cinema-ink shadow-[0_18px_44px_rgba(243,181,98,0.2)] hover:bg-cinema-amber/90 disabled:opacity-45"
          disabled={!canSave}
          type="submit"
        >
          <Save aria-hidden="true" data-icon="inline-start" />
          {saving ? "Saving" : "Save"}
        </Button>
      </div>
    </form>
  )
}
