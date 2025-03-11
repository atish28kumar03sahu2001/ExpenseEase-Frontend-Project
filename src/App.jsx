// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Loading from './Components/Constants/Loading';
import { GuestMiddleware, Middleware } from './Middleware';

const Header = lazy(()=>import("./Components/Layout/Header"));
const Footer = lazy(()=>import("./Components/Layout/Footer"));
const Welcome = lazy(() => import("./Components/Pages/Welcome"));
const Error = lazy(() => import("./Components/Constants/Error"));
const Signup = lazy(() => import("./Components/Pages/Signup"));
const Signin = lazy(() => import("./Components/Pages/Signin"));
const Profile = lazy(() => import("./Components/Pages/Profile"));
const Expense = lazy(() => import("./Components/Pages/Expense"));

const App =  () => {
    return (
        <>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Suspense fallback={<Loading />}>
                    <Routes>
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<Navigate to="/api/expense/v1/home" replace />} />
                            <Route path="/api/expense/v1/home" element={<Welcome />} />
                            <Route path="/api/expense/v1/signup" element={<GuestMiddleware><Signup /></GuestMiddleware>} />
                            <Route path="/api/expense/v1/signin" element={<GuestMiddleware><Signin /></GuestMiddleware>} />
                            <Route path="/api/expense/v1/profile/:id" element={<Middleware><Profile /></Middleware>} />
                            <Route path="/api/expense/v1/expense/:id" element={<Middleware><Expense /></Middleware>} />
                        </Route>
                        <Route path="*" element={<Error />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    );
}


const MainLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};


export default App;