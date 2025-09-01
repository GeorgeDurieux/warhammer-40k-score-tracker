import type { MatchForm } from "./MatchForm"

export type MatchFormComponentProps = {
    matchToEdit?: MatchForm & { id?: number }
}