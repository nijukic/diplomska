import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import {
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Fade,
} from "@mui/material";
import ThemeSwitch from "./ThemeSwitch";
import MenuIcon from "@mui/icons-material/Menu";

function MenuDrawer() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { vlogaUporabnika, isAuthenticated, themeMode, setThemeMode, logout } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThemeMode(!event.target.checked);
    const theme = !themeMode ? "light" : "dark";
    localStorage.setItem("themeMode", theme);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleClose();
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ position: "absolute", zIndex: "tooltip" }}>
      <IconButton onClick={handleClick} color="primary">
        <MenuIcon fontSize="large" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {isAuthenticated ? (
          <Box>
            <Container>
              <MenuItem
                component={Link}
                to="/"
                onClick={handleClose}
                sx={{ borderBottom: "3px solid #009edd" }}
              >
                <Typography sx={{ mx: "auto" }} variant="h6">
                  Domov
                </Typography>
              </MenuItem>
            </Container>
            {vlogaUporabnika === "admin" && (
              <Container>
                <MenuItem
                  sx={{ borderBottom: "3px solid #009edd" }}
                  component={Link}
                  to="/signUp"
                  onClick={handleClose}
                >
                  <Typography sx={{ mx: "auto" }} variant="h6">
                    Registracija
                  </Typography>
                </MenuItem>
              </Container>
            )}
            <Container>
              <MenuItem
                onClick={handleLogout}
                sx={{ borderBottom: "3px solid #009edd" }}
              >
                <Typography sx={{ mx: "auto" }} variant="h6">
                  Odjava
                </Typography>
              </MenuItem>
            </Container>
          </Box>
        ) : (
          <MenuItem component={Link} to="/login" onClick={handleClose}>
            <Container>
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ mx: "auto" }} variant="h6">
                  Prijava
                </Typography>
              </Box>
            </Container>
          </MenuItem>
        )}
        <Container>
          <MenuItem
            disableRipple
            sx={{
              "&:hover": {
                backgroundColor: "transparent",
              },
              cursor: "default",
            }}
          >
            <ThemeSwitch
              sx={{ mx: "auto" }}
              checked={!themeMode}
              onChange={handleChange}
            />
          </MenuItem>
        </Container>
      </Menu>
    </Box>
  );
}

export default MenuDrawer;
