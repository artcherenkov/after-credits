import { Clapperboard } from "lucide-react"

import { Button } from "@/components/ui/button"

type EmptyStateProps = {
  onAdd: () => void
  hasSearch: boolean
}

export function EmptyState({ onAdd, hasSearch }: EmptyStateProps) {
  return (
    <section className="mt-12 flex flex-col items-center gap-4 rounded-lg border border-white/10 bg-cinema-surface/80 px-6 py-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-lg border border-cinema-amber/25 bg-cinema-amber/10 text-cinema-amber">
        <Clapperboard aria-hidden="true" />
      </div>
      <div className="flex max-w-[18rem] flex-col gap-1">
        <h2 className="text-base font-semibold text-cinema-text">
          {hasSearch ? "Nothing here" : "First memory waits"}
        </h2>
        <p className="text-sm leading-6 text-cinema-muted">
          {hasSearch
            ? "Try another title or filter."
            : "The shelf is still quiet."}
        </p>
      </div>
      {!hasSearch ? (
        <Button
          className="h-11 rounded-lg bg-cinema-amber px-4 text-cinema-ink hover:bg-cinema-amber/90"
          onClick={onAdd}
          type="button"
        >
          Add title
        </Button>
      ) : null}
    </section>
  )
}
