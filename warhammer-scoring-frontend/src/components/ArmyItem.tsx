import { useState } from "react";
import { ChevronRight, ChevronDown, Pencil, Trash2 } from "lucide-react";

type Detachment = {
  id: number
  name: string
}

type Army = {
    id: number
    name: string
    detachments: Detachment[]
}

type Props = {
    army: Army
    onEdit?: (id: number) => void
    onDelete?: (id: number) => void
}

export default function ArmyItem({ army, onEdit, onDelete }: Props) {

    const [isOpen, setIsOpen] = useState(false)

    const detachments = army.detachments || []

    return (
        <div className=" bg-gray-5 p-4 mb-4 rounded w-[350px]">
            <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-3">

                    <button onClick={() => setIsOpen(prev => !prev)} className="text-slate-35 hover:text-slate-50 transition-colors duration-250 cursor-pointer">
                        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>

                    <h2 className="text-lg font-semibold text-gray-300">{army.name}</h2>

                </div>

                <div className="flex gap-3">

                    <button onClick={() => onEdit?.(army.id)} className="text-slate-35 hover:text-slate-50 transition-colors duration-250 cursor-pointer">
                        <Pencil size={20} />
                    </button>

                    <button onClick={() => onDelete?.(army.id)} className="text-slate-35 hover:text-slate-50 transition-colors duration-250 cursor-pointer">
                        <Trash2 size={20} />
                    </button>

                </div>
            </div>

            <div 
                className={`pl-8 space-y-1 transition-all duration-400 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>

                {detachments.length > 0 ? (
                    army.detachments.map(det => (
                        <div key={det.id} className="text-gray-400">
                            • {det.name}
                        </div>
                    ))

                ) : (
                    <div className="text-gray-500 italic">No detachments</div>
                )}

            </div>
        </div>
    )
}