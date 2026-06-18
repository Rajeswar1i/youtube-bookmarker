import { useCollections } from '../context/CollectionContext'
import './CollectionModal.css'

function CollectionModal({ video, onClose }) {
  const { collections, addVideoToCollection } = useCollections()

  const handleAdd = async (collectionId) => {
    await addVideoToCollection(collectionId, video)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Add to Collection</h3>
        {collections.length === 0 && (
          <p className="modal-empty">No collections yet. Create one from the Collections page.</p>
        )}
        <ul className="collection-list">
          {collections.map((col) => (
            <li key={col.id} onClick={() => handleAdd(col.id)} className="collection-item">
              <span>{col.name}</span>
              <span className="col-count">{col.videos?.length || 0} videos</span>
            </li>
          ))}
        </ul>
        <button className="modal-close" onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}

export default CollectionModal
