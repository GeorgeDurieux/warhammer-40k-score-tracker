import type { Game } from "./Game"

export type MatchListProps = {
    filters: {
        tournamentOnly: boolean
        wtc: boolean
        userArmy: string
        userDetachment: string
        opponentArmy: string
        opponentDetachment: string
    }
    matches: Game[]
}