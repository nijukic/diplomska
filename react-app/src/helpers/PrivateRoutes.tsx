import { useContext, useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { Box, Container, CssBaseline, LinearProgress } from "@mui/material";

const PrivateRoutes = () => {
  const { isAuthenticated, checkAuth } = useContext(AuthContext);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setIsCheckingAuth(false);
    };

    verifyAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <LinearProgress color="primary" />
          </Box>
        </Box>
      </Container>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
