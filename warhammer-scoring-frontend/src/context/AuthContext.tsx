import { createContext, useState, useContext, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import type { ReactNode } from "react";
import {handleLogout as apiLogout, handleRegister} from "../services/auth"
import { handleLogin as apiLogin } from "../services/auth"

type User = {
    id: number
    username: string
    email: string
}

type AuthContextType = {
    isLoggedIn: boolean
    user: User | null
    login: (username: string, password: string) => void
    logout: () => void
    register: (username: string, password: string, email: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: {children: ReactNode}) => {
    
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {

        const token = localStorage.getItem('token')

        if (token) {
            const { id, username, email } = jwtDecode<User & {exp: number}>(token)

            setUser({ id, username, email })

            setIsLoggedIn(true)
        }
    }, [])

    const login = async (name: string, password: string) => {
        
        try {
            const data = await apiLogin(name, password)
            const { id, username, email } = jwtDecode<User & {exp: number}>(data.token)

            setUser({ id, username, email })

            setIsLoggedIn(true)
            
        } catch (err) {
            console.error("Login failed:", err)
        }
    }

    const register = async (name: string, password: string, mail: string) => {
        try {
            const data = await handleRegister(name, mail, password)
            const { id,  username, email } = jwtDecode<User & {exp: number}>(data.token)

            setUser({ id, username, email })
            
        } catch (err) {
            console.error('Registration failed', err)
        }
    }

    const logout = () => {
        apiLogout()
        setUser(null)
        setIsLoggedIn(false)
    }

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout, register }}>
            {children}
        </AuthContext.Provider>    
    )
}

export const useAuth = () => {
    
    const context = useContext(AuthContext)

    if (!context) throw new Error('useAuth must be used with an AuthProvider')
    return context    
}