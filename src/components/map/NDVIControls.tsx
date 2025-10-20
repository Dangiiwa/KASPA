import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
  Tooltip
} from '@mui/material';
import {
  Satellite,
  Visibility,
  VisibilityOff,
  ExpandMore,
  ExpandLess,
  CalendarToday,
  CloudQueue
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  selectSatellite,
  selectIsOverlayVisible,
  selectOverlayOpacity,
  selectCurrentImage,
  toggleOverlay,
  setOpacity,
  setSelectedDate,
  setSelectedType
} from '../../redux/slices/satelliteSlice';

interface NDVIControlsProps {
  fieldId?: string;
}

const NDVIControls: React.FC<NDVIControlsProps> = ({ fieldId }) => {
  const dispatch = useAppDispatch();
  const satelliteState = useAppSelector(selectSatellite);
  const isVisible = useAppSelector(selectIsOverlayVisible);
  const opacity = useAppSelector(selectOverlayOpacity);
  const currentImage = useAppSelector(selectCurrentImage);
  
  const [isExpanded, setIsExpanded] = useState(false);

  const { availableImages, selectedDate, selectedType, loading } = satelliteState;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCloudCoverColor = (cloudCover: number) => {
    if (cloudCover < 10) return '#4caf50'; // Green
    if (cloudCover < 30) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  // Don't render if no field is selected or no images available
  if (!fieldId || availableImages.length === 0) {
    return null;
  }

  return (
    <div className="map-control map-control-top-right map-control-expanded">
      {/* Header */}
      <div className="map-control-header">
        <div className="map-control-title">
          <Satellite sx={{ color: '#0891b2', fontSize: 20 }} />
          NDVI Overlay
        </div>
        
        <div className="map-control-actions">
          <Tooltip title={isVisible ? 'Hide overlay' : 'Show overlay'}>
            <IconButton
              size="small"
              onClick={() => dispatch(toggleOverlay())}
              className={isVisible ? 'active' : ''}
            >
              {isVisible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </Tooltip>
          <IconButton
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </div>
      </div>

      {/* Current Selection Summary */}
      {currentImage && (
        <Box display="flex" alignItems="center" gap={1.5} mb={2} sx={{
          backgroundColor: '#f8fafc',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <CalendarToday sx={{ fontSize: 16, color: '#64748b' }} />
            <Typography variant="caption" sx={{ 
              color: '#0f172a',
              fontWeight: 500,
              fontSize: '12px'
            }}>
              {formatDate(currentImage.date)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <CloudQueue sx={{ fontSize: 16, color: getCloudCoverColor(currentImage.cloud_cover) }} />
            <Typography variant="caption" sx={{ 
              color: getCloudCoverColor(currentImage.cloud_cover),
              fontWeight: 500,
              fontSize: '12px'
            }}>
              {currentImage.cloud_cover}% cloud
            </Typography>
          </Box>
        </Box>
      )}

      {/* Expanded Controls */}
      <Collapse in={isExpanded}>
        <div className="map-control-content">
          {/* Opacity Control */}
          {isVisible && (
            <Box>
              <Typography variant="caption" sx={{ 
                color: '#475569', 
                fontWeight: 500,
                fontSize: '12px',
                mb: 1, 
                display: 'block' 
              }}>
                Opacity: {Math.round(opacity * 100)}%
              </Typography>
              <Slider
                value={opacity}
                onChange={(_, value) => dispatch(setOpacity(value as number))}
                min={0}
                max={1}
                step={0.1}
                size="small"
                sx={{
                  color: '#0891b2',
                  height: 6,
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#0891b2',
                    width: 16,
                    height: 16,
                    '&:hover': {
                      boxShadow: '0 0 0 8px rgba(8, 145, 178, 0.16)',
                    },
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#0891b2',
                    border: 'none',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: '#e2e8f0',
                  }
                }}
              />
            </Box>
          )}

          {/* Date Selection */}
          <FormControl fullWidth size="small">
            <InputLabel>Date</InputLabel>
            <Select
              value={selectedDate || ''}
              onChange={(e) => dispatch(setSelectedDate(e.target.value))}
              label="Date"
              disabled={loading}
            >
              {availableImages.map((image) => (
                <MenuItem key={image.id} value={image.date}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Typography variant="body2" sx={{ color: '#0f172a' }}>
                      {formatDate(image.date)}
                    </Typography>
                    <span className={`status-indicator ${
                      image.cloud_cover < 10 ? 'status-best-match' : 
                      image.cloud_cover < 30 ? 'status-low-match' : 
                      'status-critical'
                    }`} style={{ fontSize: '10px' }}>
                      {image.cloud_cover}%
                    </span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Index Type Selection */}
          <FormControl fullWidth size="small">
            <InputLabel>Index Type</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => dispatch(setSelectedType(e.target.value as 'ndvi' | 'evi' | 'rgb' | 'infrared'))}
              label="Index Type"
              disabled={loading}
            >
              <MenuItem value="ndvi">
                <Typography variant="body2" sx={{ color: '#0f172a' }}>
                  NDVI (Vegetation)
                </Typography>
              </MenuItem>
              <MenuItem value="evi">
                <Typography variant="body2" sx={{ color: '#0f172a' }}>
                  EVI (Enhanced Vegetation)
                </Typography>
              </MenuItem>
              <MenuItem value="rgb">
                <Typography variant="body2" sx={{ color: '#0f172a' }}>
                  RGB (True Color)
                </Typography>
              </MenuItem>
              <MenuItem value="infrared">
                <Typography variant="body2" sx={{ color: '#0f172a' }}>
                  Infrared
                </Typography>
              </MenuItem>
            </Select>
          </FormControl>

          {/* NDVI Statistics */}
          {currentImage && isVisible && selectedType === 'ndvi' && (
            <Box sx={{ 
              backgroundColor: '#f8fafc', 
              borderRadius: '8px',
              padding: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="caption" sx={{ 
                color: '#475569', 
                fontWeight: 600,
                fontSize: '12px',
                display: 'block', 
                mb: 1.5 
              }}>
                NDVI Statistics
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box textAlign="center">
                  <Typography variant="caption" sx={{ 
                    color: '#059669', 
                    fontWeight: 600,
                    fontSize: '11px',
                    display: 'block' 
                  }}>
                    Min
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: '#0f172a',
                    fontWeight: 500,
                    fontSize: '12px'
                  }}>
                    {currentImage.index_stats?.ndvi?.min?.toFixed(2) || 'N/A'}
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="caption" sx={{ 
                    color: '#d97706', 
                    fontWeight: 600,
                    fontSize: '11px',
                    display: 'block' 
                  }}>
                    Mean
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: '#0f172a',
                    fontWeight: 500,
                    fontSize: '12px'
                  }}>
                    {currentImage.index_stats?.ndvi?.mean?.toFixed(2) || 'N/A'}
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="caption" sx={{ 
                    color: '#0891b2', 
                    fontWeight: 600,
                    fontSize: '11px',
                    display: 'block' 
                  }}>
                    Max
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: '#0f172a',
                    fontWeight: 500,
                    fontSize: '12px'
                  }}>
                    {currentImage.index_stats?.ndvi?.max?.toFixed(2) || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default NDVIControls;