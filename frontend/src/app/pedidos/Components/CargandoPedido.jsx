import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useEffect } from "react";

export const CargandoPedido = ({ onEnd }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onEnd();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onEnd]);

  return (
    <Container
      maxWidth="false"
      disableGutters
      sx={{
        height: "50vh",
        background: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: 320,
          height: 320,
          borderRadius: "24px",
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          p: 3,
          textAlign: "center",
        }}
      >
        <CircularProgress color="primary" size={48} thickness={4} />
        <Typography variant="h6" sx={{ color: "#1e293b", fontWeight: 600 }}>
          Procesando pedido
        </Typography>
        <Typography variant="body2" sx={{ color: "#334155" }}>
          Estamos cargando los datos, por favor espera unos segundos.
        </Typography>
      </Box>
    </Container>
  );
};
