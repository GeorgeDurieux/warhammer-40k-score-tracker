import { NavLink as RouterNavLink} from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { LogIn, LogOut } from 'lucide-react'

type NavLink = {
    label: string
    path: string
    adminOnly?: boolean
}

type NavbarProps = {
    links: NavLink[]
}

function Navbar({ links }: NavbarProps) {

    const { user, isLoggedIn, logout } = useAuth()

    return (
        <>
            <nav className="bg-gray-5 text-white flex justify-between">
                <div className="flex">
                    {links.map(({ label, path, adminOnly }) => {
                        if (adminOnly && !user?.is_admin) return null
                        return (
                            <RouterNavLink 
                                key={path} 
                                to={path} 
                                className={({ isActive }) => 
                                    `px-8 py-4 transition-all duration-250 ${
                                        isActive  
                                        ? 'bg-[radial-gradient(circle_at_center,theme(colors.slate.50)_0%,theme(colors.slate.25)_100%)]' 
                                        : 'hover:bg-[radial-gradient(circle_at_center,theme(colors.slate.35)_0%,theme(colors.slate.15)_100%)]'
                                    }`
                                }
                            >
                                {label}
                            </RouterNavLink>
                        )
                    })}
                </div>   

                {isLoggedIn ? (
                    <div className="flex items-center gap-4 px-4">
                        <span>Welcome, {user?.username || 'Commander'}!</span>
                        <button 
                            className="transition-all duration-250 hover:text-slate-50 hover:scale-[1.1] cursor-pointer"
                            onClick={logout}
                        >
                            <LogOut/>
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 px-4">
                        <RouterNavLink 
                            className="transition-colors duration-250 hover:text-slate-50 hover:scale-[1.1] cursor-pointer"
                            to='/login'
                            key='/login'
                            
                        >
                            <LogIn />
                        </RouterNavLink>
                    </div>
                )}
            </nav>
        </>
    )
}

export default Navbar