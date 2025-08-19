import { useEffect, useMemo, useState } from 'react'
import CustomButton from './CustomButton'
import MatchEntry from './MatchEntry'
import SortBar from './SortBar'

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

type SortOption = 'date-desc' | 'date-asc' | 'score-desc' | 'score-asc' | 'wtc-desc' | 'wtc-asc'

const MatchHistoryComponent = ({ matches, onEdit, onDelete, onAdd }: MatchHistoryProps) => {

    const [sortOption, setSortOption] = useState<SortOption>('date-desc')

    //For smaller button
    const [isSmallScreen, setIsSmallScreen] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768) 
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const sortedMatches = useMemo(() => {

        const copy = [...matches]

        switch (sortOption) {
        case 'date-asc':
            return copy.sort((a, b) => a.date.localeCompare(b.date))
        case 'score-desc':
            return copy.sort((a, b) => b.user_score - a.user_score)
        case 'score-asc':
            return copy.sort((a, b) => a.user_score - b.user_score)
        case 'wtc-desc':
            return copy.sort((a, b) => b.user_wtc_score - a.user_wtc_score)
        case 'wtc-asc':
            return copy.sort((a, b) => a.user_wtc_score - b.user_wtc_score)
        case 'date-desc':
        default:
            return copy.sort((a, b) => b.date.localeCompare(a.date))
        }

    }, [matches, sortOption])

    return (

        <div className="w-full max-w-4xl mb-32">

            <div className='flex gap-8 justify-between items-end mb-6'>

                <SortBar sortOption={sortOption} onSortChange={setSortOption} />

                <div className="flex justify-end">
                    <CustomButton
                        onClick={onAdd}
                        children={'Add Match +'}
                        isSmall={isSmallScreen}
                    />
                </div>

            </div>            

            {sortedMatches.length === 0 ? (
                <p className="text-slate-50 text-center">No matches found.</p>
            ) : (
                <div className="space-y-4">
                    {sortedMatches.map((match) => (
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
