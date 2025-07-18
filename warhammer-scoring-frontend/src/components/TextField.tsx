type TextFieldProps = {
    id: string
    label: string
    value: string
    type?: string
    autoComplete?: string
    onChange: (value: string) => void
    icon?: React.ReactNode
    onIconClick?: () => void
    required?: boolean
    title?: string
    pattern?: string
    minLength?: number
    maxLength?: number
}

function TextField({
    id, 
    label, 
    value, 
    type, 
    autoComplete, 
    onChange,
    icon,
    onIconClick,
    required,
    title,
    pattern,
    minLength,
    maxLength
}: TextFieldProps) {
    return (
        <div className="text-slate-50 text-xl text-center">
            <label className="block mb-2" htmlFor={id}>{label}</label>
            <div className="relative inline-block mx-auto">
                <input 
                    type={type} 
                    id={id}
                    value={value}
                    autoComplete={autoComplete}
                    onChange={e => onChange(e.target.value)}
                    className="border rounded pl-2 py-1 pr-10"
                    required={required}
                    title={title}
                    pattern={pattern}
                    minLength={minLength}
                    maxLength={maxLength}
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