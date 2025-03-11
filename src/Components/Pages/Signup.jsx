import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthStore } from "../Zustand/AuthStore";
import { FormValidate, extractUserName } from "../Constants/FormValidate";
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../Styles/Signup.css";
import { FaEye as EyeIcon, FaEyeSlash as EyeSlashIcon, FaUser as UserIcon } from "react-icons/fa";
import { IoMail as EmailIcon } from "react-icons/io5";
// src/Components/Pages/Signup.jsx
const Signup = () => {
    const {SignUp} = AuthStore();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const SignUpHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const Obj = Object.fromEntries(formData.entries());
        const validationResult = FormValidate(Obj);
        if(!validationResult.isValid) {
            toast.warn(validationResult.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#a44b07'} });
            return;
        }
        try {
            const res = await SignUp(Obj);
            if(res?.userExists) {
                toast.warn(`${extractUserName(Obj.useremail)} Is Already Exist`, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#a44b07'} })
            } else if (res?.success) {
                toast.success(`${extractUserName(res.mail)} Is Created`, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#048c01'} })
                setTimeout(() => {
                    e.target.reset();
                    navigate("/api/expense/v1/signin");
                }, 3000);
            }
        } catch (error) {
            toast.error(error.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#ff0000'} })
        }
    }
    return (
        <>
            <section className="SGUP_SEC">
                <h1 className="SGUP_H1">User SignUp</h1>
            </section>
            <section className="FORMSECTION">
                <form onSubmit={SignUpHandler} className="FRM_DIV_FORM">
                    <div className="FRM_DIV_P1">
                        <div className="FRMDIV">
                            <label className="FRMLBL" htmlFor="username">UserName</label>
                            <div className="FRMIP_DIV">
                                <input className="FRMIP" type="text" id="username" name="username" placeholder="Enter User Name" />
                                <span className="FRMIP_ICONS">
                                    <UserIcon color="#ffffff" size={20} />
                                </span>
                            </div>
                        </div>
                        <div className="FRMDIV">
                            <label className="FRMLBL" htmlFor="useremail">UserEmail</label>
                            <div className="FRMIP_DIV">
                                <input className="FRMIP" type="text" id="useremail" name="useremail" placeholder="Enter User Email" />
                                <span className="FRMIP_ICONS">
                                    <EmailIcon color="#ffffff" size={20} />
                                </span>
                            </div>
                        </div>
                        <div className="FRMDIV">
                            <label className="FRMLBL" htmlFor="userpassword">UserPassword</label>
                            <div className="FRMIP_DIV">
                                <input className="FRMIP" type={showPassword ? "text" : "password"} id="userpassword" name="userpassword" placeholder="Enter User Password" />
                                <span className="FRMIP_ICONS" onClick={togglePasswordVisibility}>
                                    {showPassword ? <EyeIcon color="#ffffff" size={20} /> : <EyeSlashIcon color="#ffffff" size={20} />}
                                </span>
                            </div>
                        </div>
                        <div className="FRMDIV">
                            <label className="FRMLBL" htmlFor="confirmpassword">ConfirmPassword</label>
                            <div className="FRMIP_DIV">
                                <input className="FRMIP" type={showConfirmPassword ? "text" : "password"} id="confirmpassword" name="confirmpassword" placeholder="Enter Confirm Password" />
                                <span className="FRMIP_ICONS" onClick={toggleConfirmPasswordVisibility}>
                                    {showConfirmPassword ? <EyeIcon color="#ffffff" size={20} /> : <EyeSlashIcon color="#ffffff" size={20} />}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="FRM_BTN_DIV">
                        <div className="FRM_BTN_DIV_DIV">
                            <Link className="LINK" to="/api/expense/v1/signin" title="Go To Signin Page">Already Have Account? Click Here</Link>
                        </div>
                        <div className="FRM_BTN_DIV_DIV">
                            <input className="SBMTBTN" type="submit" value="Sign Up" title="User Sign Up" />
                        </div>
                    </div>
                </form>
            </section>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover theme="colored" transition={Slide} />
        </>
    );
}
export default Signup;