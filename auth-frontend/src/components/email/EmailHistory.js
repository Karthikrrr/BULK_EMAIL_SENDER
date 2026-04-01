import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useEmailHistory } from "../../context/EmailHistoryContext";

const EmailHistory = () => {
  const { emailHistory, loading, error, fetchEmailHistory, getEmailDetail } =
    useEmailHistory();

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [emailDetail, setEmailDetail] = useState(null);
  const [detailError, setDetailError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleViewDetails = async (historyId) => {
    setDetailLoading(true);
    setDetailError(null);
    try {
      const detail = await getEmailDetail(historyId);
      setEmailDetail(detail);
      setDetailDialogOpen(true);
    } catch (err) {
      console.error("Failed to fetch email details:", err);
      setDetailError(err.message);
      setSnackbar({ open: true, message: err.message });
    } finally {
      setDetailLoading(false);
    }
  };

  const handleRetry = () => {
    setDetailError(null);
    if (selectedEmail) {
      handleViewDetails(selectedEmail);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "success";
      case "PARTIAL_SUCCESS":
        return "warning";
      case "FAILED":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(145deg, #ffffff, #f9fafb)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#185a9d",
              textShadow: "1px 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            📧 Email History
          </Typography>
          <IconButton
            onClick={fetchEmailHistory}
            disabled={loading}
            sx={{
              color: "#185a9d",
              transition: "transform 0.3s",
              "&:hover": { transform: "rotate(90deg)" },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={fetchEmailHistory}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {emailHistory.length === 0 && !error ? (
          <Typography
            color="textSecondary"
            align="center"
            sx={{ py: 4, fontStyle: "italic" }}
          >
            No email history found. Send your first email to see it here!
          </Typography>
        ) : (
          <List>
            {emailHistory.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    "&:hover": {
                      bgcolor: "rgba(24, 90, 157, 0.05)",
                      borderRadius: 2,
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="subtitle1"
                          component="span"
                          sx={{ fontWeight: "bold" }}
                        >
                          {item.subject}
                        </Typography>
                        <Chip
                          label={item.status}
                          size="small"
                          color={getStatusColor(item.status)}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          gutterBottom
                        >
                          To: {item.sentTo}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {item.messagePreview}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {formatDate(item.sentAt)} • {item.sentCount}/
                          {item.totalCount} sent
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => {
                        setSelectedEmail(item.id);
                        handleViewDetails(item.id);
                      }}
                      disabled={detailLoading}
                      sx={{ color: "#185a9d" }}
                    >
                      <ViewIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < emailHistory.length - 1 && <Divider />}
              </motion.div>
            ))}
          </List>
        )}

        {/* Detail Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Email Details
            {detailLoading && <CircularProgress size={20} sx={{ ml: 2 }} />}
          </DialogTitle>
          <DialogContent>
            {detailError ? (
              <Alert
                severity="error"
                action={
                  <Button color="inherit" size="small" onClick={handleRetry}>
                    Retry
                  </Button>
                }
              >
                {detailError}
              </Alert>
            ) : emailDetail ? (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Subject:</strong> {emailDetail.subject}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Sent:</strong> {emailDetail.formattedDate}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Status:</strong>
                  <Chip
                    label={emailDetail.status}
                    size="small"
                    color={getStatusColor(emailDetail.status)}
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Recipients:</strong>{" "}
                  {emailDetail.recipients?.join(", ")}
                </Typography>

                <Typography variant="body2" gutterBottom>
                  <strong>Sent:</strong> {emailDetail.sentCount}/
                  {emailDetail.totalCount}
                </Typography>

                {emailDetail.failedEmails?.length > 0 && (
                  <Typography variant="body2" color="error" gutterBottom>
                    <strong>Failed emails:</strong>{" "}
                    {emailDetail.failedEmails.join(", ")}
                  </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" gutterBottom>
                  <strong>Message:</strong>
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: "grey.50",
                    borderRadius: 2,
                    fontFamily: "monospace",
                  }}
                >
                  <Typography variant="body2" whiteSpace="pre-wrap">
                    {emailDetail.message}
                  </Typography>
                </Paper>
              </Box>
            ) : (
              !detailError && (
                <Box display="flex" justifyContent="center" py={3}>
                  <CircularProgress />
                </Box>
              )
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for errors */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ open: false, message: "" })}
          message={snackbar.message}
        />
      </Paper>
    </motion.div>
  );
};

export default EmailHistory;
