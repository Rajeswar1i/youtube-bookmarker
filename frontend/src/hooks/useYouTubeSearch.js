import { useState, useEffect } from 'react'

function useYouTubeSearch(query) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(query)}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
        )
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setResults(data.items || [])
      } catch (err) {
        setError('Something went wrong. Please try again.')
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  return { results, loading, error }
}

export default useYouTubeSearch
