import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider, useAuth } from './context/AuthContext'
import { BookmarkProvider } from './context/BookmarkContext'
import { CollectionProvider } from './context/CollectionContext'
import Login from './pages/Login'
import Home from './pages/Home'
import Bookmarks from './pages/Bookmarks'
import Collections from './pages/Collections'
import CollectionDetail from './pages/CollectionDetail'
import SharedCollection from './pages/SharedCollection'
import Navbar from './components/Navbar'
import './pages/Login.css'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  return <><Navbar />{children}</>
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <BookmarkProvider>
            <CollectionProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
                <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
                <Route path="/collections/:id" element={<ProtectedRoute><CollectionDetail /></ProtectedRoute>} />
                <Route path="/share/:id" element={<SharedCollection />} />
              </Routes>
            </CollectionProvider>
          </BookmarkProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
