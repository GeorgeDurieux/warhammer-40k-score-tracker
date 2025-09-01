import type { TextareaFieldProps } from "../types/TextareaFieldProps"

function TextareaField({ id, label, value, onChange }: TextareaFieldProps) {
    return (
        <div className="text-slate-50 text-xl text-center">
            <label className="block mb-2" htmlFor={id}>{label}</label>
            <textarea 
                id={id} 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="border rounded px-2 bg-gray-5 text-center hover:shadow-lg focus:shadow-lg shadow-slate-35"
            >
            </textarea>
        </div>
    )
}

export default TextareaField