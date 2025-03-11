//src/Components/Zustand/ProfileStore.jsx

import { create } from "zustand";
import { app } from "../Database/firebase";
import { getDatabase, ref, update, get } from "firebase/database";
import Cookies from "js-cookie";
import { getAuth, onAuthStateChanged, sendEmailVerification } from "firebase/auth";

export const ProfileStore = create(() => ({
    userData: {},
    AddUserProfile: async (formData) => {
        try {
            const auth = getAuth(app);
            await auth.currentUser?.reload();
    
            await new Promise((resolve) => {
                const unsubscribe = auth.onAuthStateChanged((user) => {
                    if (user) resolve(user);
                });
                setTimeout(() => {
                    unsubscribe();
                    resolve(null);
                }, 2000);
            });
    
            const user = auth.currentUser;
            if (!user) throw new Error("User is not authenticated.");
    
            const userId = Cookies.get("UserId");
            if (!userId) throw new Error("User ID not found in cookies.");
    
            if (user.uid !== userId) {
                throw new Error("Authenticated user does not match the user ID in cookies.");
            }
    
            const db = getDatabase(app);
            const userProfileRef = ref(db, `Expense/${userId}/Profile`);
    
            const snapshot = await get(userProfileRef);
            const existingData = snapshot.exists() ? snapshot.val() : {};

            console.log("FormData: ",formData);
            console.log("ExistingData",existingData);
    
            const updatedData = {
                useremail: formData.useremail || existingData.useremail || "",
                username: formData.username || existingData.username || "",
                userphone: formData.userphone || existingData.userphone || "",
                userimage: formData.userimage || existingData.userimage || "",
            };
            if (!formData.userimage) {
                updatedData.userimage = existingData.userimage;
            }
            console.log(updatedData);
    
            await update(userProfileRef, updatedData);
    
            return "User profile updated successfully!";
        } catch (error) {
            console.error("Error adding user profile data:", error);
            throw error;
        }
    },    
    
    GetUserProfile: async(userId) => {
        try {
            const db = getDatabase(app);
            const userProfileRef = ref(db, `Expense/${userId}/Profile`);

            const snapshot = await get(userProfileRef);
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                return {};
            }
        } catch (error) {
            console.error("Error fetching user profile data:", error);
            throw error;
        }
    },

    VerifyUserEmail: async () => {
        const AUTH = getAuth(app);
    
        const user = await new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(AUTH, (user) => {
                unsubscribe();
                resolve(user);
            });

            setTimeout(() => {
                unsubscribe();
                resolve(null);
            }, 2000);
        });
    
        if (!user) {
            console.log("No authenticated user found.");
            return { success: false, message: "No authenticated user" };
        }
    
        await user.reload();
    
        try {
            if (user.emailVerified) {
                return { success: true, message: "Email Already Verified" };
            } else {
                await sendEmailVerification(user);
                return { success: true, message: "Email Verification Mail Sent To The User" };
            }
        } catch (error) {
            return { success: false, message: `Error Sending Mail Verification: ${error.message}` };
        }
    },
    
}));