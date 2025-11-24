import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#45bfbf",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#387D23",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#111111",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: "#cc6633",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "transform 0.2s ease, color 0.2s ease",
          "&:hover": {
            transform: "scale(1.1)",
            color: "#cc6633",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: "outlined",
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          transition: "color 0.2s ease",
          color: "#45bfbf",
          fontWeight: 600,
          textDecoration: "none",
          "&:hover": {
            color: "#cc6633",
          },
        },
      },
    },
  },
});

export default theme;
