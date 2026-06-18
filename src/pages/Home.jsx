import { useState } from 'react'
import useYouTubeSearch from '../hooks/useYouTubeSearch'
import VideoCard from '../components/VideoCard'
import BookmarkButton from '../components/BookmarkButton'
import './Home.css'

function Home() {
  const [query, setQuery] = useState('')
  const { results, loading, error } = useYouTubeSearch(query)

  return (
    <div className="home">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search YouTube videos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <p className="status-msg">Searching...</p>}
      {error && <p className="status-msg error">{error}</p>}
      {!loading && !error && results.length === 0 && query.trim() && (
        <p className="status-msg">No results found.</p>
      )}
      {!query.trim() && (
        <p className="status-msg">Type something to search YouTube videos.</p>
      )}

      <div className="video-grid">
        {results.map((video) => (
          <VideoCard key={video.id.videoId} video={video}>
            <BookmarkButton video={video} />
          </VideoCard>
        ))}
      </div>
    </div>
  )
}

export default Home
