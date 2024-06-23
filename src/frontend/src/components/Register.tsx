import React, { useState } from "react";
import { TextField, Button, Typography, Container } from '@mui/material';


// redirect to login? 

function Register() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3002/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    setMessage(data.message);
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
