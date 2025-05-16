'use client';

import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Card, CardContent, Fade } from '@mui/material';
import { validateAuth } from '../APIs/LoginAPI';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleLogin = async () => {
        setError('');
        setSuccess(false);

        if (!username || !password) {
            setError('Usuario y contraseña son obligatorios');
            return;
        }
        try {
            await validateAuth({ username, password });
            setSuccess(true);
        } catch (err) {
            setError('Usuario o contraseña incorrectos');
        }
    };

    return (
        <Fade in={true}>
            <Card
                elevation={3}
                sx={{
                    width: '80%',
                    maxWidth: 400,
                    padding: 3,
                    borderRadius: 2,
                    top: '20%',
                    minHeight: success ? 320 : 0, // Make card bigger on success
                    transition: 'min-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <CardContent>
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            textAlign: 'center',
                            fontWeight: 700,
                            color: '#0D47A1',
                        }}
                    >
                        Bienvenido
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            textAlign: 'center',
                            color: '#757575',
                        }}
                    >
                        Inicia sesión para continuar
                    </Typography>
                    <Box sx={{ marginTop: 1, textAlign: 'center' }}>
                        {error && (
                            <Box sx={{ mb: 2 }}>
                                <Fade in={!!error}>
                                    <Typography color="error">{error}</Typography>
                                </Fade>
                            </Box>
                        )}
                        {success && (
                            <Box sx={{ mb: 2 }}>
                                <Fade in={success}>
                                    <Typography color="success.main" variant="h6">
                                        ¡Login exitoso! Bienvenido.
                                    </Typography>
                                </Fade>
                            </Box>
                        )}
                        {!success && (
                            <>
                                <TextField
                                    label="Usuario"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <TextField
                                    label="Contraseña"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                    onClick={handleLogin}
                                >
                                    Iniciar Sesión
                                </Button>
                            </>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Fade>
    );
}