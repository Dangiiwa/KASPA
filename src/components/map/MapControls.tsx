import React, { useState } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  CircularProgress
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import type { Field } from '../../types';

interface MapControlsProps {
  fields: Field[];
  selectedField: Field | null;
  onFieldSelect: (field: Field) => void;
  loading: boolean;
  isTransitioning?: boolean;
  autoSelecting?: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({
  fields,
  selectedField,
  onFieldSelect,
  loading,
  isTransitioning = false,
  autoSelecting = false
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
  const isControlDisabled = loading || fields.length === 0 || isTransitioning || autoSelecting;
  
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
            My Fields ({fields.length})
          </div>
          {loadingState.loading && (
            <CircularProgress size={16} sx={{ color: '#3b82f6' }} />
          )}
        </div>
        
        <div className="map-control-content">
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
                height: '40px',
                transition: 'all 200ms ease-in-out',
                '& .MuiSelect-select': {
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 14px'
                },
                '&:hover': {
                  backgroundColor: '#f8fafc',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#cbd5e1'
                  }
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1e293b',
                    borderWidth: '1px'
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
                      fontSize: '14px'
                    }}>
                      {field.name}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: '#64748b',
                      fontSize: '12px'
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
                  <MenuItem key={field.id} value={field.id}>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="body2" fontWeight={600} sx={{ 
                        color: '#0f172a',
                        fontSize: '14px'
                      }}>
                        {field.name}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" sx={{ 
                          color: '#64748b',
                          fontSize: '12px'
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
        </div>
      </div>

    </>
  );
};

export default MapControls;