import EditArmyComponent from "../components/EditArmyComponent"
import { useParams } from 'react-router-dom'
import Title from "../components/Title"

function EditArmy () {

    const { id } = useParams<{ id: string }>()
    const armyId = Number(id)

    return (
        <div className="flex flex-col items-center mx-auto">
            <Title title='Edit Army'/>

            <EditArmyComponent
                armyId={armyId}     
            />
        </div>
    )
}

export default EditArmy