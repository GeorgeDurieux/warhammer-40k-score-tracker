import { useEffect, useState } from "react"
import TextField from "./TextField"
import { Pencil, Trash2 } from "lucide-react"
import CustomButton from "./CustomButton"

type Detachment = {
    id?: number
    name: string
    isNew?: boolean
}

type Army = {
    id: number
    name: string
    detachments: Detachment[]
}

function EditArmyComponent ({ armyId }: {armyId: number}) {

    const [army, setArmy] = useState<Army | null>(null)
    const [isEditingArmyName, setIsEditingArmyName] = useState(false)

    useEffect(() => {
        const fetchArmy = async () => {
            const res = await fetch(`http://localhost:4000/api/armies/${armyId}`)
            const data = await res.json()
            setArmy(data)
        }
        fetchArmy()
    }, [armyId])

    const handleArmyNameChange = (newName: string) => {
        if (!army) return
        setArmy({ ...army, name: newName })
    }

    const handleDetachmentChange = (index: number, newName: string) => {
        if (!army) return
        const newDetachments = [...army.detachments]
        newDetachments[index].name = newName
        setArmy({ ...army, detachments: newDetachments })
    }

    const handleDeleteDetachment = (index: number) => {
        if (!army) return
        const newDetachments = [...army.detachments]
        newDetachments.splice(index, 1)
        setArmy({ ...army, detachments: newDetachments })
    }

    const handleAddDetachment = () => {
        if (!army) return
        setArmy({
            ...army,
            detachments: [...army.detachments, { name: '', isNew: true }]
        })
    }

    const handleSave = async () => {
        await fetch(`http://localhost:4000/api/armies/${armyId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(army)
        })
        alert('Army updated!')
    }

    if (!army) return <div>Loading...</div>

    return (

         <div className="flex flex-col items-center gap-4">

            {/* Army Name */}
            <div className="mb-4">
                {isEditingArmyName ? (
                    <TextField
                        id={army.name}
                        value={army.name}
                        onChange={() => handleArmyNameChange(army.name)}
                        onBlur={() => setIsEditingArmyName(false)}
                        autoFocus={true}
                    />
                ) : (
                    <div>
                        <span className="text-2xl text-slate-50">{army.name}</span>
                        <button onClick={() => setIsEditingArmyName(true)} className="text-slate-35 hover:text-slate-50 transition-colors duration-250 cursor-pointer ml-2">
                            <Pencil size={20} />
                            </button>
                    </div>
                )}
            </div>

            {/* Detachments */}
            <div className="space-y-2 mb-4">
                {army.detachments.map((detachment, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <input
                            className="bg-gray-5 text-slate-50 px-2 py-1 rounded flex-1 text-xl"
                            value={detachment.name}
                            onChange={(e) => handleDetachmentChange(index, e.target.value)}
                        />
                        <button
                            onClick={() => handleDeleteDetachment(index)}
                            className="text-slate-35 hover:text-slate-50 transition-colors duration-250 cursor-pointer"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Detachment */}
            <CustomButton
                onClick={handleAddDetachment}
                children={'Add detachment'}
                isSmall={true}
            
            />

            {/* Save */}
            <div>
                <CustomButton
                    onClick={handleSave}
                    children={'Save Changes'}
                />
            </div>
        </div>
    )
}

export default EditArmyComponent