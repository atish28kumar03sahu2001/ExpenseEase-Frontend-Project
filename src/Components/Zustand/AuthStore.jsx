// src/Components/Zustand/AuthStore.jsx
import { create } from "zustand";
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { app } from "../Database/firebase";
import Cookies from "js-cookie";
export const AuthStore = create ((set) => ({
    userData: {},
    AuthToken: null,
    UserId: null,
    SignUp: async (formData) => {
        const AUTH = getAuth(app);
        try {
            const user = await fetchSignInMethodsForEmail(AUTH, formData.useremail);
            if(user.length > 0) {
                return {userExists: true};
            }
            const res = await createUserWithEmailAndPassword(AUTH, formData.useremail, formData.userpassword);
            return {success: true, user: res.user, mail: res.user.email};
            
        } catch (error) {
            if(error.code === "auth/email-already-in-use") {
                return { userExists: true };
            }
            throw new Error(error.message);
        }
    },
    SignIn: async (formData) => {
        const AUTH = getAuth(app);
        try {
            const res = await signInWithEmailAndPassword(AUTH, formData.useremail, formData.userpassword);
            set(() => ({
                userData: res.user,
                AuthToken: res.user.accessToken,
                UserId: res.user.uid,
            }));
            return {success: true, user: res.user, mail: res.user.email};
        } catch (error) {
            throw new Error("Unauthorized user trying to access");
        }
    },
    ResetPassword: async (email) => {
        const AUTH = getAuth(app);
        try {
            await sendPasswordResetEmail(AUTH, email);
            return { success: true };
        } catch (error) {
            throw new Error(error.message || "Failed to send reset password email");
        }
    },
    GoogleLogInMethod: async () => {
        const AUTH = getAuth(app);
        const Provider = new GoogleAuthProvider();
        try {
            const res = await signInWithPopup(AUTH, Provider);
            set(()=>({
                userData: res.user,
                AuthToken: res.user.accessToken,
                UserId: res.user.uid,
            }))
            return {success: true, user: res.user, mail: res.user.email}
        } catch (error) {
            throw new Error(error.message || "Failed to sign in with Google");
        }

    },
    LogOut: () => {
        const AUTH = getAuth(app);
        try {
            signOut(AUTH);
            Cookies.remove("AuthToken", { path: '/', secure: true, sameSite: 'strict' });
            Cookies.remove("UserId", { path: '/', secure: true, sameSite: 'strict' });
            set(() => ({ userData: {}, AuthToken: null, UserId: null }));
        } catch (error) {
            throw new Error("Failed to log out user");
        }
    }
}))