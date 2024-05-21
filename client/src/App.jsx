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
import UpdatePost from "./pages/UpdatePost"
import PostPage from "./pages/PostPage"
import ScrollToTop from "./components/ScrollToTop"
import Search from "./pages/Search"

function App() {

  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>

        <Route element={<PrivateRoute/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Route>
        <Route element={<AdminOnlyPrivateRoute/>}>
          <Route path="/create-post" element={<CreatePost/>}/>
          <Route path="/update-post/:postId" element={<UpdatePost/>}/>
        </Route>
        
        <Route path="/projects" element={<Projects/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/post/:postSlug" element={<PostPage/>}/>
        <Route path="/search" element={<Search/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
