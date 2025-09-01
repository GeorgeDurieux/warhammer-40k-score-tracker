import { Pencil, Trash2 } from "lucide-react"
import type { MatchEntryProps } from "../types/MatchEntryProps"

const MatchEntry = ({ match, onEdit, onDelete }: MatchEntryProps) => {

  return (

    <div className="flex flex-col md:flex-row md:items-center justify-between bg-gray-5 p-4 rounded shadow">

      {/* Match info */}
      <div className="text-slate-50">

        <p className="text-lg font-bold">
            {match.userArmy.name} ( {match.userDetachment.name} ) - {match.opponentArmy.name} ( {match.opponentDetachment.name} )
        </p>

        <p className="text-lg font-semibold">
          {new Date(match.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          {match.isTournament && match.tournamentName 
            ? ` - Tournament: ${match.tournamentName}` 
            : ''}
        </p>

        <p>
            Score: <strong>{match.userScore} - {match.opponentScore}</strong>
        </p>

        <p>
            WTC: <strong>{match.userWtcScore}-{match.opponentWtcScore} </strong>            
        </p>
        

      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-3 md:mt-0">

        <button 
            onClick={() => onEdit?.(match.id)} 
            className="text-slate-35 hover:text-slate-50 hover:scale-[1.1] transition-all  duration-250 cursor-pointer"  
        >
            <Pencil size={20} />
        </button>

        <button 
            onClick={() => onDelete?.(match.id)} 
            className="text-slate-35 hover:text-slate-50 hover:scale-[1.1] transition-all duration-250 cursor-pointer"
        >
            <Trash2 size={20} />
        </button>

      </div>
    </div>
  )
}

export default MatchEntry
