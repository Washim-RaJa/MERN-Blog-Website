import { BrowserRouter, Routes, Route, } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"
import Header from "./components/Header"
import Footer from "./components/Footer"
import PrivateRoute from "./components/PrivateRoute"
import AdminOnlyPrivateRoute from "./components/AdminOnlyPrivateRoute"
import CreatePost from "./pages/CreatePost"

function App() {

  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>

        <Route element={<PrivateRoute/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Route>
        <Route element={<AdminOnlyPrivateRoute/>}>
          <Route path="/create-post" element={<CreatePost/>}/>
        </Route>
        
        <Route path="/projects" element={<Projects/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
