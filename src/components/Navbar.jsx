import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const { user, logOut } = useAuth()

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">YouTube Bookmarker</NavLink>
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>Search</NavLink>
        <NavLink to="/bookmarks" className={({ isActive }) => isActive ? 'active' : ''}>Bookmarks</NavLink>
        <NavLink to="/collections" className={({ isActive }) => isActive ? 'active' : ''}>Collections</NavLink>
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
