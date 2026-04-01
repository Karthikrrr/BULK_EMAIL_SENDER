import { Button, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Redirect to backend OAuth2 endpoint
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        fullWidth
        variant="outlined"
        onClick={handleGoogleLogin}
        startIcon={<GoogleIcon />}
        sx={{
          py: 1.5,
          borderColor: '#DB4437',
          color: '#DB4437',
          '&:hover': {
            borderColor: '#DB4437',
            backgroundColor: 'rgba(219, 68, 55, 0.04)',
          },
        }}
      >
        Continue with Google
      </Button>
    </Box>
  );
};

export default GoogleLoginButton;