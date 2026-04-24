import { useCallback, useEffect, useState } from "react"

import { AppShell } from "@/components/app/AppShell"
import { ArchiveScreen } from "@/components/app/ArchiveScreen"
import { TitleFormScreen } from "@/components/app/TitleFormScreen"
import { getTitles } from "@/lib/db"
import type { TitleEntry } from "@/lib/types"

type Screen = "archive" | "form"

export function App() {
  const [screen, setScreen] = useState<Screen>("archive")
  const [entries, setEntries] = useState<TitleEntry[]>([])
  const [editingEntry, setEditingEntry] = useState<TitleEntry | null>(null)
  const [loading, setLoading] = useState(true)

  const loadArchive = useCallback(async () => {
    setEntries(await getTitles())
    setLoading(false)
  }, [])

  useEffect(() => {
    let active = true

    getTitles().then((titles) => {
      if (!active) {
        return
      }

      setEntries(titles)
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  function openNewTitle() {
    setEditingEntry(null)
    setScreen("form")
  }

  function openExistingTitle(entry: TitleEntry) {
    setEditingEntry(entry)
    setScreen("form")
  }

  function returnToArchive() {
    setEditingEntry(null)
    setScreen("archive")
  }

  function handleSaved() {
    returnToArchive()
    void loadArchive()
  }

  return (
    <AppShell>
      {screen === "archive" ? (
        <ArchiveScreen
          entries={entries}
          loading={loading}
          onAdd={openNewTitle}
          onArchiveChanged={loadArchive}
          onEdit={openExistingTitle}
        />
      ) : (
        <TitleFormScreen
          entry={editingEntry}
          key={editingEntry?.id ?? "new"}
          onClose={returnToArchive}
          onSaved={handleSaved}
        />
      )}
    </AppShell>
  )
}

export default App
