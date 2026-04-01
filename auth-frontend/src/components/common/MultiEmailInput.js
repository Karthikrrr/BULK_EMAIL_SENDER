// components/common/MultiEmailInput.js
import { useState, useRef } from "react";
import {
  Box,
  Chip,
  TextField,
  Button,
  Paper,
  Typography,
  IconButton,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useEmailHistory } from "../../context/EmailHistoryContext";
import { useNavigate } from "react-router-dom";

const MultiEmailInput = () => {
  const navigate = useNavigate();
  const { addToHistory } = useEmailHistory();
  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRef = useRef(null);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleAddEmail = () => {
    if (currentEmail.trim() && isValidEmail(currentEmail.trim())) {
      if (!emails.includes(currentEmail.trim())) {
        setEmails([...emails, currentEmail.trim()]);
        setCurrentEmail("");
        setError("");
      } else {
        setError("Email already added");
      }
    } else {
      setError("Please enter a valid email address");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedEmails = pastedData.split(/[\s,;]+/).filter(Boolean);

    const validEmails = pastedEmails.filter((email) => isValidEmail(email));
    const invalidEmails = pastedEmails.filter((email) => !isValidEmail(email));

    if (validEmails.length > 0) {
      setEmails([...new Set([...emails, ...validEmails])]);
    }

    if (invalidEmails.length > 0) {
      setError(`Invalid emails ignored: ${invalidEmails.join(", ")}`);
    }
  };

  const handleSendBulkEmails = async () => {
    if (emails.length === 0) {
      setError("Please add at least one email address");
      return;
    }
    if (!subject.trim()) {
      setError("Please enter a subject");
      return;
    }
    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:8080/api/emails/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ emails, subject, message }),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(
          `Emails sent successfully! ${result.sentCount} emails delivered.`
        );
        setEmails([]);
        setSubject("");
        setMessage("");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = () => {
    setEmails([]);
    setCurrentEmail("");
    setSubject("");
    setMessage("");
    setError("");
    setSuccess("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 800,
          mx: "auto",
          borderRadius: 3,
          background: "linear-gradient(135deg, #f9f9f9, #f0f4ff)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          color="primary"
          sx={{ fontWeight: "bold" }}
        >
          ✉️ Bulk Email Sender
        </Typography>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert
                severity="success"
                sx={{ mb: 2 }}
                onClose={() => setSuccess("")}
              >
                {success}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Input Area */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Email Addresses ({emails.length} added)
          </Typography>

          <Box
            sx={{
              border: "2px dashed #90caf9",
              borderRadius: 2,
              p: 2,
              minHeight: 100,
              maxHeight: 200,
              overflowY: "auto",
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "center",
              mb: 1,
              bgcolor: "white",
            }}
          >
            <AnimatePresence>
              {emails.map((email, index) => (
                <motion.div
                  key={email}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Chip
                    label={email}
                    onDelete={() => handleRemoveEmail(email)}
                    deleteIcon={<CloseIcon />}
                    color="primary"
                    variant="outlined"
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            <TextField
              ref={inputRef}
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              onPaste={handlePaste}
              placeholder={
                emails.length === 0
                  ? "Enter email addresses (press Enter or comma)"
                  : "Add more emails..."
              }
              variant="standard"
              sx={{ minWidth: 200, flexGrow: 1 }}
              InputProps={{ disableUnderline: true }}
            />
          </Box>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddEmail}
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            >
              Add Email
            </Button>
          </motion.div>
        </Box>

        {/* Subject Input */}
        <TextField
          fullWidth
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          margin="normal"
          variant="outlined"
          required
        />

        {/* Message Input */}
        <TextField
          fullWidth
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          margin="normal"
          variant="outlined"
          multiline
          rows={4}
          required
          placeholder="Type your message here..."
        />

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="outlined"
              onClick={handleClearAll}
              disabled={isLoading}
            >
              Clear All
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSendBulkEmails}
              disabled={isLoading || emails.length === 0}
              sx={{ minWidth: 140 }}
            >
              {isLoading ? "Sending..." : `Send (${emails.length})`}
            </Button>
          </motion.div>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default MultiEmailInput;
