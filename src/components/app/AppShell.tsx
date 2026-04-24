import type { ReactNode } from "react"

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-background text-foreground">
      <div className="mx-auto min-h-dvh w-full max-w-[30rem] bg-[radial-gradient(circle_at_50%_-10%,rgba(243,181,98,0.14),transparent_32%),linear-gradient(180deg,var(--background),#0c0c0e)] px-4 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-[calc(env(safe-area-inset-top)+1rem)] sm:max-w-[32rem]">
        {children}
      </div>
    </main>
  )
}
