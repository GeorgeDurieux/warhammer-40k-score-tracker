export type CustomButtonProps = {
    type?: 'button' | 'submit' | 'reset'
    onClick?: () => void
    disabled?: boolean
    children: React.ReactNode
    isSmall?: boolean
}