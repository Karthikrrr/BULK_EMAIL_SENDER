import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const OAuth2Success = () => {
  const [searchParams] = useSearchParams();
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const name = searchParams.get('name');

    if (token && email) {
      localStorage.setItem('token', token);
      setToken(token);
      setUser({ email, name });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }
  }, [searchParams, setToken, setUser, navigate]);

  const token = searchParams.get('token');
  const error = searchParams.get('error');

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          OAuth2 authentication failed: {error}
        </Alert>
      </Box>
    );
  }

  if (!token) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
        }}
      >
        <Alert severity="warning" sx={{ mb: 2 }}>
          No token received. Please try again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
      }}
    >
      <CircularProgress size={60} sx={{ mb: 2 }} />
      <Typography variant="h6" color="textSecondary">
        Signing you in...
      </Typography>
    </Box>
  );
};

export default OAuth2Success;