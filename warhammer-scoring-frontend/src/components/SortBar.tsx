import CustomButton from "./CustomButton"
import { FaArrowUp, FaArrowDown } from "react-icons/fa"
import type { SortBarProps } from "../types/SortBarProps"
import type { SortOption } from "../types/SortOption"
import type { SortField } from "../types/SortField"

const SortBar = ({ sortOption, onSortChange }: SortBarProps) => {

    const toggleSort = (field: SortField) => {
        const isAsc = sortOption === `${field}-asc`
        const newDirection = isAsc ? 'desc' : 'asc'
        onSortChange(`${field}-${newDirection}` as SortOption)
    }

    const getIcon = (field: SortField) => {
        const isActive = sortOption.startsWith(field)
        const isAsc = sortOption.endsWith('asc')

        const arrowClass = `ml-2 inline transition-transform duration-200 ${
            isActive ? 'opacity-100' : 'opacity-30'
        }`

        return isAsc
            ? <FaArrowUp className={arrowClass} key={'arrUp'} />
            : <FaArrowDown className={arrowClass} key={'arrDown'}/>
    }


    return (
        <div className="flex gap-2">
            <CustomButton
                onClick={() => toggleSort('date')}
                isSmall={true}
                children={['Date', getIcon('date')]}
                >
            </CustomButton>

            <CustomButton
                onClick={() => toggleSort('score')}
                isSmall={true}
                >
                Score {getIcon('score')}
            </CustomButton>

            <CustomButton
                onClick={() => toggleSort('wtc')}
                isSmall={true}
                >
                WTC Score {getIcon('wtc')}
            </CustomButton>

        </div>
    )
}

export default SortBar
