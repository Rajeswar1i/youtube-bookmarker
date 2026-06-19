from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Bookmark, User
from app.schemas.schemas import BookmarkCreate, BookmarkSchema
from app.auth import verify_access_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
import uuid

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

@router.get("/", response_model=List[BookmarkSchema])
def get_bookmarks(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Bookmark).filter(Bookmark.user_id == current_user.id).all()

@router.post("/", response_model=BookmarkSchema)
def add_bookmark(bookmark: BookmarkCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.video_id == bookmark.video_id
    ).first()
    if existing:
        return existing

    new_bookmark = Bookmark(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        video_id=bookmark.video_id,
        title=bookmark.title,
        thumbnail=bookmark.thumbnail,
        channel_name=bookmark.channel_name,
        published_at=bookmark.published_at
    )
    db.add(new_bookmark)
    db.commit()
    db.refresh(new_bookmark)
    return new_bookmark

@router.delete("/{video_id}")
def remove_bookmark(video_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bookmark = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.video_id == video_id
    ).first()
    if not bookmark:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    db.delete(bookmark)
    db.commit()
    return {"message": "Bookmark removed"}
