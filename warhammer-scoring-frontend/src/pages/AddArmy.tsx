import AddArmyComponent from "../components/AddArmyComponent"

function AddArmy() {

    return (
            <div className="flex flex-col items-center mx-auto">
    
                <h1 className="text-slate-50 text-6xl text-center mt-24 mb-8">Add Army</h1>

                <AddArmyComponent />
    
            </div>
    )
}

export default AddArmy