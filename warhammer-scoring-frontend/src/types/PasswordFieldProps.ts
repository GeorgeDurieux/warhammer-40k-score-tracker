export type PasswordFieldProps = {
    id: string
    label: string
    value: string
    onChange: (value: string) => void
    autoComplete?: string
    required?: boolean
    pattern?: string
    title?: string
    minLength?: number
    maxLength?: number
}