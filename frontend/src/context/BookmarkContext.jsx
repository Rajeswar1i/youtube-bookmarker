import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import api from '../api'

const BookmarkContext = createContext()

export function BookmarkProvider({ children }) {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState([])

  useEffect(() => {
    if (user) {
      fetchBookmarks()
    } else {
      setBookmarks([])
    }
  }, [user])

  async function fetchBookmarks() {
    try {
      const response = await api.get('/bookmarks/')
      setBookmarks(response.data)
    } catch (error) {
      console.error('Failed to fetch bookmarks', error)
    }
  }

  async function addBookmark(video) {
    try {
      const response = await api.post('/bookmarks/', {
        video_id: video.id.videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.medium.url,
        channel_name: video.snippet.channelTitle,
        published_at: video.snippet.publishedAt,
      })
      setBookmarks((prev) => [...prev, response.data])
    } catch (error) {
      console.error('Failed to add bookmark', error)
    }
  }

  async function removeBookmark(videoId) {
    try {
      await api.delete(`/bookmarks/${videoId}`)
      setBookmarks((prev) => prev.filter((b) => b.video_id !== videoId))
    } catch (error) {
      console.error('Failed to remove bookmark', error)
    }
  }

  function isBookmarked(videoId) {
    return bookmarks.some((b) => b.video_id === videoId)
  }

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  )
}

export function useBookmarks() {
  return useContext(BookmarkContext)
}
