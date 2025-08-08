import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MatchHistoryComponent from "../components/MatchHistoryComponent"
import Filters from '../components/FiltersComponent'

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

const MatchHistory = () => {
    const [matches, setMatches] = useState<Game[]>([])

    const [filters, setFilters] = useState({
            tournamentOnly: false,
            wtc: false,
            userArmy: 'all',
            userDetachment: 'all',
            opponentArmy: 'all',
            opponentDetachment: 'all',
            fromMonth: '',
            toMonth: ''
        })
        
    const navigate = useNavigate()

    useEffect(() => {
        const fetchMatches = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/matches')
            const data = await res.json()
            setMatches(data)
            
        } catch (error) {
            console.error('Failed to fetch matches:', error)
        }
        }
        fetchMatches()
    }, [])

    const handleEdit = (id: number) => {
        navigate(`/edit-match/${id}`)
    }

    const filteredMatches = matches.filter(match => {

            //Tournament
            if (filters.tournamentOnly && !match.is_tournament) return false

            //Armies and detachments
            if (filters.userArmy && filters.userArmy !== 'all' && match.user_army.name !== filters.userArmy) return false
            if (filters.userDetachment && filters.userDetachment !== 'all' && match.user_detachment.name !== filters.userDetachment) return false
            if (filters.opponentArmy && filters.opponentArmy !== 'all' && match.opponent_army.name !== filters.opponentArmy) return false
            if (filters.opponentDetachment && filters.opponentDetachment !== 'all' && match.opponent_detachment.name !== filters.opponentDetachment) return false

            //Dates
            const matchMonth = match.date.slice(0, 7)
            if (filters.fromMonth && matchMonth < filters.fromMonth) return false
            if (filters.toMonth && matchMonth > filters.toMonth) return false
            
            //Remaining return
            return true
        })

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this match?')) return
        await fetch(`http://localhost:4000/api/matches/${id}`, { method: 'DELETE' })
        setMatches(prev => prev.filter(m => m.id !== id))
    }

    const handleAddMatch = () => {
        navigate('/submit-match')
    }

    return (

        <div className="flex min-h-screen items-start">

            <aside className="w-80 bg-gray-5 p-4 rounded sticky top-0 min-h-screen">
                <Filters filters={filters} setFilters={setFilters} matches={matches}/>
            </aside>

            <div className="flex flex-col items-center mx-auto">
                <h1 className="text-slate-50 text-6xl text-center mt-24 mb-8">
                    Match History
                </h1>

                <MatchHistoryComponent 
                    matches={filteredMatches} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                    onAdd={handleAddMatch}
                />
            </div>

        </div>
    )
}

export default MatchHistory
