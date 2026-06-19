import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import VideoCard from '../components/VideoCard'
import './SharedCollection.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function SharedCollection() {
  const { id } = useParams()
  const [collection, setCollection] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`${API_URL}/collections/share/${id}`)
      .then((res) => {
        setCollection(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Collection not found or no longer available.')
        setLoading(false)
      })
  }, [id])

  if (loading) return <div className="shared-loading">Loading...</div>
  if (error) return <div className="shared-error">{error}</div>

  return (
    <div className="shared-collection">
      <div className="shared-header">
        <h1>{collection.name}</h1>
        <p>{collection.videos.length} videos</p>
      </div>
      <div className="video-grid">
        {collection.videos.map((video) => (
          <VideoCard key={video.id} video={{
            id: { videoId: video.video_id },
            snippet: {
              title: video.title,
              thumbnails: { medium: { url: video.thumbnail } },
              channelTitle: video.channel_name,
              publishedAt: video.added_at
            }
          }} />
        ))}
      </div>
    </div>
  )
}

export default SharedCollection
