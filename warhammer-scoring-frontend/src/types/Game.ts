export type Game = {
    id: number
    userId: number
    userArmyId: number
    opponentArmyId: number
    userDetachmentId: number
    opponentDetachmentId: number
    date: string
    userScore: number
    opponentScore: number
    userWtcScore: number
    opponentWtcScore: number
    isTournament: boolean
    tournamentName?: string

    userArmy: { name: string }
    opponentArmy: { name: string }
    userDetachment: { name: string }
    opponentDetachment: { name: string }
}
