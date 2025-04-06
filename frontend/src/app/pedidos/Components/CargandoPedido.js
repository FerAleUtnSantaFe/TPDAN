import { Typography, Container, Box } from "@mui/material";
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; // Ícono de camioncito
import { useEffect } from "react";

export const CargandoPedido = ({ onEnd }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onEnd(); // Avanza automáticamente al siguiente paso después de 3 segundos
        }, 3000);
        return () => clearTimeout(timer); // Limpia el temporizador al desmontar el componente
    }, [onEnd]);

    return (
        <Container sx={{ textAlign: 'center', marginTop: 5, position: 'relative', height: '200px' }}>
            {/* Camioncito */}
            <Box sx={{ position: 'absolute', bottom: 50, left: '10%', animation: 'drive 3s linear infinite' }}>
                <LocalShippingIcon sx={{ fontSize: 100, color: 'primary.main' }} />
            </Box>

            {/* Cajitas que caen */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 100,
                    left: '15%',
                    animation: 'fall 1.5s linear infinite',
                    backgroundColor: 'brown',
                    width: '30px',
                    height: '30px',
                    borderRadius: '4px',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 100,
                    left: '25%',
                    animation: 'fall 2s linear infinite',
                    backgroundColor: 'brown',
                    width: '40px',
                    height: '40px',
                    borderRadius: '4px',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 100,
                    left: '35%',
                    animation: 'fall 2.5s linear infinite',
                    backgroundColor: 'brown',
                    width: '50px',
                    height: '50px',
                    borderRadius: '4px',
                }}
            />

            {/* Texto */}
            <Typography variant="h4" color="primary" sx={{ marginTop: 2 }}>
                Cargando pedido...
            </Typography>

            {/* Animaciones */}
            <style>
                {`
                    @keyframes drive {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }

                    @keyframes fall {
                        0% { transform: translateY(0); opacity: 1; }
                        100% { transform: translateY(100px); opacity: 0; }
                    }
                `}
            </style>
        </Container>
    );
};