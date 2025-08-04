import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MatchHistoryComponent from "../components/MatchHistoryComponent"

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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this match?')) return
    await fetch(`http://localhost:4000/api/matches/${id}`, { method: 'DELETE' })
    setMatches(prev => prev.filter(m => m.id !== id))
  }

  const handleAddMatch = () => {
    navigate('/submit-match')
  }

  return (
    <div className="flex flex-col items-center mx-auto">
      <h1 className="text-slate-50 text-6xl text-center mt-24 mb-8">
        Match History
      </h1>

      <MatchHistoryComponent 
        matches={matches} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        onAdd={handleAddMatch}
      />
    </div>
  )
}

export default MatchHistory
