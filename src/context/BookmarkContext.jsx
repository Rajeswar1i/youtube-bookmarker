import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../firebase'
import {
  collection, doc, setDoc, deleteDoc,
  onSnapshot, serverTimestamp
} from 'firebase/firestore'
import { useAuth } from './AuthContext'

const BookmarkContext = createContext()

export function BookmarkProvider({ children }) {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState([])

  useEffect(() => {
    if (!user) return
    const ref = collection(db, 'users', user.uid, 'bookmarks')
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data())
      setBookmarks(data)
    })
    return unsubscribe
  }, [user])

  const addBookmark = (video) => {
    const videoId = video.id?.videoId || video.videoId
    const ref = doc(db, 'users', user.uid, 'bookmarks', videoId)
    return setDoc(ref, {
      videoId,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      thumbnail: video.snippet.thumbnails.medium.url,
      addedAt: serverTimestamp()
    })
  }

  const removeBookmark = (videoId) => {
    const ref = doc(db, 'users', user.uid, 'bookmarks', videoId)
    return deleteDoc(ref)
  }

  const isBookmarked = (videoId) => {
    return bookmarks.some((b) => b.videoId === videoId)
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
