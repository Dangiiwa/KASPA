import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { 
  TemperatureCard,
  HumidityCard,
  WindCard,
  PressureCard,
  UVIndexCard,
} from './WeatherCard';
import HealthCard from './HealthCard';
import MoistureCard from './MoistureCard';
import { 
  getCurrentWeather, 
  getCurrentSoil, 
  getCurrentUVI 
} from '../../services/geo';
import type { Field, WeatherData, CurrentSoil, CurrentUVI } from '../../types';
import { enqueueSnackbar } from 'notistack';

// Helper function
const kelvinToCelsius = (kelvin: number): number => kelvin - 273.15;

interface WeatherSidebarProps {
  selectedField?: Field | null;
}

const WeatherSidebar: React.FC<WeatherSidebarProps> = ({ selectedField }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [soilData, setSoilData] = useState<CurrentSoil | null>(null);
  const [uviData, setUviData] = useState<CurrentUVI | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (fieldId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const [weather, soil, uvi] = await Promise.all([
        getCurrentWeather(fieldId).catch(() => null),
        getCurrentSoil(fieldId).catch(() => null),
        getCurrentUVI(fieldId).catch(() => null),
      ]);

      setWeatherData(weather);
      setSoilData(soil);
      setUviData(uvi);
    } catch (err: any) {
      const message = err?.message || 'Failed to fetch weather data';
      setError(message);
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (selectedField?.id) {
      fetchWeatherData(selectedField.id);
    }
  };

  useEffect(() => {
    if (selectedField?.id) {
      fetchWeatherData(selectedField.id);
    } else {
      setWeatherData(null);
      setSoilData(null);
      setUviData(null);
      setError(null);
    }
  }, [selectedField]);

  if (!selectedField) {
    return (
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        textAlign: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <Typography variant="h6" sx={{ 
          color: '#475569', 
          fontWeight: 600, 
          fontSize: '18px',
          marginBottom: 1
        }}>
          No Field Selected
        </Typography>
        <Typography variant="body2" sx={{ 
          color: '#64748b',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Select a field from the dropdown to view weather information
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f8fafc',
      borderLeft: '1px solid #e2e8f0'
    }}>
      {/* Sophisticated Executive Header */}
      <Box sx={{ 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0'
      }}>
        {/* Primary Header */}
        <Box sx={{ 
          p: 3, 
          paddingBottom: 2
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Typography variant="h5" sx={{ 
                  color: '#0f172a', 
                  fontWeight: 700,
                  fontSize: '20px',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.2
                }}>
                  {selectedField?.name || 'Field Dashboard'}
                </Typography>
                {selectedField && (
                  <span className={`status-indicator ${
                    selectedField.field_status === 'active' ? 'status-best-match' : 'status-good-match'
                  }`} style={{ 
                    fontSize: '11px',
                    padding: '4px 8px',
                    fontWeight: 600
                  }}>
                    {selectedField.field_status}
                  </span>
                )}
              </Box>
              
              {selectedField && (
                <Typography variant="body2" sx={{ 
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  {selectedField.area.toFixed(1)} hectares
                </Typography>
              )}
            </Box>
            
            <Box display="flex" alignItems="center" gap={1}>
              <Box 
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: loading ? '#f59e0b' : '#059669',
                  boxShadow: loading ? '0 0 0 3px rgba(245, 158, 11, 0.2)' : '0 0 0 3px rgba(5, 150, 105, 0.2)',
                  transition: 'all 0.2s ease'
                }}
              />
              <IconButton 
                onClick={handleRefresh} 
                disabled={loading}
                size="small"
                sx={{ 
                  color: '#64748b',
                  padding: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                    color: '#334155',
                    borderColor: '#cbd5e1'
                  },
                  '&:disabled': {
                    color: '#94a3b8'
                  }
                }}
              >
                {loading ? <CircularProgress size={16} sx={{ color: '#3b82f6' }} /> : <Refresh fontSize="small" />}
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Key Metrics Strip */}
        {selectedField && !loading && (
          <Box sx={{ 
            px: 3, 
            pb: 2,
            borderTop: '1px solid #f1f5f9'
          }}>
            <Box display="flex" alignItems="center" gap={3} mt={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ 
                  width: 6, 
                  height: 6, 
                  borderRadius: '50%', 
                  backgroundColor: '#059669' 
                }} />
                <Typography variant="caption" sx={{ 
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: 500
                }}>
                  Live Data
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="caption" sx={{ 
                  color: '#64748b',
                  fontSize: '11px'
                }}>
                  Updated: Just now
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="caption" sx={{ 
                  color: '#64748b',
                  fontSize: '11px'
                }}>
                  7 metrics
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        p: 2,
        backgroundColor: '#f8fafc',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f5f9',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#cbd5e1',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#94a3b8'
          }
        },
      }}>
        {loading && !weatherData ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress sx={{ color: '#3b82f6' }} size={32} />
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2, 
              backgroundColor: '#fef2f2', 
              color: '#dc2626', 
              border: '1px solid #fecaca',
              borderRadius: '8px',
              fontSize: '14px',
              '& .MuiAlert-icon': {
                color: '#dc2626'
              }
            }}
          >
            {error}
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Agricultural Intelligence Group */}
            <Box>
              <Box sx={{ 
                mb: 3,
                pb: 2,
                borderBottom: '2px solid #f1f5f9',
                background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.03) 0%, rgba(16, 185, 129, 0.02) 100%)',
                borderRadius: '12px 12px 0 0',
                px: 2,
                py: 2,
                mx: -1
              }}>
                <Typography variant="h6" sx={{ 
                  color: '#059669',
                  fontSize: '15px',
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 0.5
                }}>
                  <Box sx={{ 
                    width: 4, 
                    height: 16, 
                    backgroundColor: '#059669',
                    borderRadius: '3px',
                    boxShadow: '0 0 8px rgba(5, 150, 105, 0.3)'
                  }} />
                  Agricultural Intelligence
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: 600,
                  lineHeight: 1.4
                }}>
                  AI-powered field health, soil conditions, and crop environment analysis
                </Typography>
              </Box>
              <Box 
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 2.5,
                  px: 1,
                  pb: 1,
                  '& .dashlet': {
                    opacity: 0,
                    animation: 'fadeInUp 0.5s cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
                    transform: 'translateY(20px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.15)'
                    }
                  },
                  '& .dashlet:nth-of-type(1)': { animationDelay: '100ms' },
                  '& .dashlet:nth-of-type(2)': { animationDelay: '200ms' },
                  '& .dashlet:nth-of-type(3)': { animationDelay: '300ms' },
                  '@media (max-width: 600px)': {
                    gridTemplateColumns: '1fr',
                    gap: 2,
                    px: 0
                  }
                }}
              >
                <HealthCard />
                <MoistureCard currentSoil={soilData || undefined} />
                <UVIndexCard currentUVI={uviData || undefined} />
              </Box>
            </Box>

            {/* Environmental Conditions Group */}
            <Box>
              <Box sx={{ 
                mb: 3,
                pb: 2,
                borderBottom: '2px solid #f1f5f9',
                background: 'linear-gradient(135deg, rgba(8, 145, 178, 0.03) 0%, rgba(14, 165, 233, 0.02) 100%)',
                borderRadius: '12px 12px 0 0',
                px: 2,
                py: 2,
                mx: -1
              }}>
                <Typography variant="h6" sx={{ 
                  color: '#0891b2',
                  fontSize: '15px',
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 0.5
                }}>
                  <Box sx={{ 
                    width: 4, 
                    height: 16, 
                    backgroundColor: '#0891b2',
                    borderRadius: '3px',
                    boxShadow: '0 0 8px rgba(8, 145, 178, 0.3)'
                  }} />
                  Environmental Conditions
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: 600,
                  lineHeight: 1.4
                }}>
                  Real-time weather data and atmospheric monitoring systems
                </Typography>
              </Box>
              <Box 
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 2.5,
                  px: 1,
                  pb: 1,
                  '& .dashlet': {
                    opacity: 0,
                    animation: 'fadeInUp 0.5s cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
                    transform: 'translateY(20px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.15)'
                    }
                  },
                  '& .dashlet:nth-of-type(1)': { animationDelay: '400ms' },
                  '& .dashlet:nth-of-type(2)': { animationDelay: '500ms' },
                  '& .dashlet:nth-of-type(3)': { animationDelay: '600ms' },
                  '@media (max-width: 600px)': {
                    gridTemplateColumns: '1fr',
                    gap: 2,
                    px: 0
                  }
                }}
              >
                <TemperatureCard weatherData={weatherData || undefined} />
                <HumidityCard weatherData={weatherData || undefined} />
                <PressureCard weatherData={weatherData || undefined} />
              </Box>
            </Box>

            {/* Operational Conditions Group */}
            <Box>
              <Box sx={{ 
                mb: 3,
                pb: 2,
                borderBottom: '2px solid #f1f5f9',
                background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.03) 0%, rgba(245, 158, 11, 0.02) 100%)',
                borderRadius: '12px 12px 0 0',
                px: 2,
                py: 2,
                mx: -1
              }}>
                <Typography variant="h6" sx={{ 
                  color: '#d97706',
                  fontSize: '15px',
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 0.5
                }}>
                  <Box sx={{ 
                    width: 4, 
                    height: 16, 
                    backgroundColor: '#d97706',
                    borderRadius: '3px',
                    boxShadow: '0 0 8px rgba(217, 119, 6, 0.3)'
                  }} />
                  Operational Conditions
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: 600,
                  lineHeight: 1.4
                }}>
                  Field operations and optimal working conditions analysis
                </Typography>
              </Box>
              <Box 
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: 2.5,
                  px: 1,
                  pb: 1,
                  '& .dashlet': {
                    opacity: 0,
                    animation: 'fadeInUp 0.5s cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
                    transform: 'translateY(20px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.15)'
                    }
                  },
                  '& .dashlet:nth-of-type(1)': { animationDelay: '700ms' },
                  '@media (max-width: 600px)': {
                    gap: 2,
                    px: 0
                  }
                }}
              >
                <WindCard weatherData={weatherData || undefined} />
              </Box>
            </Box>
          </Box>
        )}
      </Box>

    </Box>
  );
};

export default WeatherSidebar;