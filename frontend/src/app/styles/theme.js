"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#42A5F5", // Soft pastel blue
      light: "#90CAF9", // Lighter shade for hover effects
      dark: "#0D47A1", // Darker shade for contrast
      contrastText: "#FFFFFF", // White text for buttons and elements
    },
    secondary: {
      main: "#F48FB1", // Soft pastel pink
      light: "#F8BBD0", // Lighter shade for hover effects
      dark: "#AD1457", // Darker shade for contrast
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#3BD44F", // Soft pastel green
      light: "#B9FBC0",
      dark: "#388E3C",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#FFB74D", // Soft pastel orange
      light: "#FFE5B4",
      dark: "#F57C00",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#E65550", // Soft pastel red
      light: "#FFCDD2",
      dark: "#D32F2F",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F5F5F5", // Light gray background for the app
      paper: "#FFFFFF", // White background for cards and containers
    },
    text: {
      primary: "#212121", // Dark gray for primary text
      secondary: "#757575", // Medium gray for secondary text
    },
  },
  typography: {
    fontFamily: "'Lato', sans-serif", // Use Lato font globally
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#0D47A1", // Primary dark blue
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#0D47A1",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 700,
      color: "#0D47A1",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "#1976D2", // Primary blue
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#1976D2",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      color: "#1976D2",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      color: "#212121", // Primary text color
    },
    body2: {
      fontSize: "0.9rem",
      fontWeight: 400,
      color: "#757575", // Secondary text color
    },
    button: {
      fontSize: "1rem",
      fontWeight: 600,
      textTransform: "uppercase",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // Rounded corners for buttons
          textTransform: "none", // Disable uppercase text
          padding: "10px 20px", // Add padding for a modern look
        },
        containedPrimary: {
          backgroundColor: "#42A5F5",
          "&:hover": {
            backgroundColor: "#90CAF9", // Lighter shade on hover
          },
        },
        containedSecondary: {
          backgroundColor: "#F48FB1",
          "&:hover": {
            backgroundColor: "#F8BBD0", // Lighter shade on hover
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px", // Rounded corners for cards and containers
          padding: "6px 0px", // Add padding for a clean layout
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0D47A1", // Dark blue for the app bar
          color: "#FFFFFF", // White text
        },
      },
    },
  },
});