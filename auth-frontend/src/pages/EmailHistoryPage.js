// pages/EmailHistoryPage.js - Enhanced with animations
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Pagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useEmailHistory } from "../context/EmailHistoryContext";
import { emailHistoryApi } from "../services/emailHistoryApi";

const EmailHistoryPage = () => {
  const { emailHistory, loading, error, fetchEmailHistory } = useEmailHistory();
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [emailDetail, setEmailDetail] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchEmailHistory();
  }, [fetchEmailHistory]);

  const handleViewDetails = async (historyItem) => {
    setDetailLoading(true);
    setSelectedEmail(historyItem);
    try {
      const detail = await emailHistoryApi.getEmailHistoryDetail(historyItem.id);
      setEmailDetail(detail);
      setDetailDialogOpen(true);
    } catch (err) {
      console.error("Failed to fetch email details:", err);
    } finally {
      setDetailLoading(false);
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

  // Filter history
  const filteredHistory = emailHistory.filter((item) =>
    [item.subject, item.sentTo, item.messagePreview]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const paginatedHistory = filteredHistory.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "primary.main" }}>
              📧 Email History
            </Typography>
            <IconButton
              onClick={fetchEmailHistory}
              disabled={loading}
              sx={{ bgcolor: "primary.main", color: "white", "&:hover": { bgcolor: "primary.dark" } }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          </motion.div>
        )}

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <TextField
            fullWidth
            placeholder="🔍 Search emails by subject, recipient, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </motion.div>

        {/* Empty State */}
        {filteredHistory.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                {searchTerm ? "No matching emails found" : "No email history yet"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Send your first bulk email to see it appear here 🚀"}
              </Typography>
            </Paper>
          </motion.div>
        ) : (
          <>
            {/* Table */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "primary.main" }}>
                      {["Subject", "Recipients", "Status", "Sent", "Date", "Actions"].map((col) => (
                        <TableCell key={col} sx={{ color: "white", fontWeight: "bold" }}>
                          {col}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedHistory.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <TableCell>
                          <Typography variant="subtitle2" noWrap sx={{ maxWidth: 200 }}>
                            {item.subject}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {item.sentTo}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={item.status} size="small" color={getStatusColor(item.status)} />
                        </TableCell>
                        <TableCell>
                          {item.sentCount}/{item.totalCount}
                        </TableCell>
                        <TableCell>{formatDate(item.sentAt)}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(item)}
                            disabled={detailLoading}
                            sx={{ color: "primary.main" }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(event, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            )}

            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Showing {paginatedHistory.length} of {filteredHistory.length} emails
            </Typography>
          </>
        )}

        {/* Detail Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="md"
          fullWidth
          TransitionProps={{ timeout: 500 }}
        >
          <DialogTitle>
            Email Details
            {selectedEmail && (
              <Chip label={selectedEmail.status} color={getStatusColor(selectedEmail.status)} sx={{ ml: 2 }} />
            )}
          </DialogTitle>
          <DialogContent dividers>
            {emailDetail ? (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Subject:</strong> {emailDetail.subject}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Sent:</strong> {emailDetail.formattedDate}
                </Typography>

                <Typography variant="body2" gutterBottom>
                  <strong>Recipients:</strong> {emailDetail.recipients.join(", ")}
                </Typography>

                <Typography variant="body2" gutterBottom>
                  <strong>Status:</strong> {emailDetail.sentCount}/{emailDetail.totalCount} sent
                </Typography>

                {emailDetail.failedEmails?.length > 0 && (
                  <Typography variant="body2" color="error" gutterBottom>
                    <strong>Failed:</strong> {emailDetail.failedEmails.join(", ")}
                  </Typography>
                )}

                <Box mt={2}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Message Content:</strong>
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, bgcolor: "grey.50", maxHeight: 300, overflow: "auto", borderRadius: 2 }}
                  >
                    <Typography variant="body2" whiteSpace="pre-wrap">
                      {emailDetail.message}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            ) : (
              <Box display="flex" justifyContent="center" py={3}>
                <CircularProgress />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailDialogOpen(false)} variant="contained" color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default EmailHistoryPage;
