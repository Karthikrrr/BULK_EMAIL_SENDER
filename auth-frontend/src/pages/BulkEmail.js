// pages/BulkEmail.js - Centered Form Layout with Animation
import React from "react";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";
import MultiEmailInput from "../components/common/MultiEmailInput";
import EmailHistory from "../components/email/EmailHistory";

const BulkEmail = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4, textAlign: "center" }}>
        {/* Animated Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Bulk Email Sender
          </Typography>
        </motion.div>

        {/* Centered Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              maxWidth: 600,
              mx: "auto", // center horizontally
            }}
          >
            <MultiEmailInput />
          </Paper>
        </motion.div>

        {/* Email History Below */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box mt={4}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
              Previous Email History
            </Typography>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <EmailHistory />
            </Paper>
          </Box>
        </motion.div>
      </Box>
    </Container>
  );
};

export default BulkEmail;
