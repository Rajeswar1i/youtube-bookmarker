# YouTube Bookmarker

A web application that allows users to search YouTube videos, bookmark them, organize into collections, and share collections publicly.

## Setup Instructions

1. Clone the repository
2. Install dependencies:

```
npm install
```
3. Create a `.env` file in the root folder:

```
VITE_YOUTUBE_API_KEY=your_youtube_api_key
```
4. Create a Firebase project at console.firebase.google.com
- Enable Google Authentication
- Enable Firestore Database
- Register a web app and copy the config
5. Update `src/firebase.js` with your Firebase config
6. Run the development server:

```
npm run dev
```
7. Open `http://localhost:5173` in your browser

## Features Implemented

- Google OAuth sign in and sign out
- Session persistence across browser refreshes
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

## Tech Stack

- React + Vite (JavaScript)
- Firebase Authentication (Google OAuth)
- Cloud Firestore (database)
- YouTube Data API v3
- React Router v6
- Plain CSS

## Assumptions

- Only authenticated users can bookmark videos or manage collections
- A shared collection is a snapshot at the time of sharing — changes made after sharing require re-sharing to reflect updates
- Videos can only be added to collections from the Bookmarks page
- YouTube API quota is sufficient for development use (10,000 units/day, each search costs 100 units)

## Trade-offs and Limitations

- Search results are limited to 12 videos per query to conserve API quota
- The YouTube API key is exposed on the client side — in production it should be proxied through a backend
- No pagination on search results
- Shared collections are not live/synced — they are copied at share time
- No unit or integration tests due to time constraints

## Features Left Incomplete

- All features from the SRS are implemented




