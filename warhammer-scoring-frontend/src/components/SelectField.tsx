import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import { Fragment } from 'react'

type SelectFieldProps = {
    id: string
    label: string
    value: string
    options: string[]
    onChange: (value: string) => void
    required?: boolean
}

function SelectField({ id, label, value, options, onChange }: SelectFieldProps) {

    return (
        <div className="text-slate-50 text-xl text-center pt-4">

            <label className="block mb-2" htmlFor={id}>{label}</label>

            <Listbox value={value} onChange={onChange}>

                <ListboxButton id={id} className="border rounded px-4 py-2 min-w-16 bg-gray-5 text-slate-50 cursor-pointer text-left">
                    {value || '-- Select --'}
                </ListboxButton>

                <ListboxOptions className="mt-1 max-h-60 max-w-100 overflow-auto bg-gray-5 mx-auto border border-slate-50 rounded scrollbar-thin">

                    <li className="px-4 py-2 text-slate-50 cursor-default select-none">
                        -- Select --
                    </li>

                    {options.map((option) => (
                        <ListboxOption
                            key={option}
                            value={option}
                            as={Fragment}
                        >
                            {({ focus, selected }) => (
                                <li
                                    className={`cursor-pointer px-4 py-2 bg-gray-5 text-slate-50 ${
                                        focus ? 'bg-slate-25 ' : ''
                                    } ${selected ? 'font-semibold' : 'font-normal'}`}
                                >
                                    {option}
                                </li>
                            )}
                        </ListboxOption>
                    ))}
                </ListboxOptions>

            </Listbox>

        </div>
    )
}

export default SelectField