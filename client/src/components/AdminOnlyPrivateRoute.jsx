import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

export default function AdminOnlyPrivateRoute() {

    const {currentUser} = useSelector((state)=> state.user)

    // If currentUser is true/signed & admin also in then return the children i.e <CreatePost/> 
    // which can be obtained by <Outlet/> otherwise navigate to <Signin/>

  return currentUser && currentUser.isAdmin ? <Outlet/> : <Navigate to='/signin'/>;
  
}
