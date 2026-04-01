import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await register(formData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
        padding: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 420 }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            borderRadius: 3,
            background: "linear-gradient(145deg, #ffffff, #f1f5f9)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              fontWeight: "bold",
              color: "#185a9d",
              mb: 2,
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            Create Account
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              component={motion.div}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
            />

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  mt: 3,
                  mb: 2,
                  borderRadius: 2,
                  fontWeight: "bold",
                  background:
                    "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
                }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Register"}
              </Button>
            </motion.div>
          </form>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 1, color: "#333" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                fontWeight: "bold",
                color: "#185a9d",
              }}
            >
              Login here
            </Link>
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Register;
