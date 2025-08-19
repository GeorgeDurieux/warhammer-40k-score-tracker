import { useEffect, useState } from 'react'
import StatsSummary from '../components/StatsSummary'
import MatchList from '../components/MatchList'
import WinrateByMonth from '../components/WinrateByMonth'
import ScoreByMonth from '../components/ScoreByMonth'
import Modal from '../components/Modal'
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

const Statistics = () => {
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

    const [errorModalOpen, setErrorModalOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/matches')
                const data = await res.json()
                setMatches(data)
            } catch (error: any) {
                setErrorMessage(error.message || 'Failed to fetch matches')
                setErrorModalOpen(true)
            }
        }
        fetchMatches()
    }, [])

    const filteredMatches = matches.filter(match => {

        if (filters.tournamentOnly && !match.is_tournament) return false
        if (filters.userArmy !== 'all' && match.user_army.name !== filters.userArmy) return false
        if (filters.userDetachment !== 'all' && match.user_detachment.name !== filters.userDetachment) return false
        if (filters.opponentArmy !== 'all' && match.opponent_army.name !== filters.opponentArmy) return false
        if (filters.opponentDetachment !== 'all' && match.opponent_detachment.name !== filters.opponentDetachment) return false

        const matchMonth = match.date.slice(0, 7)
        if (filters.fromMonth && matchMonth < filters.fromMonth) return false
        if (filters.toMonth && matchMonth > filters.toMonth) return false

        return true
    })

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-15 text-slate-50">

            {/* Sidebar */}
            <aside className="bg-gray-5 w-full md:w-80 md:sticky md:top-0 md:min-h-screen">
                <div className="w-full overflow-x-auto">
                    <ResponsiveFilters
                        filters={filters}
                        setFilters={setFilters}
                        matches={matches}
                    />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col gap-6 p-4 w-full">
                <Title title='Statistics' />

                <div className="flex flex-col gap-6 w-full max-w-full overflow-x-auto">
                    <StatsSummary filters={filters} matches={filteredMatches} />
                    <MatchList filters={filters} matches={filteredMatches} />
                    <WinrateByMonth filters={filters} matches={filteredMatches} />
                    <ScoreByMonth filters={filters} matches={filteredMatches} />
                </div>
            </main>

            {/* Error Modal */}
            <Modal
                isOpen={errorModalOpen}
                title="Error"
                onClose={() => setErrorModalOpen(false)}
            >
                <p>{errorMessage}</p>
            </Modal>
        </div>
    )
}

export default Statistics
