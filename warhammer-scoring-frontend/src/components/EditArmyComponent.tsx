import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import CustomButton from "./CustomButton"
import Modal from "./Modal"
import { handleApiError } from "../utils/handleApiError"

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

    const [modalOpen, setModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [modalMessage, setModalMessage] = useState("")

    useEffect(() => {
        const fetchArmy = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/armies/${armyId}`)
                if (!res.ok) throw await res.json()
                const data = await res.json()
                setArmy(data)
            } catch (err: any) {
                setModalTitle("Error")
                const { message } = handleApiError(err)
                setModalMessage(message)
                setModalOpen(true)
            }
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
        try {
            const res = await fetch(`http://localhost:4000/api/armies/${armyId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(army)
            })
            if (!res.ok) throw await res.json()

            setModalTitle("Success")
            setModalMessage("Army updated successfully")
            setModalOpen(true)

        } catch (err: any) {
            setModalTitle("Error")
            const { message } = handleApiError(err)
            setModalMessage(message)
            setModalOpen(true)
        }
    }

    if (!army) return <div>Loading...</div>

    return (

         <div className="flex flex-col items-center gap-8">

            {/* Army */}
            <div>
                <input
                    className="bg-gray-5 text-slate-50 px-2 py-1 rounded text-2xl"
                    value={army.name}
                    onChange={(e) => handleArmyNameChange(e.target.value)}
                />
            </div>

            {/* Detachments */}
            <div className="gap-2 flex flex-col w-full">
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
            <div className="w-full">
                <CustomButton
                    onClick={handleAddDetachment}
                    children={' + Add New Detachment'}
                    isSmall={true}
                />
            </div>

            {/* Save */}
            <div className="mt-8">
                <CustomButton
                    onClick={handleSave}
                    children={'Save Changes'}
                />
            </div>

            {/* Modal for success/ error*/}
            <Modal
                isOpen={modalOpen}
                title={modalTitle}
                onClose={() => setModalOpen(false)}
            >
                <p>{modalMessage}</p>
            </Modal>
        </div>
    )
}

export default EditArmyComponent