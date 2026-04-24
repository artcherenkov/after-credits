import { Film } from "lucide-react"

type PosterThumbProps = {
  poster: string | null
  title: string
  size?: "sm" | "lg"
}

export function PosterThumb({ poster, title, size = "sm" }: PosterThumbProps) {
  const className =
    size === "lg"
      ? "h-[13.5rem] w-[9.25rem] rounded-lg"
      : "h-[5.25rem] w-[3.65rem] rounded-md"

  return (
    <div
      className={`${className} relative shrink-0 overflow-hidden border border-white/10 bg-cinema-surface-2 shadow-[0_14px_34px_rgba(0,0,0,0.34)]`}
    >
      {poster ? (
        <img
          alt={`${title || "Title"} poster`}
          className="size-full object-cover"
          loading="lazy"
          src={poster}
        />
      ) : (
        <div className="flex size-full items-center justify-center bg-[linear-gradient(155deg,rgba(243,181,98,0.18),rgba(232,93,117,0.10)_48%,rgba(88,196,184,0.13))] text-cinema-muted">
          <Film aria-hidden="true" />
        </div>
      )}
    </div>
  )
}
