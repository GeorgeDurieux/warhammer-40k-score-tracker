export type MatchForm = {
  user_army_id: number
  user_detachment_id: number
  opponent_army_id: number
  opponent_detachment_id: number
  date: string  
  user_score: number
  opponent_score: number
  is_tournament: boolean
  tournament_name?: string
}