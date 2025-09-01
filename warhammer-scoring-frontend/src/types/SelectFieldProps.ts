import type { Option } from './Option'

export type SelectFieldProps = {
    id: string
    label: string
    value: string
    options: Option[]
    onChange: (value: string) => void
    required?: boolean
}