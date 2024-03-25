import React from "react"
import { Outlet, Navigate } from "react-router-dom"

const ProtectedRoute = ({ element: Element, ...props }) => {
    const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));

    return token ? <Outlet /> : <Navigate to="login-register" />;
};

export default ProtectedRoute;
