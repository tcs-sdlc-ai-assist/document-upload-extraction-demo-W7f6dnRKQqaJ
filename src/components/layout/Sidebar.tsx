'use client';

import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import HistoryIcon from '@mui/icons-material/History';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { ROUTES } from '@/src/lib/constants';
import { useAuth } from '@/src/contexts/AuthContext';

const DRAWER_WIDTH = 240;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: <DashboardIcon />,
  },
  {
    label: 'Upload',
    path: ROUTES.UPLOAD,
    icon: <UploadFileIcon />,
  },
  {
    label: 'History',
    path: ROUTES.DOCUMENTS,
    icon: <HistoryIcon />,
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  activePath?: string;
  onNavigate?: (path: string) => void;
}

function Sidebar({ open, onClose, activePath = '', onNavigate }: SidebarProps) {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
    if (!isDesktop) {
      onClose();
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {!isDesktop && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: 1,
              py: 0.5,
            }}
          >
            <IconButton onClick={onClose} aria-label="Close navigation menu">
              <ChevronLeftIcon />
            </IconButton>
          </Box>
          <Divider />
        </>
      )}
      {isDesktop && <Toolbar />}
      <List>
        {NAV_ITEMS.map((item) => {
          const isActive = activePath === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigate(item.path)}
                aria-current={isActive ? 'page' : undefined}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  if (isDesktop) {
    return (
      <Drawer
        variant="permanent"
        open
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export default Sidebar;