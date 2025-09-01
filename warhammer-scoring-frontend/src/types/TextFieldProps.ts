export type TextFieldProps = {
    id: string
    label?: string
    value: string
    type?: string
    autoComplete?: string
    autoFocus?: boolean
    onChange: (value: string) => void
    icon?: React.ReactNode
    onIconClick?: () => void
    required?: boolean
    title?: string
    pattern?: string
    minLength?: number
    maxLength?: number
    onBlur?: () => void
}