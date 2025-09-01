import type { SortOption } from "./SortOption"

export type SortBarProps = {
    sortOption: SortOption
    onSortChange: (option: SortOption) => void
}