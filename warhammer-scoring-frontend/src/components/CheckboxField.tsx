type CheckboxFieldProps = {
  id: string
  label: string
  value: boolean
  onChange: (value: boolean) => void
}

function CheckboxField({ id, label, value, onChange }: CheckboxFieldProps) {
  return (
    <div className="text-slate-50 text-xl text-center pt-4">
      <label htmlFor={id} className="inline-flex items-center cursor-pointer">

        {/* Visually hidden checkbox, for the utility */}
        <input
          type="checkbox"
          id={id}
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />

        {/* Custom checkbox box, for the visual */}
        <div
          className={`w-6 h-6 mr-2 border-2 bg-gray-5 rounded flex items-center justify-center transition-colors duration-200 border-slate-50 ${
            value ? 'bg-slate-25' : ''
          }`}
        >
          {value && (
            <svg
              className="w-4 h-4 text-slate-50"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <span>{label}</span>
      </label>
    </div>
  )
}

export default CheckboxField
