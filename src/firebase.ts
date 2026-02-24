import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Secondary app just for account creation to avoid signing out the current admin
const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
const secondaryAuth = getAuth(secondaryApp);

export const createSecondaryUser = async (email: string, password: string) => {
    const { createUserWithEmailAndPassword } = await import("firebase/auth");

    try {
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
        // We log them right out of the secondary app after creating them 
        await secondaryAuth.signOut();
        return { success: true, user: userCredential.user };
    } catch (error: any) {
        return { success: false, message: error.message, code: error.code };
    }
};

export default app;
