
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'; 

const firebaseConfig = {
  apiKey: "AIzaSyCeuXGj3dieUuY8TN43ZOE1ulaIZpBpf04",
  authDomain: "twitter-full-stack-cf08e.firebaseapp.com",
  projectId: "twitter-full-stack-cf08e",
  storageBucket: "twitter-full-stack-cf08e.appspot.com",
  messagingSenderId: "509963546000",
  appId: "1:509963546000:web:bf84529502f7958d671715",
  measurementId: "G-YL7MEQ8YTZ"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
export default auth;