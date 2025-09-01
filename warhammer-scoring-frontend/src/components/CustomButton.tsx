import type { CustomButtonProps } from "../types/CustomButtonProps"

function CustomButton({ children, type, onClick, disabled, isSmall }: CustomButtonProps) {
    return (
        <>
            <button 
            className={`bg-gray-5 text-slate-50 transition-all duration-250 hover:bg-[radial-gradient(circle_at_center,theme(colors.slate.35)_0%,theme(colors.slate.15)_100%)] hover:scale-[1.02] rounded cursor-pointer hover:shadow-lg shadow-gray-5 ${
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