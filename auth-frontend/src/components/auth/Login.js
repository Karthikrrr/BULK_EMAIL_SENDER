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
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import GoogleLoginButton from "./GoogleLoginButton";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoading, error, clearError } = useAuth();
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
    try {
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 15s ease infinite",
        padding: 2,
      }}
    >
      {/* Card with framer-motion animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 420 }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            borderRadius: 3,
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.95)",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(90deg,#667eea,#764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome Back
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "#764ba2" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                    boxShadow: "0 0 8px rgba(118,75,162,0.3)",
                  },
                },
              }}
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "#764ba2" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                    boxShadow: "0 0 8px rgba(118,75,162,0.3)",
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.2,
                fontWeight: 600,
                fontSize: "1rem",
                borderRadius: 2,
                background: "linear-gradient(90deg,#667eea,#764ba2)",
                "&:hover": {
                  background: "linear-gradient(90deg,#5a67d8,#6b46c1)",
                },
              }}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Login"}
            </Button>
          </form>

          {/* Animated divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Divider sx={{ my: 3 }}>OR</Divider>
          </motion.div>

          <GoogleLoginButton />

          <Typography variant="body2" align="center" sx={{ mt: 2, color: "text.secondary" }}>
            Don’t have an account?{" "}
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                color: "#667eea",
                fontWeight: 600,
              }}
            >
              Register here
            </Link>
          </Typography>
        </Paper>
      </motion.div>

      {/* Background gradient animation keyframes */}
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </Box>
  );
};

export default Login;
