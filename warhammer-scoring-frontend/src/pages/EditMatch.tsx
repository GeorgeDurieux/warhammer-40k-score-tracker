import { useParams } from "react-router-dom"
import MatchFormComponent from "../components/MatchFormComponent"
import { useEffect, useState } from "react"
import type { MatchForm } from "../types/MatchForm"
import Modal from "../components/Modal"
import { handleApiError } from "../utils/handleApiError"
import Title from "../components/Title"

const EditMatch = () => {

    const { id } = useParams<{ id: string }>()
    const numericId = Number(id)
    const [matchData, setMatchData] = useState<MatchForm & {id: number} | null>(null)
    const [loading, setLoading] = useState(true)
    const [errorModalOpen, setErrorModalOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/matches/${numericId}`)
                if (!res.ok) {
                    throw await res.json()
                }
                const data = await res.json()

                // Convert API response to MatchForm format
                const formattedMatch: MatchForm & { id: number } = {
                    id: data.id,
                    user_army_id: data.user_army.id,
                    user_detachment_id: data.user_detachment.id,
                    opponent_army_id: data.opponent_army.id,
                    opponent_detachment_id: data.opponent_detachment.id,
                    date: data.date.split("T")[0], 
                    user_score: data.user_score,
                    opponent_score: data.opponent_score,
                    is_tournament: data.is_tournament,
                    tournament_name: data.tournament_name ?? ""
                }

                setMatchData(formattedMatch)

            } catch (err: any) {
                const { message } = handleApiError(err)
                setErrorMessage(message)
                setErrorModalOpen(true)

            } finally {
                setLoading(false)
            }
        }

        fetchMatch()
    }, [id])

    if (loading) return <p className="text-center">Loading match...</p>

    return (
        <div className="flex flex-col items-center mx-auto">

            <Title title='Edit match' />

            {matchData && (
                <MatchFormComponent matchToEdit={matchData} />
            )}

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

export default EditMatch