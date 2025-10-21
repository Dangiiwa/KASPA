import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Close, Agriculture, Crop, Save, Cancel } from '@mui/icons-material';
import type { GeoJSON } from '../../types';

interface AddFarmSidebarProps {
  onSubmit: (data: { name: string; field_status: 'unplanted' | 'active'; geo_json: GeoJSON }) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
  drawnPolygon?: GeoJSON | null;
  polygonArea?: number;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Farm name is required')
    .min(2, 'Farm name must be at least 2 characters')
    .max(50, 'Farm name must not exceed 50 characters'),
  field_status: Yup.string()
    .oneOf(['unplanted', 'active'], 'Invalid field status')
    .required('Field status is required'),
});

const AddFarmSidebar: React.FC<AddFarmSidebarProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  error = null,
  drawnPolygon,
  polygonArea
}) => {
  const [localError, setLocalError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      field_status: 'active' as 'unplanted' | 'active',
    },
    validationSchema,
    onSubmit: (values) => {
      setLocalError(null);
      
      if (!drawnPolygon) {
        setLocalError('Please draw a polygon on the map before saving');
        return;
      }

      onSubmit({
        name: values.name,
        field_status: values.field_status,
        geo_json: drawnPolygon
      });
    },
  });

  // Clear local error when polygon is drawn
  useEffect(() => {
    if (drawnPolygon) {
      setLocalError(null);
    }
  }, [drawnPolygon]);

  const displayError = error || localError;

  return (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#f8fafc',
        p: 3,
        gap: 3
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Agriculture sx={{ color: '#059669', fontSize: 28 }} />
          <Typography variant="h6" fontWeight={600} sx={{ color: '#1e293b' }}>
            Add New Farm
          </Typography>
        </Box>
        <IconButton
          onClick={onCancel}
          disabled={loading}
          size="small"
          sx={{
            color: '#64748b',
            '&:hover': { backgroundColor: '#e2e8f0' },
          }}
        >
          <Close />
        </IconButton>
      </Box>

      <Divider />

      {/* Drawing Instructions */}
      <Box
        sx={{
          p: 2,
          backgroundColor: '#e0f2fe',
          border: '1px solid #0891b2',
          borderRadius: '8px',
        }}
      >
        <Typography variant="body2" fontWeight={600} sx={{ color: '#0e7490', mb: 1 }}>
          📍 Drawing Instructions
        </Typography>
        <Typography variant="caption" sx={{ color: '#155e75', fontSize: '12px' }}>
          Use the drawing controls on the map to create your farm boundary. Click to add points, then double-click the last point to complete the polygon.
        </Typography>
      </Box>

      {/* Form Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Farm Details Section */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1e293b', mb: 1 }}>
              Farm Details
            </Typography>
            
            <TextField
              fullWidth
              name="name"
              label="Farm Name"
              placeholder="Enter farm name (e.g., North Field, Corn Field A)"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              disabled={loading}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: 'white',
                },
              }}
            />

            <FormControl 
              fullWidth 
              error={formik.touched.field_status && Boolean(formik.errors.field_status)}
              disabled={loading}
              size="small"
            >
              <InputLabel>Field Status</InputLabel>
              <Select
                name="field_status"
                value={formik.values.field_status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Field Status"
                sx={{
                  borderRadius: '8px',
                  backgroundColor: 'white',
                }}
              >
                <MenuItem value="active">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      size="small"
                      label="Active"
                      sx={{
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                        fontWeight: 500,
                      }}
                    />
                    <Typography variant="caption" sx={{ ml: 1, color: '#64748b' }}>
                      Currently planted
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="unplanted">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      size="small"
                      label="Unplanted"
                      sx={{
                        backgroundColor: '#fef3c7',
                        color: '#d97706',
                        fontWeight: 500,
                      }}
                    />
                    <Typography variant="caption" sx={{ ml: 1, color: '#64748b' }}>
                      Ready for planting
                    </Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <Divider />

            {/* Polygon Status */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1e293b' }}>
              Farm Boundary
            </Typography>
            
            {drawnPolygon ? (
              <Box
                sx={{
                  p: 2,
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #0ea5e9',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Crop sx={{ color: '#0ea5e9' }} />
                <Box>
                  <Typography variant="body2" fontWeight={500} sx={{ color: '#1e293b' }}>
                    Polygon drawn successfully
                  </Typography>
                  {polygonArea && (
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Area: {polygonArea.toFixed(2)} hectares
                    </Typography>
                  )}
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  p: 2,
                  backgroundColor: '#fef3c7',
                  border: '1px solid #f59e0b',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" sx={{ color: '#92400e' }}>
                  Please draw a polygon on the map to define the farm boundary
                </Typography>
              </Box>
            )}

            {/* Error Display */}
            {displayError && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: '8px',
                  '& .MuiAlert-message': {
                    fontSize: '14px',
                  },
                }}
              >
                {displayError}
              </Alert>
            )}
          </Box>
        </form>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
        <Button
          onClick={onCancel}
          disabled={loading}
          variant="outlined"
          fullWidth
          sx={{
            borderColor: '#e2e8f0',
            color: '#64748b',
            '&:hover': {
              borderColor: '#cbd5e1',
              backgroundColor: '#f8fafc',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => formik.handleSubmit()}
          disabled={loading || !drawnPolygon}
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: '#059669',
            '&:hover': {
              backgroundColor: '#047857',
            },
            '&:disabled': {
              backgroundColor: '#e2e8f0',
              color: '#94a3b8',
            },
          }}
          startIcon={loading ? <CircularProgress size={16} /> : <Save />}
        >
          {loading ? 'Creating Farm...' : 'Create Farm'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddFarmSidebar;