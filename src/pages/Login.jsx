import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Login() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) navigate('/')
  }, [user])

  const handleSignIn = async () => {
    try {
      setError(null)
      await signIn()
    } catch (err) {
      setError('Sign in failed. Please try again.')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>YouTube Bookmarker</h1>
        <p>Save and organize your favorite YouTube videos</p>
        {error && <p className="error">{error}</p>}
        <button onClick={handleSignIn} className="google-btn">
          Sign in with Google
        </button>
      </div>
    </div>
  )
}

export default Login
