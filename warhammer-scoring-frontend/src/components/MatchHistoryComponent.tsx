import MatchEntry from './MatchEntry'

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

type MatchHistoryProps = {
  matches: Game[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onAdd: () => void
}

const MatchHistoryComponent = ({ matches, onEdit, onDelete, onAdd }: MatchHistoryProps) => {
  return (
    <div className="w-full max-w-4xl">
      <div className="flex justify-end mb-6">
        <button 
          onClick={onAdd} 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow"
        >
          + Add Match
        </button>
      </div>

      {matches.length === 0 ? (
        <p className="text-slate-300 text-center">No matches found.</p>
      ) : (
        <div className="space-y-4">
            {matches.map((match) => (
                <MatchEntry
                    key={match.id}
                    match={match}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}   
        </div>
      )}
    </div>
  )
}

export default MatchHistoryComponent
