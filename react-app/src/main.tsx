import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#009edd",
      light: "#7fd0f7",
      dark: "#015194",
      contrastText: "#fff",
    },
    secondary: {
      main: "#015194",
    },
    success: {
      main: "#388e3c",
    },
    info: {
      main: "#6b2bcc",
    },
    error: {
      main: "#6F2211",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
