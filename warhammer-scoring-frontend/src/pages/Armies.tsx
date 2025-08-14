import { useEffect, useState } from 'react'
import ArmyList from '../components/ArmyList'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'

type Detachment = {
  id: number
  name: string
}

type Army = {
  id: number
  name: string
  detachments: Detachment[]
}

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
                const res = await fetch('http://localhost:4000/api/armies')
                if (!res.ok) throw new Error('Failed to fetch armies')
                const data = await res.json()
                setArmies(data)
            } catch (err: any) {
                setErrorMessage(err.message || 'Something went wrong')
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
            const res = await fetch(`http://localhost:4000/api/armies/soft/${armyToDelete}`, { method: 'PATCH' })
            if (!res.ok) throw new Error('Failed to delete army')

            // Reset UI
            setArmies(prev => prev.filter(a => a.id !== armyToDelete))

        } catch (err: any) {
            setErrorMessage(err.message || 'Failed to delete army')
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

            <h1 className="text-slate-50 text-6xl text-center mt-24 mb-8">Armies</h1>

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
