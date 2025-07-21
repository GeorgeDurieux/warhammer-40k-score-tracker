type TextareaFieldProps = {
    id: string
    label: string
    value: string
    onChange: (value: string) => void
}

function TextareaField({ id, label, value, onChange }: TextareaFieldProps) {
    return (
        <div className="text-slate-50 text-xl text-center pt-4">
            <label className="block mb-2" htmlFor={id}>{label}</label>
            <textarea 
                id={id} 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="border rounded px-2 bg-gray-5 text-center"
            >
            </textarea>
        </div>
    )
}

export default TextareaField