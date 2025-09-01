import { useState } from "react"
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import TextField from "./TextField"
import type { PasswordFieldProps } from "../types/PasswordFieldProps"

function PasswordField({
    id, 
    label, 
    value, 
    onChange, 
    autoComplete, 
    required, 
    pattern, 
    title, 
    minLength, 
    maxLength
}: PasswordFieldProps) {

    const [showPassword, setShowPassword] = useState(false)

    return (
        <>
            <div>
                <TextField 
                    id={id}
                    label={label}
                    value={value}
                    type={showPassword ? "text" : "password"}
                    autoComplete={autoComplete}
                    onChange={onChange}
                    icon={showPassword 
                        ? <EyeOffIcon className="hover:text-slate-50 cursor-pointer transition-colors duration-250"/> 
                        : <EyeIcon className="hover:text-slate-50 cursor-pointer transition-colors duration-250"/>
                    }
                    onIconClick={() => setShowPassword(prev => !prev)}
                    required={required}
                    pattern={pattern}
                    title={title}
                    minLength={minLength}
                    maxLength={maxLength}
                />
            </div>
        </>
    )
}

export default PasswordField