// src/Middleware.jsx
import Cookies from "js-cookie";
import { Navigate } from "react-router";
export const Middleware = ({children}) => {
    const AuthToken = Cookies.get("AuthToken");
    const UserId = Cookies.get("UserId");
    return AuthToken && UserId ? children : <Navigate to="/api/expense/v1/signin" replace />;
}

export const GuestMiddleware = ({ children }) => {
    const AuthToken = Cookies.get("AuthToken");
    const UserId = Cookies.get("UserId");
    return AuthToken && UserId ? <Navigate to="/api/expense/v1/home" replace /> : children;
};