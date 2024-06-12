import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/authContext"

interface ProtectedRouteProps {
    children: JSX.Element
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {
    const {isLoggedIn} = useAuth();
    if(!isLoggedIn) {
    return <Navigate to="/auth" />
    }
  return children;
}

export default ProtectedRoute