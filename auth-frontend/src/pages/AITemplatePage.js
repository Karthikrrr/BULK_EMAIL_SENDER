// pages/AITemplatePage.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import AITemplateGenerator from '../components/ai/AITemplateGenerator';

const AITemplatePage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          AI Template Generator
        </Typography>
        <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 4 }}>
          Generate professional email templates using AI
        </Typography>
        
        <AITemplateGenerator />
      </Box>
    </Container>
  );
};

export default AITemplatePage;