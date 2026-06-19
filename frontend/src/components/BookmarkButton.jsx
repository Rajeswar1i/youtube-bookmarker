import { useBookmarks } from '../context/BookmarkContext'
import './BookmarkButton.css'

function BookmarkButton({ video }) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks()
  const videoId = video.id?.videoId || video.videoId
  const bookmarked = isBookmarked(videoId)

  const handleClick = async () => {
    if (bookmarked) {
      await removeBookmark(videoId)
    } else {
      await addBookmark(video)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
    >
      {bookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  )
}

export default BookmarkButton
