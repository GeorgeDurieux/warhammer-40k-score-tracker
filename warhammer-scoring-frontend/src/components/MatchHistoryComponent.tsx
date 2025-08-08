import CustomButton from './CustomButton'
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

  user_army: { name: string }
  opponent_army: { name: string }
  user_detachment: { name: string }
  opponent_detachment: { name: string }
}

type MatchHistoryProps = {
  matches: Game[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onAdd: () => void
}

const MatchHistoryComponent = ({ matches, onEdit, onDelete, onAdd }: MatchHistoryProps) => {

  return (

    <div className="w-full max-w-4xl mb-32">

        <div className="flex justify-end mb-6">
            <CustomButton
                onClick={onAdd}
                children={'+ Add Match'}
            />
        </div>

        {matches.length === 0 ? (
            <p className="text-slate-50 text-center">No matches found.</p>
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
