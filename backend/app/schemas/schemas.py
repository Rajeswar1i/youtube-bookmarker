from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserSchema(BaseModel):
    id: str
    email: str
    display_name: Optional[str]
    photo_url: Optional[str]

    class Config:
        from_attributes = True

class BookmarkCreate(BaseModel):
    video_id: str
    title: str
    thumbnail: str
    channel_name: str
    published_at: str

class BookmarkSchema(BaseModel):
    id: str
    video_id: str
    title: str
    thumbnail: str
    channel_name: str
    published_at: str
    created_at: datetime

    class Config:
        from_attributes = True

class CollectionCreate(BaseModel):
    name: str

class CollectionSchema(BaseModel):
    id: str
    name: str
    created_at: datetime

    class Config:
        from_attributes = True

class CollectionVideoCreate(BaseModel):
    video_id: str
    title: str
    thumbnail: str
    channel_name: str

class CollectionVideoSchema(BaseModel):
    id: str
    video_id: str
    title: str
    thumbnail: str
    channel_name: str
    added_at: datetime

    class Config:
        from_attributes = True

class CollectionDetailSchema(BaseModel):
    id: str
    name: str
    created_at: datetime
    videos: List[CollectionVideoSchema] = []

    class Config:
        from_attributes = True

class PublicCollectionSchema(BaseModel):
    id: str
    name: str
    videos: List[CollectionVideoSchema] = []

    class Config:
        from_attributes = True

class ShareTokenSchema(BaseModel):
    share_token: str
    share_url: str
