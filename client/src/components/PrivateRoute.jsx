import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

export default function PrivateRoute() {

    const {currentUser} = useSelector((state)=> state.user)

    // If currentUser is true/signed in then return the children i.e <Dashboard/> 
    // which can be obtained by <Outlet/> otherwise navigate to <Signin/>

  return currentUser ? <Outlet/> : <Navigate to='/signin'/>;
  
}
