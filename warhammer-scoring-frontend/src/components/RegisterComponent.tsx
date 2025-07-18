import { useState } from "react"
import TextField from "./TextField"
import PasswordField from "./PasswordField"
import { useAuth } from "../context/AuthContext"
import CustomButton from "./CustomButton"

function RegisterComponent() {

    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const { register } = useAuth()

    const onSubmit = async (e: React.FormEvent) => {

        e.preventDefault()

        if (registerData.password !== registerData.confirmPassword) {
            alert("Passwords do not match")
            return
        }

        try {
            await register(
                registerData.username, 
                registerData.password, 
                registerData.email
            )

        } catch (err) {
            console.error('Registration failed', err)
        }
    }

    return (
        <form 
            className="flex flex-col gap-4 items-center" 
            onSubmit={onSubmit}
        >
            <TextField 
                type="text"
                id="username"
                label="Username"
                value={registerData.username}
                onChange={(val) => setRegisterData({ ...registerData, username: val})}
                required
                pattern="^[A-Za-z0-9_]{3,16}$"
                title="Username must be 3-16 characters long and contain only letters, numbers, and underscores."
            />

            <TextField 
                type="email"
                id="email"
                label="Email"
                value={registerData.email}
                autoComplete="email"
                onChange={(val) => setRegisterData({ ...registerData, email: val})}
                required
            />

            <PasswordField 
                id="password"
                label="Password"
                value={registerData.password}
                onChange={(val) => setRegisterData({ ...registerData, password : val})}
                required
                pattern="^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"
                title="Password must be at least 8 characters, contain one uppercase letter and one number."
            />

            <PasswordField 
                id="confirmPassword"
                label="Confirm Password"
                value={registerData.confirmPassword}
                onChange={(val) => setRegisterData({ ...registerData, confirmPassword : val})}
                required
                pattern="^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"
                title="Password must be at least 8 characters, contain one uppercase letter and one number."
            />

            <CustomButton type="submit">Register</CustomButton>
        </form>
    )
}

export default RegisterComponent