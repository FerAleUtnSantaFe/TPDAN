import * as React from 'react';
import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const steps = [
    "Seleccionar cliente",
    "Seleccionar obra",
    "Seleccionar productos",
    "Finalización"
];

export default function ProgressBarPedido({ currentStep }) {
    return (
        <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
                {steps.map((step, index) => (
                    <StepContainer key={index} active={index === currentStep} completed={index < currentStep}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{step}</Typography>
                        {index < steps.length - 1 && <Separator />}
                    </StepContainer>
                ))}
            </Toolbar>
        </AppBar>
    );
}

const StepContainer = styled(Box)(({ theme, active, completed }) => ({
    display: 'flex',
    alignItems: 'center',
    color: active ? theme.palette.primary.main : completed ? 'gray' : '#bbb',
    fontWeight: active ? 'bold' : 'normal',
    padding: theme.spacing(1, 2),
}));

const Separator = styled('span')(({ theme }) => ({
    margin: theme.spacing(0, 1),
    width: 20,
    height: 2,
    backgroundColor: '#bbb',
}));
