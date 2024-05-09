import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({})
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e)=> {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim()
    })
  }
  const handleSubmit = async (e)=> {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.')
    }
    try {
      setLoading(true)
      setErrorMessage(null) // cleaning the previous error if exist.
      const res = await fetch('/api/auth/signup',{// We've added a proxy in vite.config.js instead of http://localhost:3000
        method: 'POST',
        headers: {
          "Content-Type" : 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false)
        return setErrorMessage(data.message)
      }
      
      if (res.ok) {
        setLoading(false)
        navigate('/signin')
      }
      
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
    }

  }
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl gap-5 mx-auto flex-col md:flex-row md:items-center">
        {/* Left section */}
        <div className="flex-1">
          <Link to="/" className="text-5xl font-bold dark:text-white">
              <span className="px-2 py-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                RaJa&apos;s
              </span>
              Blog
          </Link>
          <p className="text-sm mt-5">
            This project is build for the purpose of learning <em><b><q>MERN Stack Development</q></b></em>.
            You can signup with your email and password or with Google.
          </p>
        </div>

        {/* Right section */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username"/>
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your email"/>
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password"/>
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone='purpleToPink' type="submit">
              Sign up
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link
              to='/signin'
              className="text-blue-500"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm'/>
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                'Sign in'
              )}
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}
