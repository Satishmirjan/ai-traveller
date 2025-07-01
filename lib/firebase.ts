import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAtLW-ayfQzbDXbc7BAbT_jNJqGasVO6KY",
  authDomain: "aitrip-8399b.firebaseapp.com",
  projectId: "aitrip-8399b",
  storageBucket: "aitrip-8399b.firebasestorage.app",
  messagingSenderId: "1057059490317",
  appId: "1:1057059490317:web:336cbcc3ecb3d1ea502344",
  measurementId: "G-JYFWTLLB9D",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
