import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Divider,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import {
  Bolt as GenerateIcon,
  ContentCopy as CopyIcon,
  AutoFixHigh as ImproveIcon,
  Check as CheckIcon,
  Psychology as AiIcon,
  AutoAwesome as MagicIcon,
  Clear as ClearIcon,
  Code as CodeIcon,
  Visibility as PreviewIcon,
} from '@mui/icons-material';
import { aiTemplateApi } from '../../services/aiTemplateApi';

// Custom Animated Icon Component for the Buttons
const AnimatedAIIcon = ({ animating, icon: IconComponent }) => (
    <Box 
        component="span" 
        sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: animating ? 'pulse-scale 1s infinite alternate' : 'none',
            '@keyframes pulse-scale': {
                '0%': { transform: 'scale(0.8)', opacity: 0.8 },
                '100%': { transform: 'scale(1.1)', opacity: 1 },
            },
            transition: 'transform 0.3s'
        }}
    >
        <IconComponent sx={{ fontSize: 20 }} />
    </Box>
);

const highlightHTMLTags = (html) => {
  return html.replace(/(&lt;\/?[a-zA-Z][a-zA-Z0-9]*\b[^&gt;]*&gt;)/g, '<span style="color: #61dafb;">$1</span>');
};

const AITemplateGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [improvementPrompt, setImprovementPrompt] = useState('');
  const [generatedTemplate, setGeneratedTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(0); 
  const [subTab, setSubTab] = useState(0); 
  const [aiStatus, setAiStatus] = useState('checking');

  const templateTypes = [
    { label: "Welcome Email", prompt: "professional welcome email for new users" },
    { label: "Thank You", prompt: "thank you email for registration" },
    { label: "Newsletter", prompt: "engaging newsletter template" },
    { label: "Promotion", prompt: "product promotion email" },
    { label: "Notification", prompt: "system notification email" }
  ];

  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); 
      await aiTemplateApi.healthCheck();
      setAiStatus('connected');
    } catch (err) {
      setAiStatus('disconnected');
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setGeneratedTemplate('');

    try {
      const response = await aiTemplateApi.generateTemplate(prompt);
      
      if (response.success) {
        setTimeout(() => {
            setGeneratedTemplate(response.template);
            setSuccess('Template generated successfully using Gemini AI!');
            setActiveTab(0);
            setLoading(false);
        }, 800);
      } else {
        setError(response.message || 'Failed to generate template');
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate template');
      setLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!generatedTemplate || !improvementPrompt.trim()) {
      setError('Please generate a template first and enter improvement instructions');
      return;
    }

    setImproving(true);
    setError('');

    try {
      const response = await aiTemplateApi.improveTemplate(generatedTemplate, improvementPrompt);
      
      if (response.success) {
         setTimeout(() => {
            setGeneratedTemplate(response.template);
            setSuccess('Template improved successfully using Gemini AI!');
            setImproving(false);
         }, 800);
      } else {
        setError(response.message || 'Failed to improve template');
        setImproving(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to improve template');
      setImproving(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  const handleClearPrompt = () => {
    setPrompt('');
    setError('');
    setSuccess('');
  };

  const handleUseTemplateType = (templatePrompt) => {
    setPrompt(templatePrompt);
  };

  const handleTemplateEdit = (newTemplate) => {
    setGeneratedTemplate(newTemplate);
  };

  const getAIStatusColor = () => {
    switch (aiStatus) {
      case 'connected': return 'success';
      case 'disconnected': return 'error';
      default: return 'warning';
    }
  };

  const getAIStatusText = () => {
    switch (aiStatus) {
      case 'connected': return 'Gemini AI Connected';
      case 'disconnected': return 'AI Service Unavailable';
      default: return 'Checking AI Status...';
    }
  };

  const aiPulse = {
    '@keyframes status-pulse': {
        '0%': { boxShadow: '0 0 0 0 rgba(102, 187, 106, 0.7)' },
        '70%': { boxShadow: '0 0 0 10px rgba(102, 187, 106, 0)' },
        '100%': { boxShadow: '0 0 0 0 rgba(102, 187, 106, 0)' },
    },
    animation: aiStatus === 'connected' ? 'status-pulse 2s infinite' : 'none',
  };

  const OUTPUT_MIN_HEIGHT = 500; 

  return (
    <Paper 
      elevation={8} 
      sx={{ 
        p: { xs: 2, md: 4 }, 
        maxWidth: 1400,
        mx: 'auto', 
        borderRadius: 3,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #eef1f5 100%)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, md: 4 } }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
          AI Template Generator
        </Typography>
        <Chip
          icon={<AiIcon />}
          label={getAIStatusText()}
          color={getAIStatusColor()}
          variant="outlined"
          sx={{ fontWeight: 500, p: 1, ...aiPulse, transition: 'all 0.3s' }}
        />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12} md={12}>
          <Card 
            elevation={6} 
            sx={{ 
              p: { xs: 1, md: 2 },
              borderRadius: 3,
              background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'all 0.4s ease-in-out',
              '&:hover': {
                  boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
                  transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
                Generate Template with Gemini AI
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 1, fontWeight: 500 }}>
                  Quick Templates:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {templateTypes.map((type, index) => (
                    <Chip
                      key={index}
                      label={type.label}
                      size="medium"
                      onClick={() => handleUseTemplateType(type.prompt)}
                      variant={prompt === type.prompt ? 'filled' : 'outlined'}
                      color={prompt === type.prompt ? 'primary' : 'default'}
                      sx={{ 
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                              bgcolor: 'primary.light',
                              color: 'white',
                              transform: 'scale(1.05) rotate(-1deg)',
                          }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Describe the email template you want"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                multiline
                rows={5}
                placeholder="e.g., Create a modern, professional welcome email for new users with a call-to-action button and a blue color scheme."
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AnimatedAIIcon animating={loading} icon={GenerateIcon} />}
                  onClick={handleGenerate}
                  disabled={loading || aiStatus === 'disconnected'}
                  sx={{ 
                      flexGrow: 1,
                      py: 1.8,
                      fontSize: '1.1rem',
                      bgcolor: 'primary.main',
                      '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-3px)', boxShadow: '0 6px 12px rgba(0,0,0,0.3)' },
                      transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? 'Generating with Gemini...' : 'Generate with Gemini AI'}
                </Button>
                 <Button
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={handleClearPrompt}
                    disabled={!prompt.trim()}
                    color="secondary"
                    sx={{
                        py: 1.8,
                        width: '150px',
                        transition: 'all 0.3s ease',
                    }}
                 >
                    Clear
                 </Button>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" gutterBottom color="secondary" sx={{ mt: 1, mb: 2 }}>
                Refine & Improve Template
              </Typography>

              <TextField
                fullWidth
                label="How would you like to improve it?"
                value={improvementPrompt}
                onChange={(e) => setImprovementPrompt(e.target.value)}
                multiline
                rows={4}
                placeholder="e.g., Make the tone more friendly, change the CTA to 'Get Started Now', or shorten the text by 20%."
                sx={{ mb: 2 }}
                disabled={!generatedTemplate || aiStatus === 'disconnected'}
              />

              <Button
                variant="outlined"
                color="secondary"
                startIcon={improving ? <CircularProgress size={20} color="inherit" /> : <AnimatedAIIcon animating={improving} icon={ImproveIcon} />}
                onClick={handleImprove}
                disabled={improving || !generatedTemplate || aiStatus === 'disconnected'}
                fullWidth
                sx={{ 
                    py: 1.5,
                    fontSize: '1rem',
                    '&:hover': { bgcolor: 'secondary.light', color: 'white' },
                    transition: 'all 0.3s ease',
                }}
              >
                {improving ? 'Improving with Gemini...' : 'Improve with Gemini AI'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={12}>
          <Card elevation={6} sx={{ height: '100%', borderRadius: 3, p: { xs: 1, md: 2 } }}>
            <CardContent sx={{ pb: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Generated Template Output
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={copied ? <CheckIcon /> : <CopyIcon />}
                  onClick={handleCopyToClipboard}
                  disabled={!generatedTemplate}
                  color={copied ? 'success' : 'primary'}
                  sx={{
                    transition: 'all 0.3s ease',
                    transform: copied ? 'scale(1.05) rotate(2deg)' : 'scale(1)',
                  }}
                >
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              </Box>

              <Tabs value={activeTab} 
                    onChange={(e, newValue) => {
                        setActiveTab(newValue);
                        if(newValue === 1) setSubTab(0);
                    }} 
                    sx={{ mb: 2 }}
              >
                <Tab label="Full Preview" icon={<PreviewIcon />} iconPosition="start" />
                <Tab label="Code & Edit" icon={<CodeIcon />} iconPosition="start" />
              </Tabs>

              <Box sx={{ minHeight: OUTPUT_MIN_HEIGHT, transition: 'min-height 0.3s ease' }}>
                {generatedTemplate ? (
                  <Box sx={{ animation: 'template-fade-in 0.8s forwards', '@keyframes template-fade-in': { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
                    
                    {activeTab === 0 && (
                      <Box sx={{ 
                        border: '1px solid #ddd', 
                        borderRadius: 1, 
                        p: 2, 
                        height: OUTPUT_MIN_HEIGHT - 60,
                        overflow: 'auto',
                        bgcolor: 'white',
                      }}>
                        <div dangerouslySetInnerHTML={{ __html: generatedTemplate }} />
                      </Box>
                    )}

                    {activeTab === 1 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={9}> {/* Increased from md=8 to md=9 for wider editor */}
                                <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                                    <Button size="small" variant={subTab === 0 ? 'contained' : 'outlined'} onClick={() => setSubTab(0)}>Code View</Button>
                                    <Button size="small" variant={subTab === 1 ? 'contained' : 'outlined'} onClick={() => setSubTab(1)}>Edit Code</Button>
                                </Box>
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={15}
                                  value={subTab === 0 ? highlightHTMLTags(generatedTemplate) : generatedTemplate}
                                  onChange={(e) => subTab === 1 && handleTemplateEdit(e.target.value)}
                                  InputProps={{
                                    readOnly: subTab === 0,
                                    style: { 
                                      fontFamily: 'monospace', 
                                      fontSize: '0.8rem',
                                      lineHeight: '1.4',
                                      backgroundColor: subTab === 0 ? '#272822' : '#282c34', 
                                      color: subTab === 0 ? '#f8f8f2' : '#ffffff',
                                      caretColor: subTab === 1 ? 'yellow' : 'white',
                                      border: subTab === 1 ? '1px solid #61dafb' : 'none',
                                      width: '100%',
                                    }
                                  }}
                                  sx={{
                                    width: '100%',
                                    '& .MuiInputBase-root': { 
                                        height: OUTPUT_MIN_HEIGHT - 60, 
                                        alignItems: 'flex-start',
                                        padding: '10px',
                                        width: '100%',
                                    },
                                  }}
                                  placeholder={subTab === 1 ? "Edit your HTML template here..." : "Code is Read-Only. Switch to Edit Code to modify."}
                                />
                            </Grid>

                            <Grid item xs={12} md={3}> {/* Reduced from md=4 to md=3 for narrower preview */}
                                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                                    Live Preview
                                </Typography>
                                <Box sx={{ 
                                    border: '1px solid #ddd', 
                                    borderRadius: 1, 
                                    p: 1, 
                                    height: OUTPUT_MIN_HEIGHT - 60,
                                    overflow: 'auto',
                                    bgcolor: 'white',
                                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                                }}>
                                    <div dangerouslySetInnerHTML={{ __html: generatedTemplate }} />
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: OUTPUT_MIN_HEIGHT,
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                    p: 3,
                    border: '2px dashed',
                    borderColor: aiStatus === 'disconnected' ? 'error.light' : 'primary.light',
                  }}>
                    <MagicIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2, animation: 'spin 10s linear infinite', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} />
                    <Typography variant="body2" color="textSecondary" align="center">
                      {aiStatus === 'disconnected' 
                        ? 'AI service is currently unavailable. Please check your connection or try again later.'
                        : 'Describe your email template and click "Generate with Gemini AI" to create a professional template.'
                      }
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: { xs: 2, md: 4 }, bgcolor: 'primary.lightest', borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            How to Use Gemini AI Template Generator
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>1. Describe Your Template:</strong> Use natural language to describe the email you need.<br/>
            <strong>2. Generate:</strong> Click "Generate with Gemini AI" to create a professional HTML template.<br/>
            <strong>3. Code & Edit:</strong> Use the **"Code & Edit"** tab to view your HTML. In **"Edit Code"** mode, changes automatically update the **Live Preview**.<br/>
            <strong>4. Copy Code:</strong> Use the template in your email system.<br/>
            <strong>5. Use Placeholders:</strong> Templates include dynamic placeholders like **{'{{name}}'}** and **{'{{email}}'}**.
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Powered by Google Gemini AI
          </Typography>
        </CardContent>
      </Card>
    </Paper>
  );
};

export default AITemplateGenerator;