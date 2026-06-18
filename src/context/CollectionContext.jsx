import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../firebase'
import {
  collection, doc, addDoc, deleteDoc, updateDoc,
  onSnapshot, arrayUnion, arrayRemove, serverTimestamp
} from 'firebase/firestore'
import { useAuth } from './AuthContext'

const CollectionContext = createContext()

export function CollectionProvider({ children }) {
  const { user } = useAuth()
  const [collections, setCollections] = useState([])

  useEffect(() => {
    if (!user) return
    const ref = collection(db, 'users', user.uid, 'collections')
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      setCollections(data)
    })
    return unsubscribe
  }, [user])

  const createCollection = (name) => {
    const ref = collection(db, 'users', user.uid, 'collections')
    return addDoc(ref, { name, videos: [], createdAt: serverTimestamp() })
  }

  const deleteCollection = (collectionId) => {
    const ref = doc(db, 'users', user.uid, 'collections', collectionId)
    return deleteDoc(ref)
  }

  const addVideoToCollection = (collectionId, video) => {
    const ref = doc(db, 'users', user.uid, 'collections', collectionId)
    const videoData = {
      videoId: video.videoId || video.id?.videoId,
      title: video.snippet?.title || video.title,
      channelTitle: video.snippet?.channelTitle || video.channelTitle,
      publishedAt: video.snippet?.publishedAt || video.publishedAt,
      thumbnail: video.snippet?.thumbnails?.medium?.url || video.thumbnail
    }
    return updateDoc(ref, { videos: arrayUnion(videoData) })
  }

  const removeVideoFromCollection = (collectionId, videoId) => {
    const ref = doc(db, 'users', user.uid, 'collections', collectionId)
    const col = collections.find((c) => c.id === collectionId)
    const video = col?.videos.find((v) => v.videoId === videoId)
    if (!video) return
    return updateDoc(ref, { videos: arrayRemove(video) })
  }

  return (
    <CollectionContext.Provider value={{
      collections,
      createCollection,
      deleteCollection,
      addVideoToCollection,
      removeVideoFromCollection
    }}>
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollections() {
  return useContext(CollectionContext)
}
