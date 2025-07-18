type CheckboxFieldProps = {
    id: string
    label: string
    value: boolean
    onChange: (value: boolean) => void
}

function CheckboxField({ id, label, value, onChange }: CheckboxFieldProps) {
    return (
        <div className="text-slate-50 text-xl text-center pt-4">
            <input 
                type="checkbox"
                id={id} 
                checked={value} 
                onChange={(e) => onChange(e.target.checked)}
                className=""
            >
            </input>
            <label className="mb-2 ml-2" htmlFor={id}>{label}</label>
        </div>
    )
}

export default CheckboxField