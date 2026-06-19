from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, bookmarks, collections
from dotenv import load_dotenv
import os

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="YouTube Bookmarker API")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(bookmarks.router, prefix="/bookmarks", tags=["bookmarks"])
app.include_router(collections.router, prefix="/collections", tags=["collections"])

@app.get("/")
def root():
    return {"message": "YouTube Bookmarker API is running"}
