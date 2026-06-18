import { useState } from 'react'
import useYouTubeSearch from '../hooks/useYouTubeSearch'
import VideoCard from '../components/VideoCard'
import BookmarkButton from '../components/BookmarkButton'
import { useBookmarks } from '../context/BookmarkContext'
import { useCollections } from '../context/CollectionContext'
import './Home.css'

function Home() {
  const [query, setQuery] = useState('')
  const { results, loading, error } = useYouTubeSearch(query)
  const { bookmarks } = useBookmarks()
  const { collections } = useCollections()

  return (
    <div className="home">
      <div className="hero">
        <h1 className="hero-title">
          Discover & <span>Bookmark</span> Videos
        </h1>
        <p className="hero-subtitle">
          Search YouTube, save your favorites, and organize them into collections.
        </p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search YouTube videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">&#128269;</span>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <strong>{bookmarks.length}</strong>
            <span>Bookmarks</span>
          </div>
          <div className="hero-stat">
            <strong>{collections.length}</strong>
            <span>Collections</span>
          </div>
          <div className="hero-stat">
            <strong>{collections.reduce((acc, c) => acc + (c.videos?.length || 0), 0)}</strong>
            <span>Videos saved</span>
          </div>
        </div>
      </div>

      <div className="home-content">
        {loading && <div className="spinner-wrapper"><div className="spinner"></div></div>}
        {error && <p className="status-msg error">{error}</p>}
        {!loading && !error && results.length === 0 && query.trim() && (
          <p className="status-msg">No results found.</p>
        )}

        {!query.trim() && !loading && (
          <div className="features-section">
            <h2 className="features-title">Everything you need to manage videos</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3>Search Videos</h3>
                <p>Search millions of YouTube videos instantly and find exactly what you're looking for.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔖</div>
                <h3>Bookmark</h3>
                <p>Save videos with one click and access them anytime from your personal bookmark list.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📁</div>
                <h3>Collections</h3>
                <p>Organize your bookmarked videos into collections for easy browsing and management.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔗</div>
                <h3>Share</h3>
                <p>Generate a public shareable link for any collection and share it with anyone.</p>
              </div>
            </div>
          </div>
        )}

        <div className="video-grid">
          {results.map((video) => (
            <VideoCard key={video.id.videoId} video={video}>
              <BookmarkButton video={video} />
            </VideoCard>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
