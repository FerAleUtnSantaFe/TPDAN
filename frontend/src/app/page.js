'use client';

import * as React from 'react';
import NavBar from './Components/NavBar';
import Login from './Components/LoginComponent';
import { Box } from '@mui/material';

export default function Home() {
  return (
    <>
      {/* Navigation Bar */}
      <NavBar />
      {/* Main Layout */}
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Left Side with Login */}
        <Box
          sx={{
            flex: 4, // 40% of the screen
            display: 'flex',
            marginTop: '5%',
            maxHeight: '370px',
            justifyContent: 'center',
            backgroundColor: '#F5F5F5', // Light background for contrast
          }}
        >
          <Login />
        </Box>

        {/* Right Side with Image */}
        <Box
          sx={{
            flex: 6, // 60% of the screen
            backgroundImage: 'url(/Portada.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          {/* Gradient Overlay Over the Diagonal */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '50%',
              background: 'linear-gradient(90deg, rgba(245, 245, 245, 1), rgba(13, 71, 161, 0))',
            }}
          />
        </Box>
      </Box>
    </>
  );
}