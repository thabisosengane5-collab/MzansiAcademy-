import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCS6LZeWX0qmi3O1BN9dD4u8yGVu9N0Fi8",
  authDomain: "edusa-a6efe.firebaseapp.com",
  projectId: "edusa-a6efe",
  storageBucket: "edusa-a6efe.firebasestorage.app",
  messagingSenderId: "104983276558",
  appId: "1:104983276558:web:3a5bf7016666d3e873a2e0",
  databaseURL: "https://edusa-a6efe-default-rtdb.firebaseio.com",
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth    = getAuth(app)
export const rtdb    = getDatabase(app)
export const db      = getFirestore(app)
export const storage = getStorage(app)
