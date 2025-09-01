import type { Game } from "./Game"

export type MatchHistoryProps = {
    matches: Game[]
    onEdit: (id: number) => void
    onDelete: (id: number) => void
    onAdd: () => void
}