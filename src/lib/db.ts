import Dexie, { type EntityTable } from "dexie"

import { normalizeWatchedMonth, watchedMonthTimestamp } from "@/lib/format"
import type { TitleDraft, TitleEntry } from "@/lib/types"

type AfterCreditsDatabase = Dexie & {
  titles: EntityTable<TitleEntry, "id">
}

export const db = new Dexie("after-credits") as AfterCreditsDatabase

db.version(1).stores({
  titles:
    "++id, title, type, watchedBy, watchedAt, createdAt, updatedAt, [watchedBy+watchedAt], [type+watchedAt]",
})

export async function getTitles() {
  const titles = await db.titles.toArray()

  return titles.sort((first, second) => {
    const byWatchedAt =
      watchedMonthTimestamp(second.watchedAt) -
      watchedMonthTimestamp(first.watchedAt)

    if (byWatchedAt !== 0) {
      return byWatchedAt
    }

    return (
      new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
    )
  })
}

export async function saveTitle(draft: TitleDraft, id?: number) {
  const timestamp = new Date().toISOString()
  const normalizedDraft = normalizeDraft(draft)

  if (id) {
    const existing = await db.titles.get(id)

    if (!existing) {
      throw new Error("Title not found")
    }

    await db.titles.update(id, {
      ...normalizedDraft,
      updatedAt: timestamp,
    })

    return id
  }

  return db.titles.add({
    ...normalizedDraft,
    createdAt: timestamp,
    updatedAt: timestamp,
  })
}

export async function deleteTitle(id: number) {
  await db.titles.delete(id)
}

export async function exportTitles() {
  const titles = await getTitles()

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    titles,
  }
}

export async function importTitles(titles: TitleEntry[]) {
  const timestamp = new Date().toISOString()
  const cleanedTitles = titles.map((title) => ({
    ...normalizeDraft(title),
    createdAt: title.createdAt || timestamp,
    updatedAt: title.updatedAt || timestamp,
  }))

  await db.titles.bulkAdd(cleanedTitles)
}

function normalizeDraft(draft: TitleDraft) {
  return {
    title: draft.title.trim(),
    type: draft.type,
    poster: draft.poster,
    watchedBy: draft.watchedBy,
    watchedAt: normalizeWatchedMonth(draft.watchedAt),
    ratingHer: clampRating(draft.ratingHer),
    ratingMe: clampRating(draft.ratingMe),
    note: draft.note.trim(),
  }
}

function clampRating(rating: number | null) {
  if (rating === null || Number.isNaN(rating)) {
    return null
  }

  return Math.min(10, Math.max(0, Math.round(rating * 10) / 10))
}
