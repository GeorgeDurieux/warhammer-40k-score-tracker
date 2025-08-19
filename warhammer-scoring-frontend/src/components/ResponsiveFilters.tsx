import { useEffect, useState } from "react"
import { Filter, X } from "lucide-react" // icons
import Filters from "./FiltersComponent"

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
        wtc: boolean
        userArmy: string
        userDetachment: string
        opponentArmy: string
        opponentDetachment: string
        fromMonth: string
        toMonth: string
    }
    setFilters: React.Dispatch<React.SetStateAction<{
        tournamentOnly: boolean
        wtc: boolean
        userArmy: string
        userDetachment: string
        opponentArmy: string
        opponentDetachment: string
        fromMonth: string
        toMonth: string
    }>>
    matches: Game[]
    showWtc?: boolean
}

const ResponsiveFilters = (props: FiltersProps) => {

    const [isOpen, setIsOpen] = useState(false)

    //Non scrollable background
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            document.body.style.position = "fixed"
        } else {
            document.body.style.overflow = ''
            document.body.style.position = ""
        }

        // cleanup on unmount
        return () => {
            document.body.style.overflow = ''
            document.body.style.position = ""
        }
    }, [isOpen])

    return (
        <div>

            {/* Mobile button */}
            <div className="md:hidden text-center p-4 border-t border-slate-50">
                <button
                    className="p-2 rounded text-white hover:text-slate-50 transition-all duration-250 hover:scale-[1.1] cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                <Filter size={20} className="inline" />
                    Filters
                </button>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden md:block w-80">
                <Filters {...props} />
            </div>

            {/* Mobile slide-over panel */}
            <div
                className={`
                fixed inset-y-0 right-0 z-50 w-70 bg-gray-5 transform transition-transform duration-500 ease-in-out border border-slate-50
                ${isOpen ? "translate-x-0" : "translate-x-full"}
                `}
            >
                <div className="flex flex-col h-full">

                    <div className="flex justify-end items-center p-4 border-b border-slate-50">

                    <button 
                        onClick={() => setIsOpen(false)}        className="text-white"
                    >
                        <X size={36} className="hover:text-slate-50 transition-all duration-250 cursor-pointer" />
                    </button>

                    </div>

                    <div className="p-4 flex-1 overflow-y-auto">
                        <Filters {...props} />
                    </div>

                </div>                

            </div>

            {/* Dim background when open */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className={`fixed inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-300
                    ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                />
            )}
        </div>
    )
}

export default ResponsiveFilters
