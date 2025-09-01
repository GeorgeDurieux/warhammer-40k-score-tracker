import { useEffect, useState } from 'react'
import type { NumberFieldProps } from '../types/NumberFieldProps'

function NumberField({
  id,
  label,
  value,
  onChange,
  required = false,
  min = 0,
  max = 100,
  step = 1,
}: NumberFieldProps) {

    const [inputValue, setInputValue] = useState<string>(value.toString())

    useEffect(() => {
        setInputValue(value.toString())
    }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value

    if (val === '' || /^-?\d*$/.test(val)) {
      setInputValue(val)
    }
  }

  const commitValue = () => {
    const parsed = parseInt(inputValue)

    if (!isNaN(parsed)) {
      let clamped = Math.max(min, Math.min(max, parsed))
      onChange(clamped)

    } else {
      setInputValue('0')
      onChange(0)
    }
  }  


  const handleFocus = () => {
    if (inputValue === value.toString()) {
      setInputValue('')
    }
  }  

  const increment = () => {
    const next = Math.min(value + step, max)
    onChange(next)
  }

  const decrement = () => {
    const next = Math.max(value - step, min)
    onChange(next)
  }

  return (

    <div className="text-slate-50 text-xl text-center">

      <label htmlFor={id} className="block mb-2">{label}</label>

      <div className="relative inline-flex items-center">

        <input
          id={id}
          type="number"
          value={inputValue}
          onChange={handleChange}
          onBlur={commitValue}
          onFocus={handleFocus}
          required={required}
          className="w-24 px-2 py-1 bg-gray-5 border border-slate-50 text-slate-50 rounded text-center appearance-none hover:shadow-lg  focus:shadow-lg shadow-slate-35"
        />

        {/* Minus button */}
        <button
          type="button"
          onClick={decrement}
          className="absolute left-0 pl-2 h-full cursor-pointer text-slate-50 hover:text-white hover:scale-[1.1] transition-all duration-250"
        >
          –
        </button>

        {/* Plus button */}
        <button
          type="button"
          onClick={increment}
          className="absolute right-0 pr-2 h-full cursor-pointer text-slate-50 hover:text-white hover:scale-[1.1] transition-all duration-250"
        >
          +
        </button>
      </div>
    </div>
  )
}


export default NumberField