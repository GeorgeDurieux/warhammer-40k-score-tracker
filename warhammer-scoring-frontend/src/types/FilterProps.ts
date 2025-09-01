import type { Game } from "./Game"

export type FiltersProps = {
    filters: {
        tournamentOnly: boolean
        wtc: boolean
        userArmy: string
        userDetachment: string
        opponentArmy: string
        opponentDetachment: string
        fromMonth: string
        toMonth: string
    }
    setFilters: React.Dispatch<React.SetStateAction<{
        tournamentOnly: boolean
        wtc: boolean
        userArmy: string
        userDetachment: string
        opponentArmy: string
        opponentDetachment: string
        fromMonth: string
        toMonth: string
    }>>
    matches: Game[]
    showWtc?: boolean
}