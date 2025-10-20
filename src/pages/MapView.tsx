import React from 'react';
import { Container, Typography } from '@mui/material';

const MapView: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Map View
      </Typography>
      <Typography variant="body1">
        Full screen map component will be implemented here
      </Typography>
    </Container>
  );
};

export default MapView;