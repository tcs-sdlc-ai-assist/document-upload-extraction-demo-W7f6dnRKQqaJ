'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { APP_NAME } from '@/src/lib/constants';
import { useAuth } from '@/src/contexts/AuthContext';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position="sticky" component="header" role="banner">
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          px: { xs: 1, sm: 2 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <DescriptionIcon aria-hidden="true" />
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            component="h1"
            sx={{
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            {APP_NAME}
          </Typography>
        </Box>

        {isAuthenticated && user && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 2 },
            }}
          >
            <Chip
              icon={<AccountCircleIcon />}
              label={user.username}
              color="primary"
              variant="outlined"
              sx={{
                color: 'primary.contrastText',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '& .MuiChip-icon': {
                  color: 'primary.contrastText',
                },
                display: { xs: 'none', sm: 'inline-flex' },
              }}
              aria-label={`Logged in as ${user.username}`}
            />

            {isMobile ? (
              <IconButton
                color="inherit"
                onClick={handleLogout}
                aria-label="Logout"
                size="medium"
              >
                <LogoutIcon />
              </IconButton>
            ) : (
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                aria-label="Logout"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;