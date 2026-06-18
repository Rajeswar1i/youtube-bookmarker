import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const { user, logOut } = useAuth()

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">YouTube Bookmarker</Link>
      <div className="navbar-links">
        <Link to="/">Search</Link>
        <Link to="/bookmarks">Bookmarks</Link>
        <Link to="/collections">Collections</Link>
      </div>
      <div className="navbar-user">
        <img src={user.photoURL} alt={user.displayName} className="avatar" />
        <span>{user.displayName}</span>
        <button onClick={logOut} className="signout-btn">Sign out</button>
      </div>
    </nav>
  )
}

export default Navbar
