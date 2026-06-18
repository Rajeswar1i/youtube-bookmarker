import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCollections } from '../context/CollectionContext'
import { db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import VideoCard from '../components/VideoCard'
import './CollectionDetail.css'

function CollectionDetail() {
  const { id } = useParams()
  const { collections, removeVideoFromCollection } = useCollections()
  const [search, setSearch] = useState('')
  const [shareLink, setShareLink] = useState(null)
  const [sharing, setSharing] = useState(false)
  const navigate = useNavigate()

  const col = collections.find((c) => c.id === id)

  if (!col) {
    return <div className="collection-detail"><p className="status-msg">Collection not found.</p></div>
  }

  const filtered = (col.videos || []).filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleShare = async () => {
    setSharing(true)
    try {
      const ref = doc(db, 'publicCollections', id)
      await setDoc(ref, {
        name: col.name,
        videos: col.videos || []
      })
      setShareLink(`${window.location.origin}/share/${id}`)
    } catch (err) {
      console.error(err)
    }
    setSharing(false)
  }

  return (
    <div className="collection-detail">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/collections')}>← Back</button>
        <h2>{col.name}</h2>
        <button className="share-btn" onClick={handleShare} disabled={sharing}>
          {sharing ? 'Sharing...' : 'Share Collection'}
        </button>
      </div>

      {shareLink && (
        <div className="share-link-box">
          <span>Shareable link:</span>
          <a href={shareLink} target="_blank" rel="noopener noreferrer">{shareLink}</a>
        </div>
      )}

      <input
        type="text"
        placeholder="Search videos in this collection..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {filtered.length === 0 && (
        <p className="status-msg">
          {col.videos?.length === 0 ? 'No videos in this collection yet.' : 'No videos match your search.'}
        </p>
      )}

      <div className="video-grid">
        {filtered.map((video) => {
          const normalized = {
            videoId: video.videoId,
            snippet: {
              title: video.title,
              channelTitle: video.channelTitle,
              publishedAt: video.publishedAt,
              thumbnails: { medium: { url: video.thumbnail } }
            }
          }
          return (
            <VideoCard key={video.videoId} video={normalized}>
              <button
                className="remove-btn"
                onClick={() => removeVideoFromCollection(id, video.videoId)}
              >
                Remove
              </button>
            </VideoCard>
          )
        })}
      </div>
    </div>
  )
}

export default CollectionDetail
