// ============================================================
// FIREBASE CONFIG — fill this in with YOUR Firebase project keys
// ============================================================
// 1. Go to https://console.firebase.google.com
// 2. Create a free project (e.g. "bayou-flava")
// 3. In the project: Build > Firestore Database > Create database (start in test mode, then lock down later)
// 4. In the project: Build > Authentication > Sign-in method > Enable "Email/Password"
// 5. In the project: Add a Web App (</> icon on project overview page) — it gives you the config object below
// 6. Copy those values here, replacing the placeholders
// See README.md section "Backend Setup" for full step-by-step instructions.

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
