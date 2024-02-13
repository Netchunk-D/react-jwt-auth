import React, { useState } from 'react';
import axios from 'axios';
import { Container, Paper, Typography, TextField, Button, Switch } from '@mui/material';
import './App.css';

const App = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isSignup) {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('username', username);
                formData.append('password', password);
                formData.append('image', selectedFile);

                const response = await axios.post('http://localhost:5000/signup', formData);

                setMessage(response.data.message);
            }else {
                const response = await axios.post('http://localhost:5000/login', { username, password });
                setToken(response.data.token);
            }
        } catch (error) {
            console.error('Authentication error:', error.response ? error.response.data.error : error.message);
        }
    };

    const handleFileChange = (e) => {
      setSelectedFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
      try {
          const formData = new FormData();
          formData.append('image', selectedFile);

          const response = await axios.post('http://localhost:5000/upload', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${token}`,
              },
          });

          setMessage(response.data.message);
      } catch (error) {
          console.error('Image upload error:', error.response ? error.response.data.error : error.message);
      }
  };
    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} className="form-container">
                <Typography variant="h5">{isSignup ? 'Sign Up' : 'Login'}</Typography>
                <form onSubmit={handleFormSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className={isSignup ? 'btn-signup' : 'btn-login'}
                    >
                        {isSignup ? 'Sign Up' : 'Login'}
                    </Button>
                    {!isSignup && (
                        <>
                            <input type="file" onChange={handleFileChange} />
                            <Button
                                fullWidth
                                variant="contained"
                                className="btn-upload"
                                onClick={handleImageUpload}
                                disabled={!token || !selectedFile}
                            >
                                Upload Image
                            </Button>
                            <Typography variant="body2" className="message">
                                {message}
                            </Typography>
                        </>
                    )}
                </form>
                <Typography variant="body2" className="message">
                    {message || (token && `Token: ${token}`)}
                </Typography>
                <Switch
                    color="primary"
                    checked={isSignup}
                    onChange={() => setIsSignup(!isSignup)}
                />
                <Typography variant="body2" className="toggle-text">
                    {isSignup ? 'Switch to Login' : 'Switch to Sign Up'}
                </Typography>
            </Paper>
        </Container>
    );
};

export default App;
