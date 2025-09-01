import type { Detachment } from "./Detachment"

export type Army = {
    id: number
    name: string
    detachments: Detachment[]
}