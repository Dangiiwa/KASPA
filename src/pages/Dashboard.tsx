import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  Typography,
  useMediaQuery,
  useTheme,
  Backdrop,
  CircularProgress,
  Fade
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { Agriculture } from '@mui/icons-material';
import { logout } from '../redux/slices/userSlice';
import { useFields } from '../hooks/useFields';
import Map from '../components/map/Map';
import WeatherSidebar from '../components/weather/WeatherSidebar';
import type { Field } from '../types';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.user);
  const { 
    fields, 
    loading, 
    selectedField, 
    selectField, 
    isTransitioning, 
    autoSelecting 
  } = useFields(true); // Enable auto-selection

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleFieldSelect = (field: Field) => {
    selectField(field);
  };

  // Determine if we should show loading overlay
  const showLoadingOverlay = autoSelecting || (isTransitioning && selectedField !== null);

  return (
    <Box className="dashboard-layout" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ zIndex: theme.zIndex.appBar }}>
        <Toolbar>
          <Agriculture sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Kaspa Farm Management
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {userData.first_name || userData.email}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      {/* Main Content Area - Split Layout */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        overflow: 'hidden'
      }}>
        {/* Left Side - Map Container */}
        <Box sx={{ 
          flex: isMobile ? '0 0 50%' : '1 1 65%',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Map Component with integrated controls */}
          <Map 
            fields={fields} 
            selectedField={selectedField}
            onFieldSelect={handleFieldSelect}
            height="100%"
            showSatellite={true}
            loading={loading}
            isTransitioning={isTransitioning}
            autoSelecting={autoSelecting}
          />
        </Box>

        {/* Right Side - Weather Cards Sidebar */}
        <Box sx={{ 
          flex: isMobile ? '1 1 50%' : '0 0 35%',
          backgroundColor: '#f8fafc',
          borderLeft: isMobile ? 'none' : '1px solid #e2e8f0',
          borderTop: isMobile ? '1px solid #e2e8f0' : 'none',
          overflow: 'hidden'
        }}>
          <WeatherSidebar selectedField={selectedField} />
        </Box>
      </Box>

      {/* Loading Overlay for Farm Transitions */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: theme.zIndex.modal,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }}
        open={showLoadingOverlay}
      >
        <Fade in={showLoadingOverlay}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <CircularProgress color="primary" size={48} />
            <Typography variant="h6" sx={{ color: '#fff' }}>
              {autoSelecting ? 'Loading farm...' : 'Switching farm...'}
            </Typography>
          </Box>
        </Fade>
      </Backdrop>
    </Box>
  );
};

export default Dashboard;