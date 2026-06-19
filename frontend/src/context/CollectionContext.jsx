import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import api from '../api'

const CollectionContext = createContext()

export function CollectionProvider({ children }) {
  const { user } = useAuth()
  const [collections, setCollections] = useState([])

  useEffect(() => {
    if (user) {
      fetchCollections()
    } else {
      setCollections([])
    }
  }, [user])

  async function fetchCollections() {
    try {
      const response = await api.get('/collections/')
      setCollections(response.data)
    } catch (error) {
      console.error('Failed to fetch collections', error)
    }
  }

  async function createCollection(name) {
    try {
      const response = await api.post('/collections/', { name })
      setCollections((prev) => [...prev, response.data])
    } catch (error) {
      console.error('Failed to create collection', error)
    }
  }

  async function deleteCollection(id) {
    try {
      await api.delete(`/collections/${id}`)
      setCollections((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      console.error('Failed to delete collection', error)
    }
  }

  async function addVideoToCollection(collectionId, video) {
    try {
      await api.post(`/collections/${collectionId}/videos`, {
        video_id: video.video_id || video.id?.videoId,
        title: video.title || video.snippet?.title,
        thumbnail: video.thumbnail || video.snippet?.thumbnails?.medium?.url,
        channel_name: video.channel_name || video.snippet?.channelTitle,
      })
      await fetchCollections()
    } catch (error) {
      console.error('Failed to add video to collection', error)
    }
  }

  async function removeVideoFromCollection(collectionId, videoId) {
    try {
      await api.delete(`/collections/${collectionId}/videos/${videoId}`)
      await fetchCollections()
    } catch (error) {
      console.error('Failed to remove video from collection', error)
    }
  }

  async function shareCollection(collectionId) {
    try {
      const response = await api.post(`/collections/${collectionId}/share`)
      return response.data
    } catch (error) {
      console.error('Failed to share collection', error)
    }
  }

  return (
    <CollectionContext.Provider value={{
      collections,
      createCollection,
      deleteCollection,
      addVideoToCollection,
      removeVideoFromCollection,
      shareCollection
    }}>
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollections() {
  return useContext(CollectionContext)
}
