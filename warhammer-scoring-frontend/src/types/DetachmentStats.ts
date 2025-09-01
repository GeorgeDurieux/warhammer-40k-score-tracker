import type { OpponentStats } from "./OpponentStats"

export type DetachmentStats = {
    wins: number
    total: number
    opponents: Record<string, OpponentStats>
}