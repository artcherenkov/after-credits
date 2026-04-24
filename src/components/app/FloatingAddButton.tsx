import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

type FloatingAddButtonProps = {
  onClick: () => void
}

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <Button
      aria-label="Add title"
      className="fixed bottom-[calc(env(safe-area-inset-bottom)_+_5.5rem)] right-[max(1rem,calc((100vw_-_30rem)/2_+_1rem))] size-14 rounded-2xl border border-cinema-amber/30 bg-cinema-amber text-cinema-ink shadow-[0_18px_44px_rgba(243,181,98,0.28)] hover:bg-cinema-amber/90 active:scale-[0.98] sm:right-[max(1.25rem,calc((100vw_-_32rem)/2_+_1.25rem))]"
      onClick={onClick}
      size="icon-lg"
      type="button"
    >
      <Plus aria-hidden="true" />
    </Button>
  )
}
