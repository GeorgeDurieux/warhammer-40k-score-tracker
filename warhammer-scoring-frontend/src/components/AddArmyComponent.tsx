import { useState } from "react"
import TextField from "./TextField"
import CustomButton from "./CustomButton"
import Modal from "./Modal"
import { handleApiError } from "../utils/handleApiError"

function AddArmyComponent() {

    const [armyName, setArmyName] = useState('')
    const [detachments, setDetachments] = useState([''])

    const [modalOpen, setModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalMessage, setModalMessage] = useState('')

    const handleAddDetachment = () => {
        setDetachments([...detachments, ''])
    }

    const handleDetachmentsChange = (index: number, value: string) => {
        const newDetachments = [...detachments]
        newDetachments[index] = value
        setDetachments(newDetachments)
    }

    const handleSubmit = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/armies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: armyName, detachments })
            })

            if (!res.ok) {
                throw await res.json()
            }

            // Clear form after success
            setArmyName('')
            setDetachments([''])

            setModalTitle('Success')
            setModalMessage('Army created successfully')
            setModalOpen(true)

        } catch (err: any) {
            setModalTitle('Error')
            const { message } = handleApiError(err)
            setModalMessage(message)
            setModalOpen(true)
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">

            <TextField
                id={armyName}
                type="text"
                value={armyName}
                label={'Army Name'}
                onChange={(newVal) => setArmyName(newVal)}
            />

            {detachments.map((detachmentName, detachmentIndex) => (
                <TextField
                    id={detachmentName}
                    type="text"
                    value={detachmentName}
                    label={`Detachment ${detachmentIndex + 1}`}
                    onChange={(newVal) => handleDetachmentsChange(detachmentIndex, newVal)}
                />
            ))}

            <CustomButton 
                onClick={handleAddDetachment} 
                children={'Add detachment'}
                isSmall={true}
            />

            <CustomButton 
                onClick={handleSubmit}
                children={'Submit'}

            />

            {/* Modal for success/error */}
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

export default AddArmyComponent