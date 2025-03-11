// src/Components/Pages/Profile.jsx
import { useNavigate } from "react-router-dom";
import { AuthStore } from "../Zustand/AuthStore";
import { ProfileStore } from "../Zustand/ProfileStore";
import { IoPersonCircle } from "react-icons/io5";
import { GrGallery } from "react-icons/gr";
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import "../Styles/Profile.css";

const Profile = () => {
    const navigate = useNavigate();
    const LogOut = AuthStore((state) => state.LogOut);
    const { AddUserProfile, GetUserProfile, VerifyUserEmail } = ProfileStore();

    const [imagePreview, setImagePreview] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const userId = Cookies.get("UserId");

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                if (userId) {
                    const data = await GetUserProfile(userId);
                    
                    if (Object.keys(data).length === 0) {
                        toast.warn("Please add your profile details", { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", transition: Slide, style: { background: '#a44b07' }
                        });
                    }
    
                    setUserProfile(data);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
                toast.error("Failed to fetch profile data", { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", transition: Slide, style: { background: '#ff0000' } 
                });
            }
        };
    
        fetchProfileData();
    }, [userId]);
    

    const HandleLogOut = () => {
        LogOut();
        navigate("/api/expense/v1/signin");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const HandleUserData = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let userimage = imagePreview;
        if (!userimage && userProfile?.userimage) {
            userimage = userProfile.userimage;
        }
        formData.set("userimage", userimage);
        const Obj = Object.fromEntries(formData.entries());        
        try {
            const res = await AddUserProfile(Obj);
            toast.success(res, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", transition: Slide, style: { background: '#048c01' } });
            e.target.reset();
            setImagePreview(null);
            const updatedData = await GetUserProfile(userId);
            setUserProfile(updatedData);
        } catch (error) {
            toast.error("Failed to update. Please try again", { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", transition: Slide, style: { background: '#ff0000' } });
            console.error("Error handling user data:", error);
        }
    };

    const HandleVerifyEmail = async () => {    
        try {
            const response = await VerifyUserEmail();
    
            if (response?.success) {
                toast.success(response.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", transition: Slide, style: { background: '#048c01' } });
            } else {
                toast.error(response?.message || "Something went wrong");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.", { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", transition: Slide, style: { background: '#ff0000' } });
            console.error("HandleVerifyEmail Error:", error);
        }
    };
    
    return (
        <>
            <section className="UP_SEC_H1">
                <h1 className="UP_H1">User Profile</h1>
            </section>
            <section className="UP_FRM_SECTION">
                <form onSubmit={HandleUserData} className="UP_FORM_SEC">
                    <div className="FRM_LBL_DIV">
                        <label className="IMG_LBL" htmlFor="userimage" style={{ cursor: 'pointer' }}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" style={{ width: 50, height: 50, borderRadius: "50%" }} />
                            ) : (
                                <IoPersonCircle size={70} color="#de6730" />
                            )}
                        </label>
                        <input type="file" id="userimage" name="userimage" onChange={handleImageChange} accept="image/*" style={{ display: "none" }} />
                        <label className="FRM_IMG_LBL" htmlFor="userimage">
                            <GrGallery size={20} color="#ffffff" />
                        </label>
                    </div>
                    <div className="FRM_LBL_DIV FRM_DIV">
                        <label className="FRM_BLLL">UserName</label>
                        <input className="FRMPI" type="text" id="username" name="username" placeholder="Enter Username" />
                    </div>
                    <div className="FRM_LBL_DIV FRM_DIV">
                        <label className="FRM_BLLL">UserEmail</label>
                        <input className="FRMPI" type="text" id="useremail" name="useremail" placeholder="Enter Useremail" />
                    </div>
                    <div className="FRM_LBL_DIV FRM_DIV">
                        <label className="FRM_BLLL">UserPhone</label>
                        <input className="FRMPI" type="text" id="userphone" name="userphone" placeholder="Enter Phone Number" />
                    </div>
                    <div className="FRM_LBL_DIV FRM_DIV">
                        <input className="FRM_UU" type="submit" value="Update User" />
                    </div>
                </form>
            </section>
            <section className="USER_PROF_SEC">
                {userProfile && Object.keys(userProfile).length > 0  ? (
                    <div className="PROF_USER_DIV">
                        {userProfile.userimage && <img src={userProfile.userimage} alt="User Profile" loading="lazy" className="IMG_UP" />}
                        <p className="UPP"><strong>Username:</strong> {userProfile.username}</p>
                        <p className="UPP"><strong>Email:</strong> {userProfile.useremail}</p>
                        <p className="UPP"><strong>Phone:</strong> {userProfile.userphone}</p>
                        <div className="PRF_BTN_SEC">
                            <button className="FRM_UU" type="button" onClick={HandleVerifyEmail}>Verify Email</button>
                            <button className="FRM_UU" onClick={HandleLogOut}>User Logout</button>
                        </div>
                    </div>
                ) : (
                    <p>No profile data found.</p>
                )}
            </section>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover theme="colored" transition={Slide} />
        </>
    );
};

export default Profile;
