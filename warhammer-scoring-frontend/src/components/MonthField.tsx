type MonthFieldProps = {
    id: string
    label: string
    value: string
    onChange: (value: string) => void
}

function MonthField({ id, label, value, onChange }: MonthFieldProps) {
    return (
        <div className="text-slate-50 text-xl text-center pt-4">
            <label className="block mb-2" htmlFor={id}>{label}</label>
            <input 
                type="month"
                id={id} 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="border rounded px-2"
            >
            </input>
        </div>
    )
}

export default MonthField