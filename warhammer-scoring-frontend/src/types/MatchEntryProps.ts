import type { Game } from "./Game"

export type MatchEntryProps = {
  match: Game
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}