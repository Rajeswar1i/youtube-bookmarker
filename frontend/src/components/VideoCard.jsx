import './VideoCard.css'

function VideoCard({ video, children }) {
  const { snippet } = video
  const videoId = video.id?.videoId || video.videoId

  const publishedDate = new Date(snippet.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  return (
    <div className="video-card">
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={snippet.thumbnails.medium.url} alt={snippet.title} className="video-thumbnail" />
      </a>
      <div className="video-info">
        <h3 className="video-title"
          dangerouslySetInnerHTML={{ __html: snippet.title }}/>
        <p className="video-channel">{snippet.channelTitle}</p>
        <p className="video-date">{publishedDate}</p>
        <div className="video-actions">
          {children}
        </div>
      </div>
    </div>
  )
}

export default VideoCard
