import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDL-dkerh0PwfBOJvkSHERhzLO7UyTaK_4",
    authDomain: "asg-royalty.firebaseapp.com",
    projectId: "asg-royalty",
    storageBucket: "asg-royalty.firebasestorage.app",
    messagingSenderId: "1058866916845",
    appId: "1:1058866916845:web:946434f1eb17dee7740be4"
};

const app = initializeApp(firebaseConfig);

export default app;
