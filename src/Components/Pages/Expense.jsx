// src/Components/Pages/Expense.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import "../Styles/Expense.css";
import { ExpenseStore } from "../Zustand/ExpenseStore";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowAltCircleRight as RightArrowIcon, FaArrowAltCircleDown as DownArrowIcon } from "react-icons/fa";

const Expense = () => {
    const { AddExpense, GetExpense, ExpenseData, DeleteExpense, EditExpense, GetDocument  } = ExpenseStore();
    
    const [editingExpenseId, setEditingExpenseId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        GetExpense();
    }, []);

    const totalExpense = useMemo(() => {
        return ExpenseData.reduce((total, expense) => total + parseInt(expense.EXPPRICE || 0), 0);
    },[ExpenseData])

    const HandleExpense = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const Obj = Object.fromEntries(formData.entries());
        console.log("FormData:", Obj);

        try {
            let res;
            if (editingExpenseId) {
                res = await EditExpense(editingExpenseId, Obj);
                setEditingExpenseId(null);
            } else {
                res = await AddExpense(Obj);
            }

            if (res.success) {
                toast.success(res.message, { position: "top-right", autoClose: 3000, theme: "colored", transition: Slide, style: { background: "#048c01" } });
                GetExpense();
                e.target.reset();
            } else {
                toast.error(res.message, { position: "top-right", autoClose: 3000, theme: "colored", transition: Slide, style: { background: "#ff0000" } });
            }
        } catch (error) {
            console.error("Error processing expense:", error);
        }
    };

    const HandleEdit = (expense) => {
        setEditingExpenseId(expense.id);

        document.getElementById("EXPID").value = expense.EXPID;
        document.getElementById("EXPNAME").value = expense.EXPNAME;
        document.getElementById("EXPDTL").value = expense.EXPDTL;
        document.getElementById("EXPPRICE").value = expense.EXPPRICE;
        document.getElementById("EXPDATE").value = expense.EXPDATE;
        document.getElementById("EXPCATEGORY").value = expense.EXPCATEGORY;
    };

    const HandleDelete = async (id) => {
        try {
            const res = await DeleteExpense(id);
            if (res.success) {
                toast.success(res.message, { position: "top-right", autoClose: 3000, theme: "colored", transition: Slide, style: { background: "#ff0000" } });
                GetExpense();
            } else {
                toast.error(res.message, { position: "top-right", autoClose: 3000, theme: "colored", transition: Slide, style: { background: "#ff0000" } });
            }
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    };

    const debouncedSearch = useCallback(
        debounce((term) => setSearchTerm(term), 300),
        []
    );

    const HandleSearch = (e) => {
        debouncedSearch(e.target.value.toLowerCase());
    };

    const filteredExpenses = useMemo(() => {
        return ExpenseData.filter(expense => 
            expense.EXPNAME.toLowerCase().includes(searchTerm) || 
            expense.EXPCATEGORY.toLowerCase().includes(searchTerm)
        );
    }, [ExpenseData, searchTerm]);

    const HandleDownload = async () => {
        const res = await GetDocument();
        if (res.success) {
            toast.success(res.message, { position: "top-right", autoClose: 3000, theme: "colored", transition: Slide });
        } else {
            toast.error(res.message, { position: "top-right", autoClose: 3000, theme: "colored", transition: Slide });
        }
    };

    return (
        <>
            <section className="SEC_HEADER">
                <h1 className="HEADER_H1">Expense Section</h1>
            </section>
            <section className="FRM_SECTION">
                <form className="FRM" id="EXPENSEFORM" onSubmit={HandleExpense}>
                    <div className="FRM_DIV">
                        <label className="LBL">Expense Id</label>
                        <input type="text" id="EXPID" name="EXPID" className="IP" placeholder="Expense ID" />
                    </div>
                    <div className="FRM_DIV">
                        <label className="LBL">Expense Name</label>
                        <input type="text" id="EXPNAME" name="EXPNAME" className="IP" placeholder="Expense Name" />
                    </div>
                    <div className="FRM_DIV">
                        <label className="LBL">Expense Details</label>
                        <textarea id="EXPDTL" name="EXPDTL" className="TXTA" placeholder="Expense Details...." rows="12" cols="50"></textarea>
                    </div>
                    <div className="FRM_DIV">
                        <label className="LBL">Expense Price</label>
                        <input type="text" id="EXPPRICE" name="EXPPRICE" className="IP" placeholder="Expense Price" />
                    </div>
                    <div className="FRM_DIV">
                        <label className="LBL">Expense Date</label>
                        <input type="date" id="EXPDATE" name="EXPDATE" className="IP" />
                    </div>
                    <div className="FRM_DIV">
                        <label className="LBL">Expense Category</label>
                        <select id="EXPCATEGORY" name="EXPCATEGORY" className="IP OPTION">
                            <option hidden value="">Choose Option</option>
                            <option value="Food">Food</option>
                            <option value="Rent">Rent</option>
                            <option value="SchoolFee">School Fee</option>
                            <option value="CollegeFee">College Fee</option>
                            <option value="Travel">Travel</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="SBMTDIV">
                        <input type="submit" value={editingExpenseId ? "Update Expense" : "Add Expense"} className="SBMT" />
                    </div>
                </form>
            </section>
            <section className="EXPENSEDATA_SECTION">
                <header className="EXPENSEDATA_HEADER">
                    <h2 className="EXPENSEDATA_H1">Expense List</h2>
                </header>
                <div className="EXPENSE_SEARCH_DIV">
                    <input type="text" id="SEARCH" name="SEARCH" placeholder="Search Expense..." onChange={HandleSearch} className="EXPENSE_SEARCH_IP" title="Search Expense" />
                </div>
                <div className="EXPENSE_TTE_DIV">
                    <p className="EXPENSETTE">Total Expense: ₹{totalExpense.toFixed(2)}</p>
                </div>
                <section className="EXP_DTL_SEC">
                    {filteredExpenses.length > 0 ? (
                        filteredExpenses.map((expense) => (
                            <details key={expense.id} className="expense-details">
                                <summary>
                                    <RightArrowIcon className="icon right-icon" size={20} color="#a44b07" />
                                    <DownArrowIcon className="icon down-icon" size={20} color="#a44b07" />
                                    {expense.EXPID}
                                </summary>
                                <p className="EXPDTLP"><strong>Expense Name: </strong>{expense.EXPNAME}</p>
                                <p className="EXPDTLP"><strong>Expense Category: </strong>{expense.EXPCATEGORY}</p>
                                <p className="EXPDTLP"><strong>Expense Price: </strong>{expense.EXPPRICE}</p>
                                <p className="EXPDTLP"><strong>Expense Date: </strong>{expense.EXPDATE}</p>
                                <p className="EXPDTLP">{expense.EXPDTL}</p>
                                <button className="EXPDTL_BTN" onClick={() => HandleDelete(expense.id)}>DELETE</button>
                                <button className="EXPDTL_BTN" onClick={() => HandleEdit(expense)}>EDIT</button>
                            </details>
                        ))
                    ) : (
                        <p className="ERRORP">No expenses found. Try another search term.</p>
                    )}
                </section>
            </section>
            <section className="PDF_SECTION">
                <button className="PDFBTN" onClick={HandleDownload}>Get Document</button>
            </section>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover theme="colored" transition={Slide} />
        </>
    );
};
function debounce(func, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}
export default Expense;
