const API_BASE = 'http://localhost:4000'

export const handleRegister = async (username: string, email: string, password: string) => {
    
    const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, email, password })
    })

    if (!res.ok) throw new Error('Registration failed')

    const data = await res.json()
    localStorage.setItem('token', data.token)

    return data       
}

export const handleLogin = async (username: string, password: string) => {

    const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
    })

    if (!res.ok) throw new Error('Login failed')

    const data = await res.json()
    localStorage.setItem('token', data.token)
        
    return data   
}

export const handleLogout = async () => {
    
    localStorage.removeItem("token")
}