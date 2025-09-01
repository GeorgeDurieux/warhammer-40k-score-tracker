import type { User } from "./User"

export type AuthContextType = {
    isLoggedIn: boolean
    user: User | null
    login: (username: string, password: string) => void
    logout: () => void
    register: (username: string, password: string, email: string) => void
}