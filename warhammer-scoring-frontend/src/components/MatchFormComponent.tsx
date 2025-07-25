import { useEffect, useState } from "react"
import type { MatchForm } from '../types/MatchForm'
import SelectField from './SelectField'
import NumberField from './NumberField'
import DateField from './DateField'
import CheckboxField from './CheckboxField'
import TextareaField from './TextareaField'
import CustomButton from "./CustomButton"
import { useAuth } from "../context/AuthContext"

type Detachment = {
  id: number
  name: string
}

type Army = {
  id: number
  name: string
  detachments: Detachment[]
}

function MatchFormComponent() {

    const { user } = useAuth()

    const [formData, setFormData] = useState<MatchForm>({
        user_army_id: 0,
        user_detachment_id: 0,
        opponent_army_id: 0,
        opponent_detachment_id: 0,
        date: '',
        user_score: 0,
        opponent_score: 0,
        is_tournament: false,
        tournament_name: ''
    })

    const [armies, setArmies] = useState<Army[]>([])
    
    useEffect(() => {        
        const fetchArmies = async () => {
            const res = await fetch('http://localhost:4000/api/armies')
            const data = await res.json()
            setArmies(data)
        }
        fetchArmies()
    }, [])

    const selectedUserArmy = armies.find(army => army.id === formData.user_army_id)
    const userDetachments = selectedUserArmy?.detachments ?? []

    const selectedOpponentArmy = armies.find(army => army.id === formData.opponent_army_id)
    const opponentDetachments = selectedOpponentArmy?.detachments ?? []

    return (
        <>
            <form
                className="flex flex-col items-center"

                onSubmit={ async (e) => {
                    e.preventDefault()
                    
                    try {

                        //User Id
                        const token = localStorage.getItem('token')

                        if (!token) {
                            alert('You must be logged in to submit')
                            return
                        }

                        const user_id = user?.id

                        //Calculation of WTC scores
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


                        //Make data, connect detachmnets
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

                        //Post match
                        const res = await fetch('http://localhost:4000/api/matches', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(matchData)
                        })

                        if (!res.ok) {
                            throw new Error('Failed to submit match')
                        }

                        alert('Match submitted!')

                    } catch (err) {
                        console.log(err)
                        alert('Error submitting match')
                    }
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
                        value: det.id.toString()
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
                        value: det.id.toString()
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
        </>
    )
}

export default MatchFormComponent