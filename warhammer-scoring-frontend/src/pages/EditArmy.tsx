import EditArmyComponent from "../components/EditArmyComponent"
import { useParams } from 'react-router-dom'

function EditArmy () {

    const { id } = useParams<{ id: string }>()
    const armyId = Number(id)

    return (
        <div className="flex flex-col items-center mx-auto">
            <h1 className="text-slate-50 text-6xl text-center mt-24 mb-8">Edit Army</h1>

            <EditArmyComponent
                armyId={armyId}     
            />
        </div>
    )
}

export default EditArmy