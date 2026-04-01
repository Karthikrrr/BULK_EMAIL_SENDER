// pages/TemplateBulkEmailPage.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import TemplateBulkEmail from '../components/email/TemplateBulkEmail';

const TemplateBulkEmailPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Bulk Email with Templates
        </Typography>
        <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 4 }}>
          Send personalized emails using Excel data and HTML templates
        </Typography>
        
        <TemplateBulkEmail />
      </Box>
    </Container>
  );
};

export default TemplateBulkEmailPage;