import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // ATENÇÃO: Substitua pelos dados do seu projeto no console do Firebase
  apiKey: "AIzaSyCUAj_1rEZNpdLVbcHdHhAOGzF86MjVH_o",
  authDomain: "kickhub-ea5d2.firebaseapp.com",
  projectId: "kickhub-ea5d2",
  storageBucket: "kickhub-ea5d2.firebasestorage.app",
  messagingSenderId: "578961826966",
  appId: "1:578961826966:web:3c18cfc10b4e24cba3ceb7",
};

// Singleton para evitar múltiplas inicializações no Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { auth };