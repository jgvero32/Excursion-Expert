import { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Link as MuiLink } from '@mui/material';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/authContext';
import "./Login.scss";

type LocationState = { redirectedFrom: string };

export function Login() {
  const { logIn, authenticated, authError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const locationState = location.state as LocationState;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData(event.currentTarget);
      const username = data.get("username")?.toString();
      const password = data.get("password")?.toString();

      if (username && password) {
        await logIn(username, password);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authenticated) {
    return <Navigate to={locationState?.redirectedFrom || "/start-an-adventure"} />;
  }

  return (
    <div className='login'>
      <Box className="login-container">
        <Typography variant="h4" className="login-title">
          Log in
        </Typography>
        <Box component="form" className="login-form" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            placeholder="Enter your username here"
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password here"
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          {authError && (
            <Typography color="error" style={{ marginBottom: '10px' }}>
              {authError}
            </Typography>
          )}
          <Box className="submit-group" textAlign="center">
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Log In"}
            </Button>
          </Box>
          <Typography className="link" style={{ marginTop: '15px' }}>
            Don't have an account?{' '}
            <MuiLink component={Link} to="/register" underline="hover">
              Register here
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
