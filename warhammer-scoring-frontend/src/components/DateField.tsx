import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import '../css/datepicker.css'

type DateFieldProps = {
    id: string
    label: string
    value: string
    onChange: (value: string) => void
}

function DateField({ id, label, value, onChange }: DateFieldProps) {

    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    useEffect(() => {
    if (value) {
        const [year, month] = value.split('-').map(Number)
        const safeDate = new Date(year, month - 1, 1, 12)
        setSelectedDate(safeDate)
    }
}, [value])


    const handleChange = (date: Date | null) => {
        setSelectedDate(date)
        
        if (date) {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0') 
            const formatted = `${year}-${month}`

            onChange(formatted)
        }
    }

    return (
        <div className="text-slate-50 text-xl text-center pt-4">
            <label className="block mb-2" htmlFor={id}>{label}</label>
            <DatePicker 
                id={id} 
                selected={selectedDate}
                onChange={handleChange}
                dateFormat="yyyy-MM"
                showMonthYearPicker
                maxDate={new Date()}
                className="border rounded px-2 bg-gray-5"
            >
            </DatePicker>
        </div>
    )
}

export default DateField