import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import {
  Upload as UploadIcon,
  Send as SendIcon,
  Visibility as PreviewIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";

import { emailApi } from "../../services/api"; // ✅ only use emailApi

const TemplateBulkEmail = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [excelFile, setExcelFile] = useState(null);
  const [subject, setSubject] = useState("");
  const [htmlTemplate, setHtmlTemplate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const steps = ["Upload Excel", "Compose Email", "Review & Send"];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (
        file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setError("Please upload a valid Excel file (.xlsx)");
        return;
      }
      setExcelFile(file);
      setError("");
      setActiveStep(1);
    }
  };

  const handlePreview = async () => {
    if (!excelFile || !htmlTemplate.trim()) {
      setError("Please upload Excel file and enter template first");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("excelFile", excelFile);
      formData.append("subject", subject);
      formData.append("htmlTemplate", htmlTemplate);
      formData.append("templateName", "preview");

      const response = await emailApi.previewTemplate(formData);

      setPreview(response.preview);
      setError("");
    } catch (err) {
      console.error("Preview error:", err);
      setError(err.response?.data?.error || "Failed to generate preview");
    } finally {
      setLoading(false);
    }
  };

  const handleSendBulkEmails = async () => {
    if (!excelFile || !subject.trim() || !htmlTemplate.trim()) {
      setError("Please complete all required fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("excelFile", excelFile);
      formData.append("subject", subject);
      formData.append("htmlTemplate", htmlTemplate);
      formData.append("templateName", "bulk-email");

      const response = await emailApi.sendBulkWithTemplate(formData);

      setResult(response);
      setSuccess(response.message || "Bulk emails sent successfully!");
      setActiveStep(3);
    } catch (err) {
      console.error("Bulk email error:", err);
      setError(err.response?.data?.message || "Failed to send bulk emails");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setExcelFile(null);
    setSubject("");
    setHtmlTemplate("");
    setPreview("");
    setError("");
    setSuccess("");
    setResult(null);
    setActiveStep(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sampleTemplate = `<!DOCTYPE html>
<html>
<body>
  <h2>Hello {name}!</h2>
  <p>We're excited to share this message with you: {message}</p>
  <p>Your email: {email}</p>
  <p>Best regards,<br>Team</p>
</body>
</html>`;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h4" gutterBottom color="primary">
        Bulk Email with Templates
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      )}

      {/* Step 1: Upload Excel */}
      {activeStep === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Step 1: Upload Excel File
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Upload an Excel file with columns like: name, email, message, etc.
            Use these column names as placeholders in your template: {"{name}"},
            {" {email}"}, {" {message}"}
          </Typography>

          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadIcon />}
            sx={{ mb: 2 }}
          >
            Upload Excel File
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
          </Button>

          {excelFile && (
            <Box sx={{ mt: 2 }}>
              <Chip
                icon={<DescriptionIcon />}
                label={excelFile.name}
                onDelete={() => setExcelFile(null)}
              />
            </Box>
          )}
        </Box>
      )}

      {/* Step 2: Compose Email */}
      {activeStep === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Step 2: Compose Email Template
          </Typography>

          <TextField
            fullWidth
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="HTML Template"
            value={htmlTemplate}
            onChange={(e) => setHtmlTemplate(e.target.value)}
            margin="normal"
            multiline
            rows={10}
            required
            placeholder={`Enter your HTML template with placeholders like {name}, {email}, etc.`}
            helperText="Use {column_name} placeholders that match your Excel columns"
          />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={handlePreview}
              disabled={loading}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              onClick={() => setActiveStep(2)}
              disabled={!subject || !htmlTemplate}
            >
              Next: Review
            </Button>
          </Box>

          {preview && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Template Preview
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <div dangerouslySetInnerHTML={{ __html: preview }} />
              </Paper>
            </Box>
          )}
        </Box>
      )}

      {/* Step 3: Review & Send */}
      {activeStep === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Step 3: Review & Send
          </Typography>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Subject:</strong> {subject}
              </Typography>
              <Typography variant="body2">
                <strong>Recipients:</strong> {excelFile?.name} (Excel file)
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" onClick={() => setActiveStep(1)}>
              Back
            </Button>
            <Button
              variant="contained"
              startIcon={
                loading ? <CircularProgress size={20} /> : <SendIcon />
              }
              onClick={handleSendBulkEmails}
              disabled={loading}
            >
              Send Bulk Emails
            </Button>
          </Box>
        </Box>
      )}

      {/* Results Step */}
      {activeStep === 3 && result && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Sending Results
          </Typography>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body1" gutterBottom>
                <strong>Total Emails:</strong> {result.totalEmails}
              </Typography>
              <Typography variant="body1" gutterBottom color="success.main">
                <strong>Sent Successfully:</strong> {result.sentEmails}
              </Typography>
              <Typography variant="body1" gutterBottom color="error.main">
                <strong>Failed:</strong> {result.failedEmails}
              </Typography>
            </CardContent>
          </Card>

          {result.failedEmailAddresses &&
            result.failedEmailAddresses.length > 0 && (
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="body2" gutterBottom>
                    <strong>Failed Emails:</strong>
                  </Typography>
                  {result.failedEmailAddresses.map((email, index) => (
                    <Chip
                      key={index}
                      label={email}
                      size="small"
                      color="error"
                      variant="outlined"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </CardContent>
              </Card>
            )}

          <Button variant="contained" onClick={resetForm}>
            Send Another Batch
          </Button>
        </Box>
      )}

      {/* Template Examples */}
      {activeStep === 1 && (
        <Box sx={{ mt: 4 }}>
          <Divider />
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Template Examples
          </Typography>

          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography
                variant="body2"
                sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}
              >
                {sampleTemplate}
              </Typography>
              <Button
                size="small"
                onClick={() => setHtmlTemplate(sampleTemplate)}
                sx={{ mt: 1 }}
              >
                Use This Template
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}
    </Paper>
  );
};

export default TemplateBulkEmail;
