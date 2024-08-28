import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { Box, Container, CssBaseline, LinearProgress } from "@mui/material";

const AdminRoute = () => {
  const { vlogaUporabnika, checkAuth } = useContext(AuthContext);
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
      <Container component="main" maxWidth="xs" disableGutters>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <LinearProgress color="primary" />
          </Box>
        </Box>
      </Container>
    );
  }

  if (vlogaUporabnika !== "admin") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;
