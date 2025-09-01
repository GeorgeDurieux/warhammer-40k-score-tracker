import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from '@headlessui/react'
import { ChevronDownIcon } from 'lucide-react'
import { Fragment } from 'react'
import type { SelectFieldProps } from '../types/SelectFieldProps'

function SelectField({ id, label, value, options, onChange }: SelectFieldProps) {

    return (
        <div className="text-slate-50 text-xl text-center">

            <label className="block mb-2" htmlFor={id}>{label}</label>

            <div className="relative inline-block">

                <Listbox value={value} onChange={onChange}>

                    {({ open }) => (
                        <div>
                            <ListboxButton 
                                id={id} 
                                className="border rounded px-4 py-2 min-w-32 bg-gray-5 text-slate-50 cursor-pointer flex items-center justify-between gap-2
                                transition-all duration-200 focus:outline-none hover:shadow-lg shadow-slate-35"
                            >
                                <span>{options.find(option => option.value === value)?.label || '-- Select --'}</span>
                                <ChevronDownIcon
                                    className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                                />
                            </ListboxButton>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-250"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-250"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >

                                <ListboxOptions className="mt-1 max-h-100 min-w-max overflow-auto bg-gray-5 mx-auto border border-slate-50 rounded scrollbar-thin absolute left-1/2 w-full shadow-lg z-50 -translate-x-1/2 shadow-gray-5">

                                    <li className="px-4 py-2 text-slate-50 cursor-default select-none">
                                        -- Select --
                                    </li>

                                    {options.map(({ label, value }) => (
                                        <ListboxOption
                                            key={value}
                                            value={value}
                                            as={Fragment}
                                        >
                                            {({ focus, selected }) => (
                                                <li
                                                    className={`cursor-pointer px-4 py-2 bg-gray-5 text-slate-50 ${
                                                        focus ? 'bg-slate-25 ' : ''
                                                    } ${selected ? 'font-semibold' : 'font-normal'}`}
                                                >
                                                    {label}
                                                </li>
                                            )}
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>

                            </Transition>
                        </div>
                    )}

                        

                </Listbox>

            </div>

        </div>
    )
}

export default SelectField