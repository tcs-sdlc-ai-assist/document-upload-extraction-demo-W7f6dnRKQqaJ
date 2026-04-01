'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '@/src/contexts/AuthContext';
import { useSnackbar } from '@/src/contexts/SnackbarContext';
import { ROUTES, APP_NAME } from '@/src/lib/constants';

interface LoginFormProps {
  onNavigate?: (path: string) => void;
}

function LoginForm({ onNavigate }: LoginFormProps) {
  const { login } = useAuth();
  const { showSuccess, showError } = useSnackbar();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { username?: string; password?: string } = {};

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      newErrors.username = 'Username is required';
    } else if (trimmedUsername.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(username.trim(), password);

      if (result.success) {
        showSuccess('Login successful!');
        if (onNavigate) {
          onNavigate(ROUTES.DASHBOARD);
        }
      } else {
        showError(result.error || 'Login failed. Please try again.');
      }
    } catch {
      showError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleNavigateToRegister = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (onNavigate) {
      onNavigate(ROUTES.REGISTER);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 2,
        backgroundColor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4 },
          maxWidth: 440,
          width: '100%',
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, mb: 0.5 }}
          >
            {APP_NAME}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to your account
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Login form"
        >
          <TextField
            id="login-username"
            label="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) {
                setErrors((prev) => ({ ...prev, username: undefined }));
              }
            }}
            error={!!errors.username}
            helperText={errors.username}
            fullWidth
            margin="normal"
            autoComplete="username"
            autoFocus
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon color="action" />
                </InputAdornment>
              ),
            }}
            inputProps={{
              'aria-label': 'Username',
              'aria-required': true,
            }}
          />

          <TextField
            id="login-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            margin="normal"
            autoComplete="current-password"
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={loading}
                    size="small"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            inputProps={{
              'aria-label': 'Password',
              'aria-required': true,
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <LoginIcon />
              )
            }
            sx={{ mt: 3, mb: 2 }}
            aria-label="Sign in"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don&apos;t have an account?{' '}
              <Link
                href={ROUTES.REGISTER}
                onClick={handleNavigateToRegister}
                underline="hover"
                sx={{ fontWeight: 600, cursor: 'pointer' }}
                aria-label="Sign up for a new account"
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginForm;