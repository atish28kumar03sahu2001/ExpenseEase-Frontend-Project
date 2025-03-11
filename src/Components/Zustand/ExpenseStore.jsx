// src/Components/Zustand/ExpenseStore.jsx
import { create } from "zustand";
import { app } from "../Database/firebase";
import { getDatabase, ref, push, update as FirebaseUpdate, get as FirebaseGet, remove as FirebaseRemove } from "firebase/database";
import Cookies from "js-cookie";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const ExpenseStore = create((set) => ({
    ExpenseData: [],    
    GetDocument: async () => {
        try {
            const auth = getAuth(app);
            await auth.currentUser?.reload();
    
            const user = await new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    unsubscribe();
                    resolve(user);
                });
                setTimeout(() => {
                    unsubscribe();
                    resolve(null);
                }, 2000);
            });
    
            if (!user) {
                console.error("User is not authenticated.");
                return { success: false, message: "User is not authenticated" };
            }
    
            const userId = Cookies.get("UserId");
            if (!userId) throw new Error("User ID not found in cookies.");
    
            const db = getDatabase();
            const expenseRef = ref(db, `Expense/${userId}/ExpenseData`);
            const profileRef = ref(db, `Expense/${userId}/Profile`);

            const expenseSnapshot = await FirebaseGet(expenseRef);
            let ExpenseData = [];
            if (expenseSnapshot.exists()) {
                ExpenseData = Object.keys(expenseSnapshot.val()).map((key) => ({
                    id: key,
                    ...expenseSnapshot.val()[key],
                }));
            }
    
            const profileSnapshot = await FirebaseGet(profileRef);
            let userProfile = profileSnapshot.exists() ? profileSnapshot.val() : {};
            const username = userProfile.username || "N/A";
            const userphone = userProfile.userphone || "N/A";
            const userimage = userProfile.userimage || "";

            const totalExpense = ExpenseData.reduce( (total, expense) => total + parseInt(expense.EXPPRICE || 0), 0 );
    
            // Create PDF
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text("ExpenseEase Document", 105, 15, null, null, "center");
    
            doc.setFontSize(12);
            doc.text(`Name: ${username}`, 15, 30);
            doc.text(`Email: ${user.email || "N/A"}`, 15, 40);
            doc.text(`Phone: ${userphone}`, 15, 50);
    
            if (userimage && /^data:image\/(png|jpeg|jpg);base64,/.test(userimage)) {
                doc.addImage(userimage, "JPEG", 160, 25, 30, 30);
            } else {
                console.warn("Invalid or missing profile image.");
            }
    
            autoTable(doc, {
                startY: 60,
                head: [["ID", "Name", "Category", "Price", "Date", "Details"]],
                body: ExpenseData.map(expense => [ expense.EXPID, expense.EXPNAME, expense.EXPCATEGORY, expense.EXPPRICE, expense.EXPDATE, expense.EXPDTL ]),
                theme: "striped",
                styles: { fontSize: 10 },
                columnStyles: {
                    0: { cellWidth: 20 },
                    1: { cellWidth: 25 },
                    2: { cellWidth: 25 },
                    3: { cellWidth: 30 },
                    4: { cellWidth: 25 },
                    5: { cellWidth: 50 },
                },
            });
    
            doc.setFontSize(14);
            doc.text(`Total Expense: ${totalExpense.toFixed(2)}`, 15, doc.lastAutoTable.finalY + 10);
            doc.save("ExpenseEase_Document.pdf");

            return { success: true, message: "Document downloaded successfully" };
        } catch (error) {
            console.error("Error generating document:", error.message);
            return { success: false, message: "Failed to generate document" };
        }
    },
    EditExpense: async (id, formData) => {
        try {
            const userId = Cookies.get("UserId");
            if (!userId) {
                throw new Error("User ID not found in cookies.");
            }
    
            const DB = getDatabase();
            const expenseRef = ref(DB, `Expense/${userId}/ExpenseData/${id}`);
    
            await FirebaseUpdate(expenseRef, formData);
    
            set((state) => ({
                ExpenseData: state.ExpenseData.map((expense) =>
                    expense.id === id ? { ...expense, ...formData } : expense
                ),
            }));
    
            return { success: true, message: "Expense updated successfully" };
        } catch (error) {
            console.error("Error updating expense:", error.message);
            return { success: false, message: "Failed to update expense" };
        }
    },
    DeleteExpense: async (id) => {
        try {
            const userId = Cookies.get("UserId");
            if (!userId) {
                throw new Error("User ID not found in cookies.");
            }

            const DB = getDatabase();
            const expenseRef = ref(DB, `Expense/${userId}/ExpenseData/${id}`);
            await FirebaseRemove(expenseRef);

            set((state) => ({
                ExpenseData: state.ExpenseData.filter(expense => expense.id !== id),
            }));

            return { success: true, message: "Expense deleted successfully" };
        } catch (error) {
            console.error("Error deleting expense:", error.message);
            return { success: false, message: "Failed to delete expense" };
        } 
    },
    GetExpense: async () => {
        try {
            const userId = Cookies.get("UserId");
            if (!userId) {
                throw new Error("User ID not found in cookies.");
            }

            const DB = getDatabase();
            const expenseRef = ref(DB, `Expense/${userId}/ExpenseData`);
            const snapshot = await FirebaseGet(expenseRef);
            
            if (snapshot.exists()) {
                const data = snapshot.val();
                const expenseArray = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
                set({ ExpenseData: expenseArray });
            } else {
                set({ ExpenseData: [] });
            }
        } catch (error) {
            console.error("Error fetching expenses:", error.message);
        }
    },
    AddExpense: async(formData) => {
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
            if (!user) {
                console.error("User is not authenticated.");
                return { success: false, message: "User is not authenticated" };
            }
                            
            const userId = Cookies.get("UserId");
            if (!userId) {
                throw new Error("User ID not found in cookies.");
            }
                
            if (user.uid !== userId) {
                throw new Error("Authenticated user does not match the user ID in cookies.");
            }

            const DB = getDatabase();
            const expenseRef = ref(DB, `Expense/${userId}/ExpenseData`);
            await push(expenseRef, formData);

            return ({
                success: true,
                message: "Expense Data Added Successfully"
            })

        } catch (error) {
            console.error(error.message);
            return ({
                success: false,
                message: "Internal Server Error"
            })
        }
    }
}))