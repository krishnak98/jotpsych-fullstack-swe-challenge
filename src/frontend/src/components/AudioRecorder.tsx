// AudioRecorder.tsx

import React, { useState, useRef } from 'react';
import { Button } from '@mui/material';
import APIService from '../services/APIService';

interface AudioRecorderProps {
    username: string;
    setMotto: (motto: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ username, setMotto }) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const chunks = useRef<BlobPart[]>([]);

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
    
            chunks.current = [];
        }
    };

    return (
        <Button variant="contained" color="success" sx={{ width: '45%' }} onClick={startRecording}>
            Record (New) Motto
        </Button>
    );
};

export default AudioRecorder;
