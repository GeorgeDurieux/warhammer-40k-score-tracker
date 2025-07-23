import { useEffect, useState } from 'react'
import ArmyList from '../components/ArmyList'
import { useNavigate } from 'react-router-dom'

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

    const [armies, setArmies] = useState<Army[]>([])
    let navigate = useNavigate()

    useEffect(() => {        
        const fetchArmies = async () => {
            const res = await fetch('http://localhost:4000/api/armies')
            const data = await res.json()
            setArmies(data)
        }
        fetchArmies()
    }, [])

    const handleEdit = (id: number) => {
        console.log('Edit army:', id)
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this army?')) return
        await fetch(`http://localhost:4000/api/armies/${id}`, { method: 'DELETE' })
        setArmies((prev) => prev.filter((a) => a.id !== id))
    }

     const handleAddArmy = () => {
        navigate('/add-army')
    }

    return (
        <div className="flex flex-col items-center mx-auto">

            <h1 className="text-slate-50 text-6xl text-center mt-24 mb-8">Armies</h1>

            <ArmyList armies={armies} onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAddArmy}/>

        </div>
    )
}

export default Armies
