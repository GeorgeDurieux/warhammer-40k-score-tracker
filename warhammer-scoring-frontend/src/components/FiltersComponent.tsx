import CheckboxField from "./CheckboxField"
import MonthRangeSlider from "./MonthRangeSlider"
import SelectField from "./SelectField"
import { useEffect, useMemo } from 'react'
import Title from "./Title"
import type { FiltersProps } from "../types/FilterProps"

const Filters = ({ filters, setFilters, matches, showWtc }: FiltersProps) => {

    //Dropdowns "all"
    const getUniqueWithAll = (list: string[]) => {
        return ['all', ...Array.from(new Set(list))]
    }

    //Unique armies / detachments that have been used / battled 
    const uniqueUserArmies = getUniqueWithAll(matches.map(m => m.user_army.name))
    const uniqueOpponentArmies = getUniqueWithAll(matches.map(m => m.opponent_army.name))

    const uniqueUserDetachments = getUniqueWithAll(
        matches
            .filter(m => filters.userArmy === 'all' || m.user_army.name === filters.userArmy)
            .map(m => m.user_detachment.name)
    )

    const uniqueOpponentDetachments = getUniqueWithAll(
        matches
            .filter(m => filters.opponentArmy === 'all' || m.opponent_army.name === filters.opponentArmy)
            .map(m => m.opponent_detachment.name)
    )

    //Get all months
    const months = useMemo(() => {
        return Array.from(
            new Set(
                matches
                    .map(m => m.date?.slice?.(0, 7))
                    .filter(Boolean)
            )
        ).sort()
    }, [matches])


    // Get indices of selected months
    const fromIdx: number = months.indexOf(filters.fromMonth)
    const toIdx: number = months.indexOf(filters.toMonth)

    // Default to full range if not set
    const rangeValues: [number, number] = months.length > 0 
    ? [
        fromIdx >= 0 ? fromIdx : 0,
        toIdx >= 0 ? toIdx : months.length > 0 ? months.length - 1 : 0
    ]
    : [0, 0]

    // Handle slider changes
    const handleMonthRangeChange = ([fromIdx, toIdx]: [number, number]) => {
        const from = months[fromIdx]
        const to = months[toIdx]

        if (from && to) {
            setFilters(f => ({
                ...f,
                fromMonth: from,
                toMonth: to
            }))
        }
    }

    //Automatically set deaults
    useEffect(() => {
        if (
            months.length > 0 &&
            (!filters.fromMonth || !months.includes(filters.fromMonth)) &&
            (!filters.toMonth || !months.includes(filters.toMonth))
        ) {
            setFilters(f => ({
                ...f,
                fromMonth: months[0],
                toMonth: months[months.length - 1]
            }))
        }
    }, [months])


    if (!matches || matches.length === 0) {
        return <div className="text-white text-xl">Loading filters...</div>
    }

    return (

        <div className="flex flex-col gap-12 bg-gray-5 rounded text-slate-50 h-full max-h-screen items-center overflow-y-auto">

            <Title title='Filters' />

            {/* Tournament Only */}
            <div>

                <CheckboxField 
                    id='tournamentOnly'
                    value={filters.tournamentOnly}
                    label='Tournament Only'
                    onChange={value => setFilters(f => ({ ...f, tournamentOnly: value }))}
                />

            </div>

            {/* WTC Scoring on / off */}
            { showWtc && (
                <div>

                    <CheckboxField 
                        id='wtc'
                        value={filters.wtc}
                        label='WTC Scoring'
                        onChange={value => setFilters(f => ({ ...f, wtc: value }))}
                    />

                </div>
            )}    

            {/* Months range picker */}
            <div>

                {/* Render if we have months */}
                {months.length > 0 && (
                    <div>
                        <MonthRangeSlider
                        months={months}
                        values={rangeValues}
                        onChange={handleMonthRangeChange}
                        />
                    </div>
                )}


            </div>

            <div className="flex flex-col gap-8 items-center">

                {/* User army options */}
                <div className="flex flex-col gap-4 ">

                    <SelectField 
                        id='userArmySelect'
                        label='Army'
                        value={filters.userArmy}
                        options={uniqueUserArmies.map(army => ({
                                label: army === 'all' ? 'All' : army,
                                value: army
                            }))
                        }    
                        onChange={value => setFilters(f => ({ ...f, userArmy: value, userDetachment: 'all' }))}
                    />

                    <SelectField 
                        id='userDetachmentSelect'
                        label='Detachment'
                        value={filters.userDetachment}
                        options={uniqueUserDetachments.map(detachment => ({
                                label: detachment === 'all' ? 'All' : detachment,
                                value: detachment
                            }))
                        }    
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
                        options={uniqueOpponentArmies.map(army => ({
                                label: army === 'all' ? 'All' : army,
                                value: army
                            }))
                        }    
                        onChange={value => setFilters(f => ({ ...f, opponentArmy: value, opponentDetachment: 'all' }))}
                    />

                    <SelectField 
                        id='opponentDetachmentSelect'
                        label='Detachment'
                        value={filters.opponentDetachment}
                        options={uniqueOpponentDetachments.map(detachment => ({
                                label: detachment === 'all' ? 'All' : detachment,
                                value: detachment
                            }))
                        }    
                        onChange={value => setFilters(f => ({ ...f, opponentDetachment: value }))}
                    />
                </div>
            </div>            
        </div>
    )
}

export default Filters
