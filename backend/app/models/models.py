from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    firebase_uid = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    display_name = Column(String)
    photo_url = Column(String)
    created_at = Column(DateTime, server_default=func.now())

    bookmarks = relationship("Bookmark", back_populates="user", cascade="all, delete")
    collections = relationship("Collection", back_populates="user", cascade="all, delete")


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    video_id = Column(String, nullable=False)
    title = Column(Text)
    thumbnail = Column(String)
    channel_name = Column(String)
    published_at = Column(String)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="bookmarks")


class Collection(Base):
    __tablename__ = "collections"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="collections")
    videos = relationship("CollectionVideo", back_populates="collection", cascade="all, delete")
    public_collection = relationship("PublicCollection", back_populates="collection", cascade="all, delete")


class CollectionVideo(Base):
    __tablename__ = "collection_videos"

    id = Column(String, primary_key=True, default=generate_uuid)
    collection_id = Column(String, ForeignKey("collections.id"), nullable=False)
    video_id = Column(String, nullable=False)
    title = Column(Text)
    thumbnail = Column(String)
    channel_name = Column(String)
    added_at = Column(DateTime, server_default=func.now())

    collection = relationship("Collection", back_populates="videos")


class PublicCollection(Base):
    __tablename__ = "public_collections"

    id = Column(String, primary_key=True, default=generate_uuid)
    collection_id = Column(String, ForeignKey("collections.id"), nullable=False)
    share_token = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    collection = relationship("Collection", back_populates="public_collection")
