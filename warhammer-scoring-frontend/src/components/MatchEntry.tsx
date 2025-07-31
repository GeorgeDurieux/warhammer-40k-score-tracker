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
}

type MatchEntryProps = {
  match: Game
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

const MatchEntry = ({ match, onEdit, onDelete }: MatchEntryProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between bg-slate-800 p-4 rounded-lg shadow">
      {/* Match info */}
      <div className="text-slate-100">
        <p className="text-lg font-semibold">
          {new Date(match.date).toLocaleDateString()} 
          {match.is_tournament && match.tournament_name 
            ? ` - Tournament: ${match.tournament_name}` 
            : ''}
        </p>
        <p className="text-sm text-slate-300">
          Score: {match.user_score} - {match.opponent_score} 
          (WTC: {match.user_wtc_score}-{match.opponent_wtc_score})
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-3 md:mt-0">
        <button 
          onClick={() => onEdit(match.id)} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(match.id)} 
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default MatchEntry
