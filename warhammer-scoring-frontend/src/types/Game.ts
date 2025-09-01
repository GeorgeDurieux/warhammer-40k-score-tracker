export type Game = {
    id: number
    user_id: number
    user_army_id: number
    opponent_army_id: number
    user_detachment_id: number
    opponent_detachment_id: number
    date: string
    user_score: number
    opponent_score: number
    user_wtc_score: number
    opponent_wtc_score: number
    is_tournament: boolean
    tournament_name?: string

    user_army: { name: string }
    opponent_army: { name: string }
    user_detachment: { name: string }
    opponent_detachment: { name: string }
}