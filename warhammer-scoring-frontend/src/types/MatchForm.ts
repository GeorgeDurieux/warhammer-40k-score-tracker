export type MatchForm = {
    userArmy: string
    userDetachment: string
    opponentArmy: string
    opponentDetachment: string
    date: string
    userScore: number
    opponentScore: number
    isTournament: boolean
    tournamentName?: string
}