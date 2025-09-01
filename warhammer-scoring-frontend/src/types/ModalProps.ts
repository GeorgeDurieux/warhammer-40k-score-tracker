export type ModalProps = {
    isOpen: boolean
    title: string
    children: React.ReactNode
    onClose: () => void
    onConfirm?: () => void
    confirmText?: string
}