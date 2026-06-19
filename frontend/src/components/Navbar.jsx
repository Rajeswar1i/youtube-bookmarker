import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">YouTube Bookmarker</NavLink>
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>Search</NavLink>
        <NavLink to="/bookmarks" className={({ isActive }) => isActive ? 'active' : ''}>Bookmarks</NavLink>
        <NavLink to="/collections" className={({ isActive }) => isActive ? 'active' : ''}>Collections</NavLink>
      </div>
      <div className="navbar-user">
        {user.photo_url && <img src={user.photo_url} alt={user.display_name} className="avatar" />}
        <span>{user.display_name}</span>
        <button onClick={logout} className="signout-btn">Sign out</button>
      </div>
    </nav>
  )
}

export default Navbar
