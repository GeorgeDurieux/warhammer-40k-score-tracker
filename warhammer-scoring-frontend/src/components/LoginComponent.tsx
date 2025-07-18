import { useState } from "react"
import TextField from "../components/TextField"
import PasswordField from "./PasswordField"
import CustomButton from "./CustomButton"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

function LoginComponent() {

    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    })

    const { login } = useAuth()

    const navigate = useNavigate()

    const onSubmit = async (e: React.FormEvent) => {

        e.preventDefault()

        try {
            await login(loginData.username, loginData.password)
            loginData.username = ''
            loginData.password = ''
            navigate('/')

        } catch (err) {
            console.error('Login failed', err)
        }
    }

    return (
        <>            
            <form 
                className="flex flex-col gap-4 items-center" 
                onSubmit={onSubmit}
            >
                
                <TextField 
                    type="text"
                    id="username"
                    label="Username"
                    value={loginData.username}
                    autoComplete="username"
                    onChange={(val) => setLoginData({ ...loginData, username: val})}
                    required
                    pattern="^[A-Za-z0-9_]{3,16}$"
                    title="Username must be 3-16 characters long and contain only letters, numbers, and underscores."
                />

                <PasswordField 
                    id="password"
                    label="Password"
                    autoComplete="current-password"
                    value={loginData.password}
                    onChange={(val) => setLoginData({ ...loginData, password : val})}
                    required
                    pattern="^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"
                    title="Password must be at least 8 characters, contain one uppercase letter and one number."
                />

                <CustomButton type="submit">Login</CustomButton>

                <p className="text-xl text-slate-50">Don't have an account?</p>

                <CustomButton onClick={() => navigate('/register')}>Register</CustomButton>

            </form>
        </>
    )
}

export default LoginComponent