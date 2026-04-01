import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCS6LZeWX0qmi3O1BN9dD4u8yGVu9N0Fi8",
  authDomain: "edusa-a6efe.firebaseapp.com",
  databaseURL: "https://edusa-a6efe-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "edusa-a6efe",
  storageBucket: "edusa-a6efe.firebasestorage.app",
  messagingSenderId: "104983276558",
  appId: "1:104983276558:web:5e5ef20945b03a2529a05f",
  measurementId: "G-PWY1JLKY4W"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
