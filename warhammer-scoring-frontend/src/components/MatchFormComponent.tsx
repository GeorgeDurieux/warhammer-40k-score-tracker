import { useEffect, useState } from "react"
import type { MatchForm } from '../types/MatchForm'
import SelectField from './SelectField'
import NumberField from './NumberField'
import DateField from './DateField'
import CheckboxField from './CheckboxField'
import TextareaField from './TextareaField'
import CustomButton from "./CustomButton"
import { useAuth } from "../context/AuthContext"
import Modal from "./Modal"
import { handleApiError } from "../utils/handleApiError"
import type { Army } from "../types/Army"
import type { Detachment } from "../types/Detachment"
import type { MatchFormComponentProps } from "../types/MatchFormComponentProps"

function MatchFormComponent({ matchToEdit }: MatchFormComponentProps) {

    const { user } = useAuth()

    const [formData, setFormData] = useState<MatchForm>(
        matchToEdit || {
            user_army_id: 0,
            user_detachment_id: 0,
            opponent_army_id: 0,
            opponent_detachment_id: 0,
            date: '',
            user_score: 0,
            opponent_score: 0,
            is_tournament: false,
            tournament_name: ''
        }
    )

    const [armies, setArmies] = useState<Army[]>([])
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [feedbackModal, setFeedbackModal] = useState<{
        open: boolean
        title: string
        message: string
    }>({ open: false, title: '', message: '' })

    useEffect(() => {
        if (matchToEdit) {
        setFormData(matchToEdit)
        }
    }, [matchToEdit])
    
    useEffect(() => {        
    const fetchArmies = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/armies`)
            if (!res.ok) throw await res.json()
            
            const data = await res.json()
            setArmies(data)

        } catch (err) {
            const { title, message } = handleApiError(err)
            setFeedbackModal({ open: true, title, message })
        }
    }

    fetchArmies()
}, [])


    //Find detachments according to armies
    const getEffectiveDetachments = (armyId: number): Detachment[] => {
        const army = armies.find(a => a.id === armyId)
        if (!army) return []

        const chapterNames = ['Space Wolves', 'Dark Angels', 'Blood Angels', 'Deathwatch', 'Black Templars']
        const isChapter = chapterNames.includes(army.name)

        if (isChapter) {
            const marines = armies.find(a => a.name === 'Space Marines')
            const marineDetachments = marines?.detachments ?? []
            return [...(army.detachments ?? []), ...marineDetachments]
        }

        return army.detachments ?? []
    }

    const userDetachments = getEffectiveDetachments(formData.user_army_id)
    const opponentDetachments = getEffectiveDetachments(formData.opponent_army_id)

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setFeedbackModal({ open: true, title: 'Not Logged In', message: 'You must be logged in to submit' })
                return
            }

            const user_id = user?.id
            const scoreDiff = formData.user_score - formData.opponent_score
            const absDiff = Math.abs(scoreDiff)

            let wtcDelta = 0
            if (absDiff >= 6 && absDiff <= 10) wtcDelta = 1
            else if (absDiff >= 11 && absDiff <= 15) wtcDelta = 2
            else if (absDiff >= 16 && absDiff <= 20) wtcDelta = 3
            else if (absDiff >= 21 && absDiff <= 25) wtcDelta = 4
            else if (absDiff >= 26 && absDiff <= 30) wtcDelta = 5
            else if (absDiff >= 31 && absDiff <= 35) wtcDelta = 6
            else if (absDiff >= 36 && absDiff <= 40) wtcDelta = 7
            else if (absDiff >= 41 && absDiff <= 45) wtcDelta = 8
            else if (absDiff >= 46 && absDiff <= 50) wtcDelta = 9
            else if (absDiff >= 51) wtcDelta = 10

            let user_wtc_score, opponent_wtc_score
            if (scoreDiff === 0) {
                user_wtc_score = opponent_wtc_score = 10
            } else if (scoreDiff > 0) {
                user_wtc_score = 10 + wtcDelta
                opponent_wtc_score = 10 - wtcDelta
            } else {
                user_wtc_score = 10 - wtcDelta
                opponent_wtc_score = 10 + wtcDelta
            }

            const matchData = {
                ...formData,
                user_id,
                user_wtc_score,
                opponent_wtc_score,
                detachments_games_user_detachment_idTodetachments: {
                connect: { id: formData.user_detachment_id }
                },
                detachments_games_opponent_detachment_idTodetachments: {
                connect: { id: formData.opponent_detachment_id }
                },
                armies_games_user_army_idToarmies: {
                connect: { id: formData.user_army_id }
                },
                armies_games_opponent_army_idToarmies: {
                connect: { id: formData.opponent_army_id }
                },
                users: {
                connect: { id: user_id }
                }
            }

            let res
            if (matchToEdit?.id) {
                res = await fetch(`${import.meta.env.VITE_API_URL}/matches/${matchToEdit.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(matchData)
                })
            } else {
                res = await fetch(`${import.meta.env.VITE_API_URL}/matches`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(matchData)
                })
            }

            if (!res.ok) {
                throw await res.json()
            }

            setFeedbackModal({
                open: true,
                title: 'Success',
                message: matchToEdit?.id ? 'Match updated!' : 'Match submitted!'
            })

        } catch (err) {
            const { title, message } = handleApiError(err)
            setFeedbackModal({ open: true, title, message })
        }
    }


    return (
        <>
            <form
                className="flex flex-col items-center gap-4"

                onSubmit={ async (e) => {
                    e.preventDefault()
                    setIsConfirmOpen(true)                    
                }}
            >    

                <SelectField
                    label="Your Army"
                    id="userArmy"
                    value={formData.user_army_id.toString()}
                    options={armies.map(army => ({ label: army.name, value: army.id.toString() }))}
                    onChange={(val) =>
                        setFormData({
                        ...formData,
                        user_army_id: Number(val),
                        user_detachment_id: 0
                        })
                    }
                />


                <SelectField
                    label="Your Detachment"
                    id="userDetachment"
                    value={formData.user_detachment_id.toString()}
                    options={userDetachments.map(det => ({
                        label: det.name,
                        value: det.id!.toString()
                    })) ?? []}
                    onChange={(val) =>
                        setFormData({ ...formData, user_detachment_id: Number(val) })
                    }
                />


                <SelectField
                    label="Opponent's Army"
                    id="opponentArmy"
                    value={formData.opponent_army_id.toString()}
                    options={armies.map(army => ({ label: army.name, value: army.id.toString() }))}
                    onChange={(val) =>
                        setFormData({
                        ...formData,
                        opponent_army_id: Number(val),
                        opponent_detachment_id: 0
                        })
                    }
                />


                <SelectField
                    label="Opponent's Detachment"
                    id="opponentDetachment"
                    value={formData.opponent_detachment_id.toString()}
                    options={opponentDetachments.map(det => ({
                        label: det.name,
                        value: det.id!.toString()
                    })) ?? []}
                    onChange={(val) =>
                        setFormData({ ...formData, opponent_detachment_id: Number(val) })
                    }
                />


                <NumberField 
                    label="Your Score"
                    id="userScore"
                    value={formData.user_score}
                    onChange={(val) => setFormData({ ...formData, user_score: val})}
                    required
                />

                <NumberField 
                    label="Opponent's Score"
                    id="opponentScore"
                    value={formData.opponent_score}
                    onChange={(val) => setFormData({ ...formData, opponent_score: val})}
                    required
                />

                <DateField 
                    label="Date"
                    id="date"
                    value={formData.date}
                    onChange={(val) => setFormData({ ...formData, date: val})}
                />

                <CheckboxField 
                    label="Tournament match"
                    id="isTournament"
                    value={formData.is_tournament}
                    onChange={(is_tournament) => {
                        setFormData((prev) => ({
                            ...prev,
                            is_tournament,
                            tournament_name:
                                is_tournament
                                ? prev.tournament_name ?? ''
                                : undefined
                        }))
                    }}
                />

                {formData.is_tournament && (
                    <TextareaField 
                    label="Tournament Name"
                    id="tournamentName"
                    value={formData.tournament_name ?? ''}
                    onChange={(val) => setFormData({ ...formData, tournament_name: val})}
                />
                )}

                <CustomButton
                    children={'Submit Match'}
                    type='submit'
                />

            </form>

            {/* Confirmation Modal */}
            <Modal
                isOpen={isConfirmOpen}
                title="Confirm Submission"
                children="Are you sure you want to submit this match?"
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => {
                    setIsConfirmOpen(false)
                    handleSubmit()
                }}
                confirmText="Submit"
            />

            {/* Feedback Modal */}
            <Modal
                isOpen={feedbackModal.open}
                title={feedbackModal.title}
                children={feedbackModal.message}
                onClose={() => setFeedbackModal({ ...feedbackModal, open: false })}
            />
        </>
    )
}

export default MatchFormComponent