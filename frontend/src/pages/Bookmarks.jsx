import { useState } from 'react'
import { useBookmarks } from '../context/BookmarkContext'
import VideoCard from '../components/VideoCard'
import BookmarkButton from '../components/BookmarkButton'
import CollectionModal from '../components/CollectionModal'
import './Bookmarks.css'

function Bookmarks() {
  const { bookmarks } = useBookmarks()
  const [selectedVideo, setSelectedVideo] = useState(null)

  if (bookmarks.length === 0) {
    return (
      <div className="bookmarks">
        <h2>My Bookmarks</h2>
        <p className="status-msg">No bookmarks yet. Search for videos and bookmark them.</p>
      </div>
    )
  }

  return (
    <div className="bookmarks">
      <h2>My Bookmarks ({bookmarks.length})</h2>
      <div className="video-grid">
        {bookmarks.map((video) => {
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
              <BookmarkButton video={normalized} />
              <button
                className="add-collection-btn"
                onClick={() => setSelectedVideo(video)}
              >
                + Collection
              </button>
            </VideoCard>
          )
        })}
      </div>
      {selectedVideo && (
        <CollectionModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  )
}

export default Bookmarks
