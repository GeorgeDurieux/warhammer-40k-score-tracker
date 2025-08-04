import CheckboxField from "./CheckboxField"
import SelectField from "./SelectField"

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

type FiltersProps = {
  filters: {
    tournamentOnly: boolean
    userArmy: string
    userDetachment: string
    opponentArmy: string
    opponentDetachment: string
  }
  setFilters: React.Dispatch<React.SetStateAction<{
    tournamentOnly: boolean
    userArmy: string
    userDetachment: string
    opponentArmy: string
    opponentDetachment: string
  }>>
  matches: Game[]
}

const Filters = ({ filters, setFilters, matches }: FiltersProps) => {
    const uniqueUserArmies = Array.from(new Set(matches.map(m => m.user_army.name)))
    const uniqueUserDetachments = Array.from(
        new Set(
            matches
                .filter(m => filters.userArmy === 'all' || m.user_army.name === filters.userArmy)
                .map(m => m.user_detachment.name)
        )
    )
    const uniqueOpponentArmies = Array.from(new Set(matches.map(m => m.opponent_army.name)))
    const uniqueOpponentDetachments = Array.from(
        new Set(
            matches
                .filter(m => filters.opponentArmy === 'all' || m.opponent_army.name === filters.opponentArmy)
                .map(m => m.opponent_detachment.name)
        )
    )

    return (
        <div className="flex flex-col gap-4 bg-gray-5 px-8 py-4 rounded text-slate-50">

            <div>

                <CheckboxField 
                    id='tournamentOnly'
                    value={filters.tournamentOnly}
                    label='Tournament Only'
                    onChange={value => setFilters(f => ({ ...f, tournamentOnly: value }))}
                />

            </div>

            <div className="flex gap-8 items-center">
                {/* User army options */}
                <div className="flex flex-col gap-4 ">

                    <SelectField 
                        id='userArmySelect'
                        label='Army'
                        value={filters.userArmy}
                        options={[
                            { label: 'All', value: 'all' },  
                            ...uniqueUserArmies.map(army => ({
                                label: army,
                                value: army
                            }))
                        ]}    
                        onChange={value => setFilters(f => ({ ...f, userArmy: value }))}
                    />

                    <SelectField 
                        id='userDetachmentSelect'
                        label='Detachment'
                        value={filters.userDetachment}
                        options={[
                            { label: 'All', value: 'all' },  
                            ...uniqueUserDetachments.map(detachment => ({
                                label: detachment,
                                value: detachment
                            }))
                        ]}    
                        onChange={value => setFilters(f => ({ ...f, userDetachment: value }))}
                    />
                </div>

                <div>
                    <p className="text-bold text-4xl">VS</p>
                </div>

                {/* Opponent army options */}            
                <div className="flex flex-col gap-4 ">

                    <SelectField 
                        id='opponentArmySelect'
                        label='Army'
                        value={filters.opponentArmy}
                        options={[
                            { label: 'All', value: 'all' },  
                            ...uniqueOpponentArmies.map(army => ({
                                label: army,
                                value: army
                            }))
                        ]}    
                        onChange={value => setFilters(f => ({ ...f, opponentArmy: value }))}
                    />

                    <SelectField 
                        id='opponentDetachmentSelect'
                        label='Detachment'
                        value={filters.opponentDetachment}
                        options={[
                            { label: 'All', value: 'all' },  
                            ...uniqueOpponentDetachments.map(detachment => ({
                                label: detachment,
                                value: detachment
                            }))
                        ]}    
                        onChange={value => setFilters(f => ({ ...f, opponentDetachment: value }))}
                    />
                </div>
            </div>            
        </div>
    )
}

export default Filters
