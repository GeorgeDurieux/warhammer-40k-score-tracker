export type MatchForm = {
  userArmyId: number
  userDetachmentId: number
  opponentArmyId: number
  opponentDetachmentId: number
  date: string  
  userScore: number
  opponentScore: number
  isTournament: boolean
  tournamentName?: string
}
