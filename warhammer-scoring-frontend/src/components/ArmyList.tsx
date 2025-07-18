import ArmyItem from './ArmyItem'
import CustomButton from './CustomButton'

type Detachment = {
    id: number
    name: string
}

type Army = {
    id: number
    name: string
    detachments: Detachment[]
}

type Props = {
  armies: Army[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onAdd: () => void
}

export default function ArmyList({ armies, onEdit, onDelete, onAdd }: Props) {

  return (

    <div className="p-6 flex flex-col items-center">
        {armies.map(army => (
            <ArmyItem
                key={army.id}
                army={army}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        ))}

        <CustomButton onClick={onAdd}>
            + Add New Army
        </CustomButton>
    </div>
  )
}
