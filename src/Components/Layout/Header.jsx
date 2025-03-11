// src/Components/Layout/Header.jsx
import { Link } from "react-router";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import "../Styles/Header.css";
import { IoMenu as MenuBarIcon } from "react-icons/io5";
import { RxCross1 as CrossIcon } from "react-icons/rx";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [authState, setAuthState] = useState({
        AuthToken: Cookies.get("AuthToken"),
        UserId: Cookies.get("UserId"),
    });

    useEffect(() => {
        const updateAuthState = () => {
            setAuthState({
                AuthToken: Cookies.get("AuthToken"),
                UserId: Cookies.get("UserId"),
            });
        };
        const cookieChangeListener = setInterval(updateAuthState, 500);
        return () => clearInterval(cookieChangeListener);
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            <section className="HEAD_SEC">
                <div className="HEAD_H1">
                    <Link to={"/api/expense/v1/home"} className="HEAD_H1_H1">ExpenseEase</Link>
                </div>
                <div className="HEAD_LINK">
                    {!authState.AuthToken || !authState.UserId ? (
                        <>
                            <Link to="/api/expense/v1/signup" className="LNK">Signup</Link>
                            <Link to="/api/expense/v1/signin" className="LNK">Signin</Link>
                        </>
                    ) : (
                        <>
                            <Link to={`/api/expense/v1/profile/${authState.UserId}`} className="LNK">Profile</Link>
                            <Link to={`/api/expense/v1/expense/${authState.UserId}`} className="LNK">Expense</Link>
                        </>
                    )}
                </div>
                <div className="MENU_ICON" onClick={toggleMenu}>
                    {menuOpen ? null : <MenuBarIcon size={30} color="white" />}
                </div>
                {menuOpen && (
                    <div className="MOBILE_LINKS">
                        <div className="CROSS_ICON_CONTAINER" onClick={toggleMenu}>
                            <CrossIcon size={30} color="white" />
                        </div>
                        {!authState.AuthToken || !authState.UserId ? (
                            <>
                                <div className="ICONSDIV">
                                    <Link to="/api/expense/v1/signup" className="LNK">Signup</Link>
                                    <Link to="/api/expense/v1/signin" className="LNK">Signin</Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="ICONSDIV">
                                    <Link to={`/api/expense/v1/profile/${authState.UserId}`} className="LNK">Profile</Link>
                                    <Link to={`/api/expense/v1/expense/${authState.UserId}`} className="LNK">Expense</Link>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </section>
        </>
    );
};

export default Header;