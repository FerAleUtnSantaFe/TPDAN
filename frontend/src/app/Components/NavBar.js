import MenuIcon from "@mui/icons-material/Menu";
import { SvgIcon } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation"; // Importar useRouter
import * as React from "react";
import Logo from "../../../public/Logo.svg";

const pages = ["clientes", "productos", "pedidos"];

function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const router = useRouter(); // Inicializar useRouter

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigation = (page) => {
    router.push(`/${page.toLowerCase()}`); // Navegar programáticamente
    handleCloseNavMenu(); // Cerrar el menú
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* LOGO (IZQUIERDA) */}
          <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
            <SvgIcon
              component={Logo}
              inheritViewBox
              sx={{ width: 40, height: 40, color: "inherit", ml: 0 }}
            />
            <Typography
              variant="h6"
              noWrap
              onClick={() => router.push("/")} // Navegar al inicio
              sx={{
                ml: 2,
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              UTN
            </Typography>
          </Box>

          {/* MENÚ HAMBURGUESA (MOBILE) */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" }, justifyContent: "flex-end" }}>
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
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleNavigation(page)}>
                  <Typography sx={{ textAlign: "center", width: "100%" }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* MENÚ PRINCIPAL (ESCRITORIO) */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "flex-end" }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleNavigation(page)} // Navegar programáticamente
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;