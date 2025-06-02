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
        <AppBar position="static" sx={{ bgcolor: (theme) => theme.palette.background.paper, boxShadow: 1 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
                {steps.map((step, index) => {
                    const isActive = index === currentStep;
                    return (
                        <StepContainer key={index}>
                            <Typography
                                variant="body2"
                                sx={(theme) => ({
                                    color: isActive
                                        ? theme.palette.primary.main
                                        : theme.palette.text.secondary,
                                    fontWeight: isActive
                                        ? theme.typography.fontWeightBold
                                        : theme.typography.body2.fontWeight,
                                    transition: 'color 0.2s, font-weight 0.2s'
                                })}
                            >
                                {step}
                            </Typography>
                            {index < steps.length - 1 && (
                                <Separator />
                            )}
                        </StepContainer>
                    );
                })}
            </Toolbar>
        </AppBar>
    );
}

const StepContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
}));

const Separator = styled('span')(({ theme }) => ({
    margin: theme.spacing(0, 1),
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.palette.text.secondary,
    display: 'inline-block',
    verticalAlign: 'middle',
}));