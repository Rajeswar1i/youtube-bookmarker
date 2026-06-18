import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import VideoCard from '../components/VideoCard'
import './SharedCollection.css'

function SharedCollection() {
  const { id } = useParams()
  const [col, setCol] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const ref = doc(db, 'publicCollections', id)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          setError('Collection not found or not shared.')
        } else {
          setCol(snap.data())
        }
      } catch (err) {
        setError('Failed to load collection.')
      } finally {
        setLoading(false)
      }
    }
    fetchCollection()
  }, [id])

  if (loading) return <div className="shared"><p className="status-msg">Loading...</p></div>
  if (error) return <div className="shared"><p className="status-msg error">{error}</p></div>

  const filtered = (col.videos || []).filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="shared">
      <div className="shared-header">
        <h2>{col.name}</h2>
        <p className="shared-label">Public Collection · {col.videos?.length || 0} videos</p>
      </div>

      <input
        type="text"
        placeholder="Search videos in this collection..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {filtered.length === 0 && (
        <p className="status-msg">No videos match your search.</p>
      )}

      <div className="video-grid">
        {filtered.map((video) => (
          <VideoCard key={video.videoId} video={{
            videoId: video.videoId,
            snippet: {
              title: video.title,
              channelTitle: video.channelTitle,
              publishedAt: video.publishedAt,
              thumbnails: { medium: { url: video.thumbnail } }
            }
          }} />
        ))}
      </div>
    </div>
  )
}

export default SharedCollection
