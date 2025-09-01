export type NumberFieldProps = {
    id: string
    label: string
    value: number
    onChange: (value: number) => void
    required?: boolean
    min?: number
    max?: number
    step?: number
}