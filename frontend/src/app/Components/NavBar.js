"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Button, Menu, MenuItem, Container } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";
import Logo from "../../../public/Logo.svg";
import { SvgIcon } from "@mui/material";
import Cookies from "js-cookie";

const pages = ["Clientes", "Productos", "Pedidos"];

export default function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const router = useRouter();

  // Check if the user is authenticated by looking for the authToken in cookies
  //const isAuthenticated = !!Cookies.get("authToken");
  const isAuthenticated = true;

  // Handlers for navigation menu
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigation = (page) => {
    router.push(`/${page.toLowerCase()}`);
    handleCloseNavMenu();
  };

  // Handlers for user menu
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogOut = () => {
    Cookies.remove("authToken"); // Remove the auth token
    router.push("/"); // Redirect to login page
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#0D47A1", borderRadius: 0 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo and Title */}
          <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => router.push("/")}>
            <SvgIcon
              component={Logo}
              inheritViewBox
              sx={{ width: 40, height: 40, color: "inherit", marginRight: 1 }}
            />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              UTN SANTA FE
            </Typography>
          </Box>

          {/* Desktop Navigation Links */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" }, // Hidden on small screens
              justifyContent: "center",
            }}
          >
            {isAuthenticated &&
              pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handleNavigation(page)}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    fontWeight: 600,
                    textTransform: "capitalize",
                    "&:hover": {
                      backgroundColor: "#1976D2",
                    },
                  }}
                >
                  {page}
                </Button>
              ))}
          </Box>

          {/* Mobile Navigation Links */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" }, // Visible only on small screens
              justifyContent: "flex-end",
            }}
          >
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {isAuthenticated &&
                pages.map((page) => (
                  <MenuItem key={page} onClick={() => handleNavigation(page)}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              {isAuthenticated && (
                <MenuItem onClick={handleLogOut}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AccountCircleIcon sx={{ marginRight: 1 }} />
                    <Typography textAlign="center">Log Out</Typography>
                  </Box>
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* User Menu for Desktop */}
          {isAuthenticated && (
            <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, color: "white" }}>
                <AccountCircleIcon fontSize="large" />
              </IconButton>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleLogOut}>
                  <Typography textAlign="center">Log Out</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}