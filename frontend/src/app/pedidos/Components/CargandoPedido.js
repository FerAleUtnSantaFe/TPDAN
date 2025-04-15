import { Typography, Container, Box } from "@mui/material";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useEffect } from "react";

export const CargandoPedido = ({ onEnd }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onEnd();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onEnd]);

    return (
        <Container sx={{ textAlign: 'center', marginTop: 5, height: '300px', position: 'relative', overflow: 'hidden' }}>
            {/* Camión */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 80,
                    left: 0,
                    animation: 'drive 4s linear forwards',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <LocalShippingIcon sx={{ fontSize: 80, color: 'primary.main' }} />
            </Box>

            {/* Cajitas que caen */}
            {[...Array(3)].map((_, i) => (
                <Box
                    key={i}
                    sx={{
                        position: 'absolute',
                        bottom: 140,
                        left: `${20 + i * 10}%`,
                        animation: `fall${i} 4s ease-in-out forwards`,
                        animationDelay: `${i * 0.5}s`,
                        backgroundColor: 'saddlebrown',
                        width: `${30 + i * 5}px`,
                        height: `${30 + i * 5}px`,
                        borderRadius: '4px',
                        opacity: 0,
                    }}
                />
            ))}

            {/* Contenedor donde caen los paquetes */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 40,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%',
                    height: '20px',
                    backgroundColor: '#ccc',
                    borderRadius: '10px',
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
                        100% { transform: translateX(110%); }
                    }

                    @keyframes fall0 {
                        0% { transform: translateY(0); opacity: 0; }
                        30% { opacity: 1; }
                        100% { transform: translateY(80px); opacity: 1; }
                    }

                    @keyframes fall1 {
                        0% { transform: translateY(0); opacity: 0; }
                        40% { opacity: 1; }
                        100% { transform: translateY(80px); opacity: 1; }
                    }

                    @keyframes fall2 {
                        0% { transform: translateY(0); opacity: 0; }
                        50% { opacity: 1; }
                        100% { transform: translateY(80px); opacity: 1; }
                    }
                `}
            </style>
        </Container>
    );
};
