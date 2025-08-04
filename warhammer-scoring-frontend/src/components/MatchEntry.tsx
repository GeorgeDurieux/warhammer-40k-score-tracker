import { Pencil, Trash2 } from "lucide-react"

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

type MatchEntryProps = {
  match: Game
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

const MatchEntry = ({ match, onEdit, onDelete }: MatchEntryProps) => {

  return (

    <div className="flex flex-col md:flex-row md:items-center justify-between bg-gray-5 p-4 rounded shadow">

      {/* Match info */}
      <div className="text-slate-50">

        <p className="text-lg font-bold">
            {match.user_army.name} ( {match.user_detachment.name} ) - {match.opponent_army.name} ( {match.opponent_detachment.name} )
        </p>

        <p className="text-lg font-semibold">
          {new Date(match.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          {match.is_tournament && match.tournament_name 
            ? ` - Tournament: ${match.tournament_name}` 
            : ''}
        </p>

        <p>
            Score: <strong>{match.user_score} - {match.opponent_score}</strong>
        </p>

        <p>
            WTC: <strong>{match.user_wtc_score}-{match.opponent_wtc_score} </strong>            
        </p>
        

      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-3 md:mt-0">

        <button 
            onClick={() => onEdit?.(match.id)} 
            className="text-slate-35 hover:text-slate-50 transition-colors duration-250 cursor-pointer"
        >
            <Pencil size={20} />
        </button>

        <button 
            onClick={() => onDelete?.(match.id)} 
            className="text-slate-35 hover:text-slate-50 transition-colors duration-250 cursor-pointer"
        >
            <Trash2 size={20} />
        </button>

      </div>
    </div>
  )
}

export default MatchEntry
