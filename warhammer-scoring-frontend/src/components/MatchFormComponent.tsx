import { useEffect, useState } from "react"
import type { MatchForm } from '../types/MatchForm'
import SelectField from './SelectField'
import NumberField from './NumberField'
import DateField from './DateField'
import CheckboxField from './CheckboxField'
import TextareaField from './TextareaField'

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

    const [formData, setFormData] = useState<MatchForm>({
        userArmy: '',
        userDetachment: '',
        opponentArmy: '',
        opponentDetachment: '',
        date: '',
        userScore: 0,
        opponentScore: 0,
        isTournament: false,
        tournamentName: ''
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

    const armyNames = armies.map(army => army.name).sort()

    const selectedUserArmy = armies.find(army => army.name === formData.userArmy)
    const userDetachments = selectedUserArmy?.detachments.map(det => det.name).sort() ?? []

    const selectedOpponentArmy = armies.find(army => army.name === formData.opponentArmy)
    const opponentDetachments = selectedOpponentArmy?.detachments.map(det => det.name).sort() ?? []

    return (
        <>
            <form>

                <SelectField 
                    label="Your Army"
                    id="userArmy"
                    value={formData.userArmy}
                    options={armyNames}
                    onChange={(val) => setFormData({ 
                        ...formData, 
                        userArmy: val,
                        userDetachment: ''
                    })}
                    required
                />

                <SelectField 
                    label="Your Detachment"
                    id="userDetachment"
                    value={formData.userDetachment}
                    options={userDetachments}
                    onChange={(val) => setFormData({ ...formData, userDetachment: val})}
                />

                <SelectField 
                    label="Opponent's Army"
                    id="opponentArmy"
                    value={formData.opponentArmy}
                    options={armyNames}
                    onChange={(val) => setFormData({ 
                        ...formData, 
                        opponentArmy: val,
                        opponentDetachment: ''
                    })}
                    required
                />

                <SelectField 
                    label="Opponent's Detachment"
                    id="opponentDetachment"
                    value={formData.opponentDetachment}
                    options={opponentDetachments}
                    onChange={(val) => setFormData({ ...formData, opponentDetachment: val})}
                />

                <NumberField 
                    label="Your Score"
                    id="userScore"
                    value={formData.userScore}
                    onChange={(val) => setFormData({ ...formData, userScore: val})}
                    required
                />

                <NumberField 
                    label="Opponent's Score"
                    id="opponentScore"
                    value={formData.opponentScore}
                    onChange={(val) => setFormData({ ...formData, opponentScore: val})}
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
                    value={formData.isTournament}
                    onChange={(isTournament) => {
                        setFormData((prev) => ({
                            ...prev,
                            isTournament,
                            tournamentName:
                                isTournament
                                ? prev.tournamentName ?? ''
                                : undefined
                        }))
                    }}
                />

                {formData.isTournament && (
                    <TextareaField 
                    label="Tournament Name"
                    id="tournamentName"
                    value={formData.tournamentName ?? ''}
                    onChange={(val) => setFormData({ ...formData, tournamentName: val})}
                />
                )}

            </form>
        </>
    )
}

export default MatchFormComponent