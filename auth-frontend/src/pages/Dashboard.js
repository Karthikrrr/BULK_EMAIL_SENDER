import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

const Dashboard = () => {
  const { user, getProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authApi.getProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom align="center">
        Dashboard
      </Typography>

      {/* Centered Grid */}
      <Grid
        container
        spacing={3}
        justifyContent="center" // centers horizontally
        alignItems="flex-start"
      >
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                </Avatar>
                <Typography variant="h6">
                  Welcome, {profile?.firstName} {profile?.lastName}!
                </Typography>
              </Box>

              <Typography variant="body1" color="textSecondary">
                <strong>Email:</strong> {profile?.email}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Role:</strong> {profile?.role}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Status:</strong> {profile?.enabled ? 'Active' : 'Inactive'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Typography variant="body1">
                • Your account is secure with JWT authentication
              </Typography>
              <Typography variant="body1">
                • Role-based access control enabled
              </Typography>
              <Typography variant="body1">
                • Real-time token validation
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
