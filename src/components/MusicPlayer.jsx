import { useState } from 'react'
//create an .env file with VITE_YOUTUBE_API_KEY=insertAPI
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

function getPlaylistId(value) {
  const trimmed = value.trim()
  if (!trimmed) return ''

  try {
    const url = new URL(trimmed)
    return url.searchParams.get('list') || trimmed
  } catch {
    return trimmed
  }
}

function parseYouTubeInput(value) {
  const trimmed = value.trim()
  if (!trimmed) return { type: 'none' }

  try {
    const url = new URL(trimmed)
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.slice(1)
      return id ? { type: 'video', id } : { type: 'none' }
    }
    const videoId = url.searchParams.get('v')
    const listId = url.searchParams.get('list')
    if (listId) {
      return { type: 'playlist', id: listId }
    } else if (videoId) {
      return { type: 'video', id: videoId }
    } else if (url.pathname.startsWith('/embed/')) {
      const id = url.pathname.split('/')[2]
      return id ? { type: 'video', id } : { type: 'none' }
    } else if (url.pathname.startsWith('/v/')) {
      const id = url.pathname.split('/')[2]
      return id ? { type: 'video', id } : { type: 'none' }
    } else {
      return { type: 'none' }
    }
  } catch {
    return { type: 'video', id: trimmed }
  }
}

export default function MusicPlayer() {
  const [playlistInput, setPlaylistInput] = useState('')
  const [playlistId, setPlaylistId] = useState('')
  const [videoId, setVideoId] = useState('')
  const [playlistTitle, setPlaylistTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadMedia() {
    const parsed = parseYouTubeInput(playlistInput)
    if (parsed.type === 'none') {
      setError('Enter a Youtube Video or Playlist ID or URL.')
      return
    }

    if (!YOUTUBE_API_KEY) {
      setError('Missing YouTube API key. Set VITE_YOUTUBE_API_KEY in .env.')
      return
    }

    setError('')
    setLoading(true)
    setVideoId('')
    setPlaylistId('')
    setPlaylistTitle('')

    try {
      if (parsed.type === 'playlist') {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${encodeURIComponent(parsed.id)}&key=${YOUTUBE_API_KEY}`
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error?.message || 'YouTube API request failed.')
        }

        if (!data.items || data.items.length === 0) {
          throw new Error('Playlist empty or invalid.')
        }

        const firstItem = data.items[0]
        const video = firstItem.snippet?.resourceId?.videoId
        const title = firstItem.snippet?.title || ''

        if (!video) {
          throw new Error('Unable to load playlist video.')
        }

        let playlistName = ''
        try {
          const playlistResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${encodeURIComponent(parsed.id)}&key=${YOUTUBE_API_KEY}`
          )
          const playlistData = await playlistResponse.json()
          if (playlistResponse.ok && playlistData.items?.length > 0) {
            playlistName = playlistData.items[0].snippet?.title || ''
          }
        } catch {
          playlistName = ''
        }

        setPlaylistId(parsed.id)
        setVideoId(video)
        setPlaylistTitle(playlistName || title)
      } else if (parsed.type === 'video') {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${encodeURIComponent(parsed.id)}&key=${YOUTUBE_API_KEY}`
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error?.message || 'YouTube API request failed.')
        }

        if (!data.items || data.items.length === 0) {
          throw new Error('Video not found or invalid.')
        }

        const videoItem = data.items[0]
        const title = videoItem.snippet?.title || ''

        setVideoId(parsed.id)
        setPlaylistTitle(title)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load media.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel music-panel">
      <h2>🎵 Music Player</h2>
      <div className="music-input-row">
        <input
          type="text"
          placeholder="Add YouTube video or playlist ID or URL"
          value={playlistInput}
          onChange={e => setPlaylistInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && loadMedia()}
        />
        <button onClick={loadMedia} disabled={loading}>
          {loading ? 'Loading...' : 'Load'}
        </button>
      </div>
      {error && <p className="music-error">{error}</p>}
      {videoId && (
        <div className="music-player">
          <iframe
            width="100%"
            height="200"
            src={`https://www.youtube.com/embed/${videoId}${playlistId ? `?list=${encodeURIComponent(playlistId)}` : ''}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      {playlistTitle && <p className="music-title">Playing: {playlistTitle}</p>}
    </div>
  )
}
