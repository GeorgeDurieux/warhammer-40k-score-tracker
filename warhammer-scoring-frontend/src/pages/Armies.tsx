import { useEffect, useState } from 'react'
import ArmyList from '../components/ArmyList'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import { handleApiError } from '../utils/handleApiError'
import Title from '../components/Title'
import type { Army } from '../types/Army'

function Armies() {

    const [errorModalOpen, setErrorModalOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const [confirmModalOpen, setConfirmModalOpen] = useState(false)
    const [armyToDelete, setArmyToDelete] = useState<number | null>(null)

    const [armies, setArmies] = useState<Army[]>([])

    let navigate = useNavigate()

    useEffect(() => {        
        const fetchArmies = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/armies`)
                if (!res.ok) throw await res.json()
                const data = await res.json()
                setArmies(data)
            } catch (err: any) {
                const { message } = handleApiError(err)
                setErrorMessage(message)
                setErrorModalOpen(true)
            }
        }
        fetchArmies()
    }, [])

    const handleEdit = (id: number) => {
        navigate(`/edit-army/${id}`)
    }

    const handleDelete = (id: number) => {
        setArmyToDelete(id)
        setConfirmModalOpen(true)
    }

    const confirmDelete = async () => {

        if (armyToDelete === null) return
        
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/armies/soft/${armyToDelete}`, { method: 'PATCH' })
            if (!res.ok) throw await res.json()

            // Reset UI
            setArmies(prev => prev.filter(a => a.id !== armyToDelete))

        } catch (err: any) {
            const { message } = handleApiError(err)
            setErrorMessage(message)
            setErrorModalOpen(true)

        } finally {
            setConfirmModalOpen(false)
            setArmyToDelete(null)
        }
    }

     const handleAddArmy = () => {
        navigate('/add-army')
    }

    return (
        <div className="flex flex-col items-center mx-auto">

            <Title title='Armies' />

            <ArmyList armies={armies} onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAddArmy}/>

            {/* Error modal */}
            <Modal
                isOpen={errorModalOpen}
                title={"Error"}
                onClose={() => setErrorModalOpen(false)}
            >
                <p>{errorMessage}</p>
            </Modal>

            {/* Confirm Delete Modal */}
            <Modal
                isOpen={confirmModalOpen}
                title="Confirm Delete"
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                confirmText="Delete"
            >
                Are you sure you want to delete this army?
            </Modal>


        </div>

    )
}

export default Armies
