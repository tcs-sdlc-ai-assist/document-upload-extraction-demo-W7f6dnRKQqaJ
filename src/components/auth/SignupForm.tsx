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
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '@/src/contexts/AuthContext';
import { useSnackbar } from '@/src/contexts/SnackbarContext';
import { ROUTES, APP_NAME } from '@/src/lib/constants';

interface SignupFormProps {
  onNavigate?: (path: string) => void;
}

function SignupForm({ onNavigate }: SignupFormProps) {
  const { signup } = useAuth();
  const { showSuccess, showError } = useSnackbar();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = (): boolean => {
    const newErrors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      newErrors.username = 'Username is required';
    } else if (trimmedUsername.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (trimmedUsername.length > 32) {
      newErrors.username = 'Username must be at most 32 characters';
    } else if (!/^[a-zA-Z0-9]+$/.test(trimmedUsername)) {
      newErrors.username = 'Username must be alphanumeric';
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const result = await signup(username.trim(), email.trim().toLowerCase(), password);

      if (result.success) {
        showSuccess('Account created successfully!');
        if (onNavigate) {
          onNavigate(ROUTES.DASHBOARD);
        }
      } else {
        showError(result.error || 'Signup failed. Please try again.');
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

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleNavigateToLogin = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (onNavigate) {
      onNavigate(ROUTES.LOGIN);
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
            Create a new account
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Signup form"
        >
          <TextField
            id="signup-username"
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
            id="signup-email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            margin="normal"
            autoComplete="email"
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
            inputProps={{
              'aria-label': 'Email',
              'aria-required': true,
            }}
          />

          <TextField
            id="signup-password"
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
            autoComplete="new-password"
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

          <TextField
            id="signup-confirm-password"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }
            }}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            fullWidth
            margin="normal"
            autoComplete="new-password"
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
                    onClick={handleToggleConfirmPasswordVisibility}
                    edge="end"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    disabled={loading}
                    size="small"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            inputProps={{
              'aria-label': 'Confirm Password',
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
                <PersonAddIcon />
              )
            }
            sx={{ mt: 3, mb: 2 }}
            aria-label="Sign up"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                href={ROUTES.LOGIN}
                onClick={handleNavigateToLogin}
                underline="hover"
                sx={{ fontWeight: 600, cursor: 'pointer' }}
                aria-label="Sign in to your account"
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default SignupForm;