import { useState } from 'react'
import { useCollections } from '../context/CollectionContext'
import { useNavigate } from 'react-router-dom'
import './Collections.css'

function Collections() {
  const { collections, createCollection, deleteCollection } = useCollections()
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    await createCollection(newName.trim())
    setNewName('')
    setCreating(false)
  }

  return (
    <div className="collections">
      <h2>My Collections</h2>
      <p className="collections-subtitle">Organize your bookmarked videos into collections.</p>

      <div className="create-collection">
        <input
          type="text"
          placeholder="New collection name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          className="collection-input"
        />
        <button onClick={handleCreate} disabled={creating} className="create-btn">
          {creating ? 'Creating...' : '+ Create'}
        </button>
      </div>

      {collections.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '48px' }}>📁</div>
          <p>No collections yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="collections-grid">
          {collections.map((col) => (
            <div key={col.id} className="collection-card">
              <div className="collection-info" onClick={() => navigate(`/collections/${col.id}`)}>
                <div className="collection-icon">🎬</div>
                <h3>{col.name}</h3>
                <p>{col.videos?.length || 0} videos</p>
              </div>
              <button className="delete-btn" onClick={() => deleteCollection(col.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Collections
