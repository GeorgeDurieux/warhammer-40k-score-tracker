import { useEffect, useMemo, useState } from 'react'
import CustomButton from './CustomButton'
import MatchEntry from './MatchEntry'
import SortBar from './SortBar'
import type { MatchHistoryProps } from '../types/MatchHistortProps'
import type { SortOption } from '../types/SortOption'

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
            return copy.sort((a, b) => b.userScore - a.userScore)
        case 'score-asc':
            return copy.sort((a, b) => a.userScore - b.userScore)
        case 'wtc-desc':
            return copy.sort((a, b) => b.userWtcScore - a.userWtcScore)
        case 'wtc-asc':
            return copy.sort((a, b) => a.userWtcScore - b.userWtcScore)
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
