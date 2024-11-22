// import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "@react-native-firebase/auth";



// const firebaseConfig = {
//     apiKey: "AIzaSyCD5ln0kXYBQ2DTXb8lXIV2HY_MyvdN1cE",
//     authDomain: "employeeregistration-2e7ae.firebaseapp.com",
//     projectId: "employeeregistration-2e7ae",
//     storageBucket: "employeeregistration-2e7ae.appspot.com",
//     messagingSenderId: "462175693124",
//     appId: "1:462175693124:web:5b15982d0e6016ff54cf11",
//     measurementId: "G-REN7MTEGXL"
//   };


// export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);

// app/config/firebaseConfig.js
// import { initializeApp } from 'firebase/app';
// import auth from 'firebase/auth';

// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyAlkY5BQ_Kzqzj3l6IHiL-CArmXjxU-CZc",
//     authDomain: "voicerecordingauth.firebaseapp.com",
//     projectId: "voicerecordingauth",
//     storageBucket: "voicerecordingauth.firebasestorage.app",
//     messagingSenderId: "954305334059",
//     appId: "1:954305334059:web:ded71a971edc4d8672d36e",
//     measurementId: "G-DK39747SE0"
    
//   };

// // Initialize Firebase
// export const app= initializeApp(firebaseConfig);

// export { auth };


// app/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// import { getAuth } from "firebase/auth";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth'; 
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
        apiKey: "AIzaSyAlkY5BQ_Kzqzj3l6IHiL-CArmXjxU-CZc",
        authDomain: "voicerecordingauth.firebaseapp.com",
        projectId: "voicerecordingauth",
        storageBucket: "voicerecordingauth.firebasestorage.app",
        messagingSenderId: "954305334059",
        appId: "1:954305334059:web:ded71a971edc4d8672d36e",
        measurementId: "G-DK39747SE0"
        
      };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
const db = getFirestore(app);
const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

export { db,auth };

