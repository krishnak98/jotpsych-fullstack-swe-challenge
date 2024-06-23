import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import APIService from "../services/APIService";

function Logout() {
    useEffect(() => {
      const logoutUser = async () => {
        const token = localStorage.getItem("token");
        if (token) {
          const resp = await APIService.request('/logout', 'GET');
          if(resp.ok) {
            localStorage.removeItem("token");
            alert("Logged out successfully");
          } else {
                console.error("Failed to logout:", resp.text);
              }
            } 
        }
      logoutUser();
    }, []);
  
    return (
      <div>
        <p>Logging out...</p>
        <Link to="/">Go to Home</Link>
      </div>
    );
  }
  
export default Logout;
