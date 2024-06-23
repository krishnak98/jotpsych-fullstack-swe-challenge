import React, { useState } from "react";
import { TextField, Button, Typography, Container, Link} from '@mui/material';
import APIService from "../services/APIService";
import { useNavigate } from 'react-router-dom';




function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");


  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await APIService.request('/login', 'POST', { username, password });
      if(data.token) {
        localStorage.setItem('token', data.token);
  
        setMessage("Login successful");
        navigate('/profile');
      } else {
        setMessage(data.message)
      }
  
    } catch (error: any) {
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
      <Typography variant="body2" marginTop="16px">
        Don't have an account? <Link href="/register">Register</Link>
      </Typography>

    </Container>
  );
}

export default Login;
