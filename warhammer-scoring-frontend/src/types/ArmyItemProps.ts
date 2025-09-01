import type { Army } from "./Army"

export type ArmyItemProps = {
    army: Army
    onEdit?: (id: number) => void
    onDelete?: (id: number) => void
}