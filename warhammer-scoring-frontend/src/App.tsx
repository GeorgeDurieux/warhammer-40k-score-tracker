import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SubmitMatch from './pages/SubmitMatch'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import Login from './pages/LogIn'
import Register from './pages/Register'
import Armies from './pages/Armies'
import AddArmy from './pages/AddArmy'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Submit Match', path: '/submit-match' },
  { label: 'Match History', path: '/match-history' },
  { label: 'Statistics', path: '/statistics' },
  { label: 'Admin: Armies', path: '/armies', adminOnly: true }
]

function App() {

    return (
        <>
            <Navbar links={links} />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/submit-match" element={<SubmitMatch />} />
                <Route path="/armies" element={<Armies />} />
                <Route path='/add-army' element={<AddArmy />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}

export default App

