import React, { useState } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { LocationOn, Add } from '@mui/icons-material';
import type { Field } from '../../types';

interface MapControlsProps {
  fields: Field[];
  selectedField: Field | null;
  onFieldSelect: (field: Field) => void;
  loading: boolean;
  isTransitioning?: boolean;
  autoSelecting?: boolean;
  onAddFarm?: () => void;
  isCreatingFarm?: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({
  fields,
  selectedField,
  onFieldSelect,
  loading,
  isTransitioning = false,
  autoSelecting = false,
  onAddFarm,
  isCreatingFarm = false
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleFieldChange = (fieldId: string) => {
    if (isTransitioning || autoSelecting) return; // Prevent selection during transitions
    
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      onFieldSelect(field);
    }
    setDropdownOpen(false);
  };

  // Determine if control should be disabled
  const isControlDisabled = loading || fields.length === 0 || isTransitioning || autoSelecting || isCreatingFarm;
  
  // Determine loading icon and text
  const getLoadingState = () => {
    if (autoSelecting) return { loading: true, text: 'Loading...' };
    if (isTransitioning) return { loading: true, text: 'Switching...' };
    if (loading) return { loading: true, text: 'Loading...' };
    return { loading: false, text: null };
  };

  const loadingState = getLoadingState();

  return (
    <>
      {/* Top Left - Field Selector */}
      <div className="map-control map-control-top-left map-control-compact">
        <div className="map-control-header">
          <div className="map-control-title">
            <LocationOn sx={{ color: '#059669', fontSize: 20 }} />
            {isCreatingFarm ? 'Creating New Farm' : `My Fields (${fields.length})`}
          </div>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {loadingState.loading && (
              <CircularProgress size={16} sx={{ color: '#3b82f6' }} />
            )}
            {onAddFarm && (
              <Tooltip title="Add new farm" placement="top">
                <IconButton
                  onClick={onAddFarm}
                  size="small"
                  disabled={loading || isCreatingFarm}
                  sx={{
                    backgroundColor: isCreatingFarm ? '#047857' : '#059669',
                    color: 'white',
                    width: 24,
                    height: 24,
                    '&:hover': {
                      backgroundColor: '#047857',
                      transform: 'scale(1.05)',
                    },
                    '&:disabled': {
                      backgroundColor: '#e2e8f0',
                      color: '#94a3b8',
                    },
                    transition: 'all 200ms ease-in-out'
                  }}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </div>
        
        <div className="map-control-content">
          {isCreatingFarm ? (
            <Box
              sx={{
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f0f9ff',
                border: '1px dashed #0ea5e9',
                borderRadius: '8px',
                color: '#0e7490',
                fontStyle: 'italic',
                fontSize: '14px'
              }}
            >
              Draw your farm boundary on the map
            </Box>
          ) : (
            <FormControl fullWidth size="small">
              <Select
                value={selectedField?.id || ''}
                onChange={(e) => handleFieldChange(e.target.value)}
                open={dropdownOpen}
                onOpen={() => setDropdownOpen(true)}
                onClose={() => setDropdownOpen(false)}
                disabled={isControlDisabled}
                displayEmpty
              sx={{
                height: '44px',
                transition: 'all 200ms ease-in-out',
                borderRadius: '8px',
                '& .MuiSelect-select': {
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  fontSize: '14px'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(226, 232, 240, 0.8)',
                  borderRadius: '8px'
                },
                '&:hover': {
                  backgroundColor: '#f8fafc',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#cbd5e1'
                  }
                },
                '&.Mui-focused': {
                  backgroundColor: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1e293b',
                    borderWidth: '2px'
                  }
                }
              }}
              renderValue={(value) => {
                if (!value) {
                  return (
                    <Box sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                      Select a field
                    </Box>
                  );
                }
                const field = fields.find(f => f.id === value);
                return field ? (
                  <Box>
                    <Typography variant="body2" sx={{ 
                      color: '#0f172a', 
                      fontWeight: 600,
                      fontSize: '15px',
                      lineHeight: 1.2,
                      mb: '2px'
                    }}>
                      {field.name}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: '#64748b',
                      fontSize: '13px',
                      fontWeight: 500
                    }}>
                      {field.area.toFixed(1)}ha • {field.field_status}
                    </Typography>
                  </Box>
                ) : null;
              }}
            >
              {fields.length === 0 ? (
                <MenuItem disabled>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    No fields available
                  </Typography>
                </MenuItem>
              ) : (
                fields.map((field) => (
                  <MenuItem 
                    key={field.id} 
                    value={field.id}
                    sx={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'all 200ms ease-in-out',
                      '&:hover': {
                        backgroundColor: '#f8fafc',
                        transform: 'translateX(4px)'
                      },
                      '&:last-child': {
                        borderBottom: 'none'
                      }
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="body2" fontWeight={600} sx={{ 
                        color: '#0f172a',
                        fontSize: '15px',
                        lineHeight: 1.2,
                        mb: '4px'
                      }}>
                        {field.name}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" sx={{ 
                          color: '#64748b',
                          fontSize: '13px',
                          fontWeight: 500
                        }}>
                          {field.area.toFixed(1)} hectares
                        </Typography>
                        <span className={`status-indicator ${
                          field.field_status === 'active' ? 'status-best-match' : 'status-good-match'
                        }`}>
                          {field.field_status}
                        </span>
                      </Box>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
            </FormControl>
          )}
        </div>
      </div>

    </>
  );
};

export default MapControls;