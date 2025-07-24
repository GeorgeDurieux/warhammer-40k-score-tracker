import { useState } from "react"
import TextField from "./TextField"
import CustomButton from "./CustomButton"

function AddArmyComponent() {

    const [armyName, setArmyName] = useState('')
    const [detachments, setDetachments] = useState([''])

    const handleAddDetachment = () => {
        setDetachments([...detachments, ''])
    }

    const handleDetachmentsChange = (index: number, value: string) => {
        const newDetachments = [...detachments]
        newDetachments[index] = value
        setDetachments(newDetachments)
    }

    const handleSubmit = async () => {
        const response = await fetch('http://localhost:4000/api/armies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: armyName, detachments })
        })

        if (response.ok) {
            setArmyName('')
            setDetachments([''])
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
        </div>

    )
}

export default AddArmyComponent