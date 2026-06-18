import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAjTyNRncATt2gPtJsr5vBbABeC1WHuLuI",
  authDomain: "bookmaraker.firebaseapp.com",
  projectId: "bookmaraker",
  storageBucket: "bookmaraker.firebasestorage.app",
  messagingSenderId: "495042637301",
  appId: "1:495042637301:web:b67c4a84c10ea4a8dc04bc"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
