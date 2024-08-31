import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import logoImage from "../assets/potniski_logo_obrezan.svg";
import backgroundSlika from "../assets/ozadje.jpg";
import {
  Alert,
  Autocomplete,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";
import MenuDrawer from "../components/MenuDrawer";

interface customerNumberValue {
  label: number;
}

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [customerNumber, setCustomerNumber] =
    useState<customerNumberValue | null>(null);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [customerNumberError, setCustomerNumberError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showCustomerNumbers, setShowCustomerNumbers] = useState(false);
  const [customerNumbers, setCustomerNumbers] = useState([]);

  const submitSignUp = () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (validateForm()) {
      axios
        .post("http://localhost:3001/user/signUp", {
          uporabniskoImeUporabnika: username,
          gesloUporabnika: password,
          vlogaUporabnika: role,
          stevilkaStranke:
            customerNumber?.label == null
              ? null
              : Number(customerNumber?.label),
        })
        .then((response) => {
          setSuccessMessage(response.data);
        })
        .catch((error) => {
          setErrorMessage(error.response.data);
        });
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (username.trim() === "") {
      setUsernameError("Uporabniško ime je obvezno");
      isValid = false;
    } else {
      if (!/^[a-z0-9]+$/i.test(username)) {
        setUsernameError("Uporabniško ime je neustrezno");
        isValid = false;
      } else {
        setUsernameError("");
      }
    }
    if (password.trim() === "") {
      setPasswordError("Geslo je obvezno");
      isValid = false;
    } else {
      if (!/^[a-z0-9]+$/i.test(password)) {
        setPasswordError("Geslo je neustrezno");
        isValid = false;
      } else {
        setPasswordError("");
      }
    }
    if (role === "") {
      setRoleError("Izbor vloge je obvezen");
      isValid = false;
    } else {
      setRoleError("");
    }
    if (showCustomerNumbers) {
      if (customerNumber == null) {
        setCustomerNumberError("Izbor številke stranke je obvezen");
        isValid = false;
      } else {
        setCustomerNumberError("");
      }
    }
    return isValid;
  };

  useEffect(() => {
    setCustomerNumber(null);
    const getAllCustomers = async () => {
      if (role == "stranka") {
        try {
          const allCustomers = await axios.get(
            "http://localhost:3001/user/allCustomers",
            {}
          );
          setCustomerNumbers(allCustomers.data);
          setShowCustomerNumbers(true);
        } catch (error) {
          console.error("Customers could not be fetched", error);
        }
      } else {
        setShowCustomerNumbers(false);
      }
    };

    getAllCustomers();
  }, [role]);

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundSlika})`,
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ backgroundColor: "white" }}>
        {" "}
        <MenuDrawer></MenuDrawer>
      </Box>

      <Container
        component="main"
        sx={{
          pt: 20,
          borderRadius: 20,
          width: "42vw",
          maxWidth: "600px",
          minWidth: "400px",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 3,
            mx: 1,
          }}
        >
          <Box
            mt={3}
            component="img"
            src={logoImage}
            alt="Logotip Slovenskih Železnic"
            sx={{ width: 80, height: 80, mb: 2 }}
          />
          <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
            Registracija uporabnikov
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{
              mt: 3,
              width: "35vw",
              maxWidth: "450px",
              minWidth: "300px",
            }}
          >
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  error={usernameError !== ""}
                  helperText={usernameError !== "" ? usernameError : ""}
                  margin="normal"
                  fullWidth
                  id="username"
                  label="Uporabniško ime"
                  name="username"
                  autoComplete="off"
                  autoFocus
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={passwordError !== ""}
                  helperText={passwordError !== "" ? passwordError : ""}
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Geslo"
                  type="password"
                  id="password"
                  autoComplete="off"
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} mt={2}>
                <FormControl fullWidth>
                  <Select
                    error={roleError !== ""}
                    labelId="role-select"
                    name="role"
                    value={role}
                    onChange={(event) => {
                      setRole(event.target.value);
                    }}
                  >
                    <MenuItem value="stranka">Stranka</MenuItem>
                    <MenuItem value="zaposleni">Zaposleni</MenuItem>
                  </Select>
                  <FormHelperText>
                    {roleError !== "" ? roleError : "Izberite vlogo"}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {showCustomerNumbers && (
                <Grid item xs={12} mt={2}>
                  <FormControl fullWidth>
                    <Autocomplete
                      onChange={(
                        event: any,
                        newValue: customerNumberValue | null
                      ) => {
                        if (newValue !== null) {
                          setCustomerNumber(newValue);
                        } else {
                          setCustomerNumber(null);
                        }
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.label === value.label
                      }
                      disablePortal
                      id="stevilkaStranke"
                      options={customerNumbers}
                      renderInput={(params) => (
                        <TextField {...params} label="Številka stranke" />
                      )}
                    />
                    <FormHelperText>
                      {passwordError !== ""
                        ? customerNumberError
                        : "Izberite številko stranke"}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              )}
            </Grid>
            <Button
              onClick={submitSignUp}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Usvari
            </Button>
            <Grid item xs={12} sx={{ mb: 3 }}>
              {successMessage && (
                <Alert
                  onClose={() => {
                    setSuccessMessage("");
                  }}
                  severity="success"
                >
                  {successMessage}
                </Alert>
              )}
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
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
