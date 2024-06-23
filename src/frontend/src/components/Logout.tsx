import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Logout() {
    useEffect(() => {
      const logoutUser = async () => {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const response = await fetch("http://localhost:3002/logout", {
              method: "GET",  // Adjust method based on your server implementation
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (response.ok) {
              // Clear token from localStorage upon successful logout
              localStorage.removeItem("token");
              console.log("Logged out successfully");
            } else {
              console.error("Failed to logout:", response.statusText);
            }
          } catch (error) {
            console.error("Error:", error);
          }
        } else {
          console.log("No token found");
        }
      };
  
      logoutUser();
    }, []);
  
    return (
      <div>
        <p>Logging out...</p>
        {/* You can add a link to redirect to another page after logout */}
        <Link to="/">Go to Home</Link>
      </div>
    );
  }
  
export default Logout;
