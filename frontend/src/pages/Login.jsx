import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const { user, loginWithGoogle } = useAuth()

  if (user) return <Navigate to="/" />

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">▶</div>
        <h1>YouTube Bookmarker</h1>
        <p>Save and organize your favorite YouTube videos</p>
        <div className="google-btn-wrapper">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              loginWithGoogle(credentialResponse.credential)
            }}
            onError={() => console.error('Login failed')}
          />
        </div>
      </div>
    </div>
  )
}

export default Login
