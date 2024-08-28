import { useContext, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import trainImage from "../assets/opcija4.jpg";
import logoImage from "../assets/potniski_logo_obrezan.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import { AuthContext } from "../helpers/AuthContext";

export default function SignInSide() {
  const [username, setUsername] = useState(
    localStorage.getItem("username") ?? ""
  );
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState<boolean>(
    localStorage.getItem("username") !== null
  );
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/"); // Redirect to home if already authenticated
    return null;
  }

  const submitLogin = () => {
    setErrorMessage("");
    if (validateForm()) {
      axios
        .post(
          "http://localhost:3001/user/login",
          {
            uporabniskoImeUporabnika: username,
            gesloUporabnika: password,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          login(
            response.data.accessToken,
            {
              idUporabnika: response.data.idUporabnika,
              uporabniskoImeUporabnika: response.data.uporabniskoImeUporabnika,
              vlogaUporabnika: response.data.vlogaUporabnika,
              idStrankeUporabnika: response.data.idStrankeUporabnika,
            },
            rememberMe
          );
          navigate("/");
        })
        .catch((error) => {
          setErrorMessage(error.response.data);
        });
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (username.trim() === "") {
      setUsernameError("Username is required");
      isValid = false;
    } else {
      if (!/^[a-z0-9]+$/i.test(username)) {
        setUsernameError("Username in invalid");
        isValid = false;
      } else {
        setUsernameError("");
      }
    }
    if (password.trim() === "") {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      if (!/^[a-z0-9]+$/i.test(password)) {
        setPasswordError("Password in invalid");
        isValid = false;
      } else {
        setPasswordError("");
      }
    }
    return isValid;
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${trainImage})`,

          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "left",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            mt: 20,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={logoImage}
            alt="Logotip Slovenskih Železnic"
            sx={{ width: 80, height: 80, mb: 2 }}
          />
          <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
            Prijava v račun
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={submitLogin}
            sx={{ mt: 1 }}
          >
            <TextField
              error={usernameError != ""}
              helperText={usernameError != "" ? usernameError : ""}
              margin="normal"
              fullWidth
              value={username}
              id="username"
              label="Uporabniško ime"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <TextField
              error={passwordError != ""}
              helperText={passwordError != "" ? passwordError : ""}
              margin="normal"
              fullWidth
              name="password"
              label="Geslo"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={() => {
                    setRememberMe(!rememberMe);
                  }}
                  color="primary"
                />
              }
              label="Zapomni si me"
            />
            <Button
              onClick={submitLogin}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Prijava
            </Button>
            <Grid container>
              <Grid item xs={12}>
                {errorMessage && (
                  <Alert
                    onClose={() => {
                      setErrorMessage("");
                    }}
                    severity="error"
                  >
                    {errorMessage}
                  </Alert>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
