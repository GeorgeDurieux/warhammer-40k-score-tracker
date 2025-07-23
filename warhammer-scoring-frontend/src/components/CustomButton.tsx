type ButtonProps = {
    type?: 'button' | 'submit' | 'reset'
    onClick?: () => void
    disabled?: boolean
    children: React.ReactNode
    isSmall?: boolean
}

function CustomButton({ children, type, onClick, disabled, isSmall }: ButtonProps) {
    return (
        <>
            <button 
            className={`bg-gray-5 text-slate-50 transition-colors duration-250 hover:bg-slate-25 rounded cursor-pointer m-2 ${
                    isSmall 
                    ? 'px-4 py-2' 
                    : 'px-8 py-4 text-xl' 
                }`
            }
            type={type}
            disabled={disabled}
            onClick={onClick}
            >
                {children}
            </button>
        </>
    )
}

export default CustomButton