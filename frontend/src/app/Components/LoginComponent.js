'use client';

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Alert, Card, CardContent } from '@mui/material';
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
            setError('Username and password are required');
            return;
        }
        try {
            await validateAuth({ username, password });
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <Card
            elevation={1}
            sx={{
                width: '80%',
                maxWidth: 400,
                padding: 3,
                borderRadius: 2,
                top: '20%',
            }}
        >
            <CardContent>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        textAlign: 'center',
                        fontWeight: 700,
                        color: '#0D47A1', // Primary color
                    }}
                >
                    Bienvenido
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        textAlign: 'center',
                        color: '#757575', // Secondary text color
                    }}
                >
                    Inicia sesión para continuar
                </Typography>
                <Box sx={{ marginTop: 1, textAlign: 'center' }}>
                    {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ marginBottom: 2 }}>Login successful!</Alert>}
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
                </Box>

            </CardContent>
        </Card>
    );
}