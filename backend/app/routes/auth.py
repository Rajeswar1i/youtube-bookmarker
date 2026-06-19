from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User
from app.schemas.schemas import UserSchema
from app.auth import verify_google_token, create_access_token
import uuid

router = APIRouter()

@router.post("/login")
def login(payload: dict, db: Session = Depends(get_db)):
    token = payload.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Token missing")

    google_user = verify_google_token(token)
    if not google_user:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    user = db.query(User).filter(User.firebase_uid == google_user["sub"]).first()

    if not user:
        user = User(
            id=str(uuid.uuid4()),
            firebase_uid=google_user["sub"],
            email=google_user["email"],
            display_name=google_user.get("name"),
            photo_url=google_user.get("picture")
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token({"sub": user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "display_name": user.display_name,
            "photo_url": user.photo_url
        }
    }
