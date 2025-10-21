import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { Add, Remove, Fullscreen, FullscreenExit } from '@mui/icons-material';
import { useMap } from 'react-leaflet';

interface CustomMapControlsProps {
  className?: string;
}

const CustomMapControls: React.FC<CustomMapControlsProps> = ({ className }) => {
  const map = useMap();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Ensure default zoom control is removed
  useEffect(() => {
    if (map) {
      // Remove via map.zoomControl property
      if (map.zoomControl) {
        map.removeControl(map.zoomControl);
      }
      
      // Find and remove any zoom controls from DOM
      const container = map.getContainer();
      const zoomControls = container.querySelectorAll('.leaflet-control-zoom');
      zoomControls.forEach(control => {
        control.remove();
      });
      
      // Also remove from control corners using proper Leaflet API
      const controlCorners = (map as any)._controlCorners;
      if (controlCorners) {
        Object.values(controlCorners).forEach((corner: any) => {
          const zoomElements = corner?.querySelectorAll?.('.leaflet-control-zoom');
          zoomElements?.forEach?.((el: Element) => el.remove());
        });
      }
    }
  }, [map]);

  const handleZoomIn = () => {
    if (map) {
      map.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.zoomOut();
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen - target only the map container
      const mapContainer = map.getContainer().parentElement; // The Box wrapping the MapContainer
      if (mapContainer?.requestFullscreen) {
        mapContainer.requestFullscreen().then(() => {
          setIsFullscreen(true);
          // Add some styling for fullscreen map
          mapContainer.style.zIndex = '9999';
          mapContainer.style.backgroundColor = '#000';
        }).catch((err) => {
          console.error('Error attempting to enable fullscreen:', err);
        });
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
          // Reset styling
          const mapContainer = map.getContainer().parentElement;
          if (mapContainer) {
            mapContainer.style.zIndex = '';
            mapContainer.style.backgroundColor = '';
          }
        }).catch((err) => {
          console.error('Error attempting to exit fullscreen:', err);
        });
      }
    }
  };

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return (
    <>
      {/* Zoom Controls */}
      <Box 
        className={`map-control map-control-zoom ${className || ''}`}
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'row',
          gap: 0,
          padding: 0,
          background: '#ffffff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: '8px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        }}
      >
        <Tooltip title="Zoom in" placement="left">
          <IconButton
            onClick={handleZoomIn}
            size="small"
            sx={{ 
              color: '#64748b',
              borderRadius: 0,
              padding: '6px',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                color: '#0f172a'
              },
              borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <Add fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Zoom out" placement="left">
          <IconButton
            onClick={handleZoomOut}
            size="small"
            sx={{ 
              color: '#64748b',
              borderRadius: 0,
              padding: '6px',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                color: '#0f172a'
              },
              borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <Remove fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} placement="left">
          <IconButton
            onClick={handleFullscreen}
            size="small"
            sx={{ 
              color: '#64748b',
              borderRadius: 0,
              padding: '6px',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                color: '#0f172a'
              },
            }}
          >
            {isFullscreen ? <FullscreenExit fontSize="small" /> : <Fullscreen fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
};

export default CustomMapControls;