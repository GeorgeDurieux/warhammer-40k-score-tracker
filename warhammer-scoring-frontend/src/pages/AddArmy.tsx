import AddArmyComponent from "../components/AddArmyComponent"
import Title from "../components/Title"

function AddArmy() {

    return (
            <div className="flex flex-col items-center mx-auto">
    
                <Title title='Add Army' />

                <AddArmyComponent />
    
            </div>
    )
}

export default AddArmy