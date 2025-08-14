import { useNavigate } from 'react-router-dom'
import CustomButton from '../components/CustomButton'
import { FaExclamationTriangle } from 'react-icons/fa'

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-6 text-center">
            <FaExclamationTriangle className="text-6xl text-red-800" />
            <h1 className="text-4xl text-red-800 font-bold">404 - Page Not Found</h1>
            <p className="text-lg text-slate-50">
                Sorry, the page you are looking for does not exist.
            </p>
            <CustomButton onClick={() => navigate('/')} children="Go Home" />
        </div>
    )
}
