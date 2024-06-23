import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import APIService from "../services/APIService";

function Home() {
  const [username, setUsername] = useState<string>("");


const fetchUser = async () => {
  const token = localStorage.getItem('token');
  if (token) {
      try {
          const data = await APIService.request('/user', 'GET',null,true)
          setUsername(data.username);
      } catch (error) {
          console.error('Error fetching user:', error);
      }
  }
};

useEffect(() => {
  fetchUser();
}, []);

  return (
    <div>
      <h2>Home</h2>
      {username ? (
        <p>Welcome, {username}!</p>
      ) : (
        <p>
          Please <Link to="/login">login</Link> or{" "}
          <Link to="/register">register</Link>.
        </p>
      )}
    </div>
  );
}

export default Home;
