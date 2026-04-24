import { ImagePlus, Trash2 } from "lucide-react"
import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { fileToPosterDataUrl } from "@/lib/poster"

type PosterPickerProps = {
  poster: string | null
  title: string
  onChange: (poster: string | null) => void
}

export function PosterPicker({ poster, title, onChange }: PosterPickerProps) {
  const inputId = useId()
  const [error, setError] = useState("")

  return (
    <div className="flex items-end gap-4">
      <label
        className="group relative block h-[11.75rem] w-[8rem] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-cinema-surface-2 shadow-[0_18px_42px_rgba(0,0,0,0.3)]"
        htmlFor={inputId}
      >
        {poster ? (
          <img
            alt={`${title || "Selected"} poster`}
            className="size-full object-cover"
            src={poster}
          />
        ) : (
          <span className="flex size-full flex-col items-center justify-center gap-3 bg-[linear-gradient(155deg,rgba(243,181,98,0.18),rgba(232,93,117,0.10)_48%,rgba(88,196,184,0.13))] px-4 text-center text-sm font-medium text-cinema-muted">
            <ImagePlus aria-hidden="true" />
            Poster
          </span>
        )}
        <span className="absolute inset-x-2 bottom-2 rounded-md border border-white/10 bg-black/55 px-2 py-1 text-center text-xs font-semibold text-cinema-text opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus-within:opacity-100">
          Choose image
        </span>
      </label>
      <input
        accept="image/*"
        className="hidden"
        id={inputId}
        onChange={async (event) => {
          const file = event.target.files?.[0]

          if (!file) {
            return
          }

          setError("")

          try {
            onChange(await fileToPosterDataUrl(file))
          } catch {
            setError("Could not read this image.")
          } finally {
            event.target.value = ""
          }
        }}
        type="file"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3 pb-1">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-cinema-text">
            Local poster
          </span>
        </div>
        {poster ? (
          <Button
            className="h-10 w-fit rounded-lg border-white/10 bg-cinema-surface-2 text-cinema-muted hover:text-cinema-text"
            onClick={() => onChange(null)}
            size="sm"
            type="button"
            variant="outline"
          >
            <Trash2 aria-hidden="true" data-icon="inline-start" />
            Remove
          </Button>
        ) : null}
        {error ? <span className="text-sm text-cinema-rose">{error}</span> : null}
      </div>
    </div>
  )
}
