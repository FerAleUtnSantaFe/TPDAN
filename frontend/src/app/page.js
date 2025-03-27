'use client';

import * as React from 'react';
import NavBar from './Components/NavBar';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';

export default function Home() {
  return (

        <div>
          <NavBar/>
          <Container>  
            <Typography variant="h3" gutterBottom sx={{ margin: 1, textAlign: 'center' }}>
              Trabajo practico dan 2024
            </Typography>
          </Container>
        </div>
  );
}
