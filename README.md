# YouTube Bookmarker

A full-stack web application that allows users to search YouTube videos, bookmark them, organize into collections, and share collections publicly.

**Live Demo:** https://youtube-bookmarker-1.onrender.com

## Project Structure

```
youtube-bookmarker/
  frontend/   → React + Vite app
  backend/    → FastAPI + PostgreSQL API
```

## Tech Stack

### Frontend
- React + Vite (JavaScript)
- React Router v6
- Google OAuth via @react-oauth/google
- Axios for API calls
- Plain CSS

### Backend
- FastAPI (Python)
- PostgreSQL (database)
- SQLAlchemy (ORM)
- python-jose (JWT tokens)
- google-auth (Google OAuth verification)

### Deployment
- Frontend → Render Static Site
- Backend → Render Web Service
- Database → Render PostgreSQL

## Features

- Google OAuth sign in and sign out
- Session persistence via JWT tokens
- YouTube video search with debouncing (500ms)
- Search results display thumbnail, title, channel name, and published date
- Bookmark and unbookmark videos
- View all bookmarked videos
- Create and delete collections
- Add bookmarked videos to collections
- Remove videos from collections
- Generate a shareable public link for any collection
- Anonymous users can view shared collections but cannot modify them
- Search videos within a collection by title
- Responsive design for desktop and mobile

## Local Setup

### Prerequisites
- Node.js
- Python 3.10+
- Docker (for PostgreSQL)

### Backend Setup

1. Start PostgreSQL with Docker:
```bash
docker run --name youtube-bookmarker-db -e POSTGRES_PASSWORD=postgres123 -e POSTGRES_DB=youtube_bookmarker -p 5432:5432 -d postgres
```

2. Create and activate virtual environment:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `backend/.env`:
```
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/youtube_bookmarker
GOOGLE_CLIENT_ID=your_google_client_id
SECRET_KEY=your_secret_key
FRONTEND_URL=http://localhost:5173
```

5. Run the backend:
```bash
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `frontend/.env`:
```
VITE_YOUTUBE_API_KEY=your_youtube_api_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:8000
```

3. Run the frontend:
```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /auth/login | Google OAuth login | No |
| GET | /bookmarks/ | Get all bookmarks | Yes |
| POST | /bookmarks/ | Add bookmark | Yes |
| DELETE | /bookmarks/{video_id} | Remove bookmark | Yes |
| GET | /collections/ | Get all collections | Yes |
| POST | /collections/ | Create collection | Yes |
| DELETE | /collections/{id} | Delete collection | Yes |
| POST | /collections/{id}/videos | Add video to collection | Yes |
| DELETE | /collections/{id}/videos/{video_id} | Remove video | Yes |
| POST | /collections/{id}/share | Generate share link | Yes |
| GET | /collections/share/{token} | Get shared collection | No |

## Assumptions

- Only authenticated users can bookmark videos or manage collections
- Videos can only be added to collections from the Bookmarks page
- YouTube API quota is sufficient for development use (10,000 units/day, each search costs 100 units)

## Trade-offs and Limitations

- Search results are limited to 24 videos per query to conserve API quota
- The YouTube API key is exposed on the client side — in production it should be proxied through the backend
- No pagination on search results
- Render free tier backend sleeps after 15 minutes of inactivity — first request after sleep takes ~30 seconds
- Render free PostgreSQL expires after 90 days
