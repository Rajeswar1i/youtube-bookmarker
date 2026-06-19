from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Collection, CollectionVideo, PublicCollection, User
from app.schemas.schemas import CollectionCreate, CollectionSchema, CollectionVideoCreate, CollectionDetailSchema, PublicCollectionSchema, ShareTokenSchema
from app.auth import verify_access_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
import uuid
import os

router = APIRouter()
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/", response_model=List[CollectionDetailSchema])
def get_collections(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Collection).filter(Collection.user_id == current_user.id).all()

@router.post("/", response_model=CollectionSchema)
def create_collection(collection: CollectionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_collection = Collection(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        name=collection.name
    )
    db.add(new_collection)
    db.commit()
    db.refresh(new_collection)
    return new_collection

@router.delete("/{collection_id}")
def delete_collection(collection_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    collection = db.query(Collection).filter(
        Collection.id == collection_id,
        Collection.user_id == current_user.id
    ).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    db.delete(collection)
    db.commit()
    return {"message": "Collection deleted"}

@router.post("/{collection_id}/videos")
def add_video(collection_id: str, video: CollectionVideoCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    collection = db.query(Collection).filter(
        Collection.id == collection_id,
        Collection.user_id == current_user.id
    ).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    existing = db.query(CollectionVideo).filter(
        CollectionVideo.collection_id == collection_id,
        CollectionVideo.video_id == video.video_id
    ).first()
    if existing:
        return {"message": "Video already in collection"}

    new_video = CollectionVideo(
        id=str(uuid.uuid4()),
        collection_id=collection_id,
        video_id=video.video_id,
        title=video.title,
        thumbnail=video.thumbnail,
        channel_name=video.channel_name
    )
    db.add(new_video)
    db.commit()
    return {"message": "Video added"}

@router.delete("/{collection_id}/videos/{video_id}")
def remove_video(collection_id: str, video_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    video = db.query(CollectionVideo).filter(
        CollectionVideo.collection_id == collection_id,
        CollectionVideo.video_id == video_id
    ).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    db.delete(video)
    db.commit()
    return {"message": "Video removed"}

@router.post("/{collection_id}/share", response_model=ShareTokenSchema)
def share_collection(collection_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    collection = db.query(Collection).filter(
        Collection.id == collection_id,
        Collection.user_id == current_user.id
    ).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    existing = db.query(PublicCollection).filter(
        PublicCollection.collection_id == collection_id
    ).first()
    if existing:
        base_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        return {"share_token": existing.share_token, "share_url": f"{base_url}/share/{existing.share_token}"}

    share_token = str(uuid.uuid4())
    public = PublicCollection(
        id=str(uuid.uuid4()),
        collection_id=collection_id,
        share_token=share_token
    )
    db.add(public)
    db.commit()

    base_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    return {"share_token": share_token, "share_url": f"{base_url}/share/{share_token}"}

@router.get("/share/{share_token}", response_model=PublicCollectionSchema)
def get_shared_collection(share_token: str, db: Session = Depends(get_db)):
    public = db.query(PublicCollection).filter(
        PublicCollection.share_token == share_token
    ).first()
    if not public:
        raise HTTPException(status_code=404, detail="Shared collection not found")

    collection = public.collection
    return {
        "id": collection.id,
        "name": collection.name,
        "videos": collection.videos
    }
