type TextFieldProps = {
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

function TextField({
    id, 
    label, 
    value, 
    type, 
    autoComplete,
    autoFocus, 
    onChange,
    icon,
    onIconClick,
    required,
    title,
    pattern,
    minLength,
    maxLength,
    onBlur
}: TextFieldProps) {
    return (
        <div className="text-slate-50 text-xl text-center">
            <label className="block mb-2" htmlFor={id}>{label}</label>
            <div className="relative inline-block mx-auto bg-gray-5">
                <input 
                    type={type} 
                    id={id}
                    value={value}
                    onBlur={onBlur}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    onChange={e => onChange(e.target.value)}
                    className="border rounded pl-2 py-1 pr-10 hover:shadow-lg focus:shadow-lg focus:outline-none shadow-slate-35"
                    required={required}
                    title={title}
                    pattern={pattern}
                    minLength={minLength}
                    maxLength={maxLength}
                    spellCheck={false}
                />
                {icon && (
                    <button
                        type="button"
                        onClick={onIconClick}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                        tabIndex={-1}
                    >
                        {icon}
                    </button>
                )}
            </div>            
        </div>
    )
}

export default TextField