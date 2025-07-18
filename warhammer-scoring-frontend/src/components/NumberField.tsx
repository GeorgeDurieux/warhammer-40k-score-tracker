type NumberFieldProps = {
    id: string
    label: string
    value: number
    onChange: (value: number) => void
    required?: boolean
}

function NumberField({ id, label, value, onChange, required }: NumberFieldProps) {
    return (
        <div className="text-slate-50 text-xl text-center pt-4">
            <label className="block mb-2" htmlFor={id}>{label}</label>
            <input 
                type="number"
                id={id} 
                value={value} 
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-16 border rounded px-2"
                min={0}
                max={100}
                step={1}
                required={required}
            >
            </input>
        </div>
    )
}

export default NumberField