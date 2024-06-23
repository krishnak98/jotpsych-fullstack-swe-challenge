import React, { useState } from "react";
import { TextField, Button, Typography, Container } from '@mui/material';
import APIService from "../services/APIService";
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");


  const navigate = useNavigate();
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resp = await APIService.request('/register', 'POST', { username, password });
      console.log(resp)
      if (resp.status === 201) {
        setMessage("Registration successful");
        navigate('/login');
      } else {
        setMessage("Failed to register user " + resp.message);
      }

  
    } catch (error: any) {
      setMessage(error.message || "An error occurred");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h2" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleRegister}>
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
          Register
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

export default Register;
