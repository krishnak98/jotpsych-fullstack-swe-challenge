import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, Box, Button, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import APIService from "../services/APIService";
import AudioRecorder from "./AudioRecorder";

function Profile() {
    const [username, setUsername] = useState<string>("");
    const [motto, setMotto] = useState<string>("My motto goes here");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const resp = await APIService.request('/user', 'GET',null,true);
                if(resp.username) {
                    setUsername(resp.username);
                    if(resp.motto)
                        setMotto(resp.motto)
                } else {
                    navigate('/')
                }
            } else {
                navigate('/')
            }
        };
  
        fetchUser();
    }, []);


    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const resp = await APIService.request('/logout', 'GET', null, true);
                if(resp.status == 200) {
                    localStorage.removeItem("token");
                    alert("Logged out successfully");
                    navigate('/');
                } else {
                    console.error("Failed to logout:")
                }
            } catch(error: any) {
                console.error("Failed to logout")
            }
        } 
    };


    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4, border: 1, borderRadius: 2, p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ width: 80, height: 80, mb: 2 }} />
                <Typography variant="h6" component="div">
                    {username ? username : ""}
                </Typography>
            </Box>
            <Typography variant="h5" component="div" sx={{ my: 4 }}>
                {motto}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <AudioRecorder username={username} setMotto={setMotto} />
                <Button variant="contained" color="error" sx={{ width: '45%' }} onClick={handleLogout}>
                    Logout
                </Button>
            </Box>
        </Container>
    );
}

export default Profile;
