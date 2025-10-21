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
      {/* Professional Government Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          zIndex: theme.zIndex.appBar,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Toolbar sx={{ height: 48, minHeight: '48px !important', px: 3 }}>
          {/* Brand Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                px: 2,
                py: 0.5,
                borderRadius: '6px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}
            >
              <Agriculture sx={{ color: '#059669', fontSize: 20 }} />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#1e293b',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}
              >
                KASPA
              </Typography>
            </Box>
            <Box sx={{ height: 20, width: '1px', backgroundColor: '#e2e8f0', mx: 1 }} />
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#64748b',
                fontSize: '11px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Agricultural Intelligence Platform
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* System Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mr: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box 
                sx={{ 
                  width: 6, 
                  height: 6, 
                  borderRadius: '50%', 
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)'
                }} 
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#475569',
                  fontSize: '11px',
                  fontWeight: 500
                }}
              >
                System Operational
              </Typography>
            </Box>
            
            {/* User Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#1e293b',
                    fontSize: '13px',
                    fontWeight: 600,
                    lineHeight: 1
                  }}
                >
                  {userData.first_name || userData.email}
                </Typography>
              </Box>
              <Button 
                onClick={handleLogout}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: '#e2e8f0',
                  color: '#475569',
                  fontWeight: 500,
                  textTransform: 'none',
                  borderRadius: '4px',
                  padding: '4px 12px',
                  fontSize: '11px',
                  minWidth: 'auto',
                  transition: 'all 200ms ease-in-out',
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                    borderColor: '#cbd5e1',
                    color: '#1e293b',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
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