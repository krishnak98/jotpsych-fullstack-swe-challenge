import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, Box, Button, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import APIService from "../services/APIService";

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



    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const mediaRecorder = useRef(null);
    const chunks = useRef([]);

    const startRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder.current = new MediaRecorder(stream);
                    mediaRecorder.current.ondataavailable = e => {
                        if (e.data.size > 0) {
                            chunks.current.push(e.data);
                        }
                    };
                    mediaRecorder.current.start();
                    setIsRecording(true);
                    setTimeout(stopRecording, 15000); // 15 seconds
                })
                .catch(err => console.error('Error accessing microphone:', err));
        }
    };



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

    const stopRecording = async () => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            setIsRecording(false);
            const blob = new Blob(chunks.current, { type: 'audio/webm' });
    
            const formData = new FormData();
            formData.append('audio', blob);
            formData.append('username', username); 
            
            try {
                const response = await fetch('http://localhost:3002/upload', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                // const response = await APIService.request('/upload', 'POST', formData)
                if (response.ok) {
                    const data = await response.json();
                    if(data) {
                        setMotto(data.data)
                    }
                    alert('Audio uploaded successfully');
                } else {
                    console.error('Failed to upload audio:', response.statusText);
                }
            } catch (error) {
                console.error('Error uploading audio:', error);
            }
    
            setAudioUrl(URL.createObjectURL(blob));
            chunks.current = [];
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
                <Button variant="contained" color="success" sx={{ width: '45%' }} onClick={startRecording}>
                    Record (New) Motto
                </Button>
                <Button variant="contained" color="error" sx={{ width: '45%' }} onClick={handleLogout}>
                    Logout
                </Button>
            </Box>
        </Container>
    );
}

export default Profile;
