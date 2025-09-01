import ArmyItem from './ArmyItem'
import CustomButton from './CustomButton'
import type { ArmyListProps } from '../types/ArmyListProps'

export default function ArmyList({ armies, onEdit, onDelete, onAdd }: ArmyListProps) {

  return (

    <div className="flex flex-col items-center gap-4 mb-32">
        {armies.map(army => (
            <ArmyItem
                key={army.id}
                army={army}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        ))}

        <div className='mt-8'>
            <CustomButton onClick={onAdd}>
                + Add New Army
            </CustomButton>
        </div>
    </div>
  )
}
