import React, { useState } from "react";
import { TextField, Button, Typography, Container } from '@mui/material';
import APIService from "../services/APIService";


// add redirection on sucessful login

function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const response = await fetch("http://localhost:3002/login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ username, password }),
  //   });
  //   const data = await response.json();
  //   if (response.ok) {
  //     // do something with access token
  //     localStorage.setItem('token', data.token)

  //     setMessage("Login successful");
  //   } else {
  //     setMessage(data.message);
  //   }
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await APIService.request('/login', 'POST', { username, password });
      
      // Assuming the response contains an access token
      localStorage.setItem('token', data.token);
  
      setMessage("Login successful");
    } catch (error) {
      setMessage(error.message || "An error occurred");
    }
  };
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h2" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="Username"
            type="text"
            fullWidth
            margin="normal"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
      {message && (
        <Typography variant="body2" color="error" marginTop="16px">
          {message}
        </Typography>
      )}
    </Container>
  );
}

export default Login;
