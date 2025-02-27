import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDrZ9no9aEuVwHn48JqIqpvhp6IITSUYwk",
  authDomain: "pdf-speek-pro.firebaseapp.com",
  projectId: "pdf-speek-pro",
  storageBucket: "pdf-speek-pro.firebasestorage.app",
  messagingSenderId: "658319965283",
  appId: "1:658319965283:web:84b8b29472092915e80c56",
  measurementId: "G-BGMQMJGBW9",
};

//initalize the app only if it is not initally initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
// const storage = getStorage(app);

export { db };
