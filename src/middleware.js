import React from 'react'
import {} from "react-redux"
import {Navigate, } from "react-router-dom"

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({children}) => {

    if(!localStorage.getItem("client_token")) {
        return <Navigate to="/?login"  replace />
    }
 return children

};

export default ProtectedRoute;