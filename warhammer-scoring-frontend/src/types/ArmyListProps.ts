import type { Army } from "./Army"

export type ArmyListProps = {
  armies: Army[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onAdd: () => void
}