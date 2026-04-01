// components/layout/MainLayout.js - FIXED
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ExitToApp as LogoutIcon,
  Email as EmailIcon,
  History as HistoryIcon,
  AutoAwesome as AiIcon,
  Email,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 240;

const MainLayout = ({ children }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/", show: true },
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      show: true,
    },
    {
      text: "Simple Bulk Email",
      icon: <EmailIcon />,
      path: "/bulk-email",
      show: true,
    },
    {
      text: "Template Bulk Email",
      icon: <EmailIcon />,
      path: "/template-bulk-email",
      show: true,
    },
    {
      text: "AI Template Generator",
      icon: <AiIcon />,
      path: "/ai-templates",
      show: true,
    },
    {
      text: "Email History",
      icon: <HistoryIcon />,
      path: "/email-history",
      show: true,
    },
    {
      text: "Users",
      icon: <PeopleIcon />,
      path: "/users",
      show: user?.role === "ROLE_ADMIN",
    },
    // Logout is handled separately
  ];

  const isActive = (path) => location.pathname === path;

  const DrawerContent = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar />
      <List>
        {menuItems.map(
          (item) =>
            item.show && (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={isActive(item.path)}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": { backgroundColor: "primary.dark" },
                  },
                  "&.Mui-selected .MuiListItemIcon-root": { color: "white" },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            )
        )}

        {/* Logout item */}
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {/* Hamburger for mobile */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleMobileDrawer}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bulk Mail Sender
          </Typography>

          <Button color="inherit" onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile */}
      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={toggleMobileDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        {DrawerContent}
      </Drawer>

      {/* Drawer for desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        open
      >
        {DrawerContent}
      </Drawer>

      {/* Page content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
