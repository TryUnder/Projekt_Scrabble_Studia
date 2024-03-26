import React from "react"
import axios from 'axios'
import { Outlet, Navigate } from "react-router-dom"
import { useState, useEffect } from 'react'

const ProtectedRoute = ({ element: Element, ...props }) => {
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const verifyToken = async() => {
            try {
                const response = await axios.get("/api/verifyToken")
                setIsTokenValid(response.data.valid)
            } catch (error) {
                console.error("Błąd podczas weryfikacji tokenu", error)
                setIsTokenValid(false)
            } finally {
                setLoading(false)
            }
        };

        verifyToken();
    }, []);

    if (loading) {
        return null;
    }

    return isTokenValid ? <Outlet /> : <Navigate to="login-register" />;
};

export default ProtectedRoute;
