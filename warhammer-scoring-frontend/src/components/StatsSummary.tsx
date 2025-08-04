type Game = {
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

type StatsSummaryProps = {
  matches: Game[]
}

const StatsSummary = ({ matches }: StatsSummaryProps) => {
  const wins = matches.filter(m => m.user_score > m.opponent_score).length
  const losses = matches.filter(m => m.user_score < m.opponent_score).length
  const draws = matches.length - wins - losses

  return (
    <div className="bg-gray-5 p-6 rounded text-slate-50 text-lg border border-slate-50">
      <p>Total Games: {matches.length}</p>
      <p>Wins: {wins}</p>
      <p>Losses: {losses}</p>
      <p>Draws: {draws}</p>
      <p>Winrate: {(wins / matches.length * 100).toPrecision(3)}%</p>
    </div>
  )
}

export default StatsSummary
