import { useState } from "react"
import { NavLink as RouterNavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { LogIn, LogOut, Menu, X } from "lucide-react"
import type { NavbarProps } from "../types/NavbarProps"

function Navbar({ links }: NavbarProps) {
    const { user, isLoggedIn, logout } = useAuth()
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen)
    const closeMenu = () => setIsOpen(false)

    return (
        <nav className="bg-gray-5 text-white">
            <div className="flex justify-between items-center px-4 py-3 md:py-0">

                {/* Left side: links (desktop) */}
                <div className="hidden md:flex">
                    {links.map(({ label, path, adminOnly }) => {
                        if (adminOnly && !user?.isAdmin) return null
                        return (
                        <RouterNavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `px-8 py-4 transition-all duration-250 ${
                                    isActive
                                    ? "bg-[radial-gradient(circle_at_center,theme(colors.slate.50)_0%,theme(colors.slate.25)_100%)]"
                                    : "hover:bg-[radial-gradient(circle_at_center,theme(colors.slate.35)_0%,theme(colors.slate.15)_100%)]"
                                }`
                            }
                        >
                            {label}
                        </RouterNavLink>
                        )
                    })}
                </div>

                {/* Right side: auth controls (desktop) */}
                <div className="hidden md:flex items-center gap-4 px-4">
                    {isLoggedIn ? (
                        <>
                            <span>Welcome, {user?.username || "Commander"}!</span>
                            <button
                                className="transition-all duration-250 hover:text-slate-50 hover:scale-[1.1] cursor-pointer"
                                onClick={logout}
                            >
                                <LogOut />
                            </button>
                        </>
                    ) : (
                        <RouterNavLink
                            className="transition-colors duration-250 hover:text-slate-50 hover:scale-[1.1] cursor-pointer"
                            to="/login"
                            key="/login"
                        >
                            <LogIn />
                        </RouterNavLink>
                    )}
                </div>

                {/* Menu (mobile) */}
                <div className="md:hidden flex justify-between w-full">

                    {/* Left side: auth controls (mobile) */}
                    <div className="flex items-center gap-4 px-8 py-4">
                        {isLoggedIn ? (
                            <>
                                <button
                                className="transition-all duration-250 hover:text-slate-50 hover:scale-[1.1] cursor-pointer"
                                onClick={() => {
                                    logout()
                                    closeMenu()
                                }}
                                >
                                    <LogOut />
                                </button>
                            </>
                        ) : (
                            <RouterNavLink
                                to="/login"
                                onClick={closeMenu}
                                className="transition-colors duration-250 hover:text-slate-50 hover:scale-[1.1] cursor-pointer"
                            >
                                <LogIn />
                            </RouterNavLink>
                        )}
                    </div>

                    {/* Right side: menu button (mobile) */}
                    <button
                        onClick={toggleMenu}
                        className="p-2 rounded hover:text-slate-50 transition-all duration-250 hover:scale-[1.1] cursor-pointer"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

                </div>

            </div>

            {/* Mobile menu dropdown */}
            <div className={`
                md:hidden flex flex-col border-t border-slate-700
                overflow-hidden transition-all duration-500 ease-in-out
                ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
            `}>
                {links.map(({ label, path, adminOnly }) => {
                    if (adminOnly && !user?.isAdmin) return null
                    return (
                    <RouterNavLink
                        key={path}
                        to={path}
                        onClick={closeMenu}
                        className={({ isActive }) =>
                        `px-8 py-4 transition-all duration-250 ${
                            isActive
                            ? "bg-[radial-gradient(circle_at_center,theme(colors.slate.50)_0%,theme(colors.slate.25)_100%)]"
                            : "hover:bg-[radial-gradient(circle_at_center,theme(colors.slate.35)_0%,theme(colors.slate.15)_100%)]"
                        }`
                        }
                    >
                        {label}
                    </RouterNavLink>
                    )
                })}          
            </div>
        </nav>
    )
}

export default Navbar
