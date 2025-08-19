import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MatchHistoryComponent from "../components/MatchHistoryComponent"
import Modal from '../components/Modal'
import { handleApiError } from '../utils/handleApiError'
import ResponsiveFilters from '../components/ResponsiveFilters'
import Title from '../components/Title'

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

        const [confirmModalOpen, setConfirmModalOpen] = useState(false)
        const [matchToDelete, setMatchToDelete] = useState<number | null>(null)

        const [errorModalOpen, setErrorModalOpen] = useState(false)
        const [errorMessage, setErrorMessage] = useState('')
        
    const navigate = useNavigate()

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/matches')
                if (!res.ok) throw await res.json()
                const data = await res.json()
                setMatches(data)
                
            } catch (err: any) {
                const { message } = handleApiError(err)
                setErrorMessage(message)
                setErrorModalOpen(true)
            }
        }
        fetchMatches()
    }, [])

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

    const handleEdit = (id: number) => {
        navigate(`/edit-match/${id}`)
    }

    const handleDelete = (id: number) => {
        setMatchToDelete(id)
        setConfirmModalOpen(true)
    }

    const confirmDelete = async () => {
        if (matchToDelete === null) return

        try {
            const res = await fetch(`http://localhost:4000/api/matches/${matchToDelete}`, { method: 'DELETE' })
            if (!res.ok) throw await res.json()

            setMatches(prev => prev.filter(m => m.id !== matchToDelete))

        } catch (err: any) {
            const { message } = handleApiError(err)
            setErrorMessage(message)
            setErrorModalOpen(true)
        } finally {
            setConfirmModalOpen(false)
            setMatchToDelete(null)
        }
    }

    const handleAddMatch = () => {
        navigate('/submit-match')
    }

    return (

        <div className="flex min-h-screen items-start flex-col md:flex-row">

            <aside
                className="
                    bg-gray-5 md:w-80 md:sticky md:top-0 md:min-h-screen
                    w-full relative min-h-0
                "
                >
                <ResponsiveFilters
                    filters={filters}
                    setFilters={setFilters}
                    matches={matches}
                />
            </aside>


            <div className="flex flex-col items-center mx-auto">
                <Title title='Match History' />

                <MatchHistoryComponent 
                    matches={filteredMatches} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                    onAdd={handleAddMatch}
                />

                {/* Confirm Delete Modal */}
                <Modal
                    isOpen={confirmModalOpen}
                    title="Confirm Delete"
                    onClose={() => setConfirmModalOpen(false)}
                    onConfirm={confirmDelete}
                    confirmText="Delete"
                >
                    Are you sure you want to delete this match?
                </Modal>

                {/* Error Modal */}
                <Modal
                    isOpen={errorModalOpen}
                    title="Error"
                    onClose={() => setErrorModalOpen(false)}
                >
                    <p>{errorMessage}</p>
                </Modal>
            </div>

        </div>
    )
}

export default MatchHistory
