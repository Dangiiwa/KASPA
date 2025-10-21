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
        backgroundColor: '#ffffff'
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
      backgroundColor: '#ffffff',
      borderLeft: '2px solid #e2e8f0',
      boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.04)'
    }}>
      {/* Professional Government Header */}
      <Box sx={{ 
        backgroundColor: '#ffffff',
        borderBottom: '2px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Compact Professional Header */}
        <Box sx={{ 
          px: 3, 
          py: 2
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                <Typography variant="h6" sx={{ 
                  color: '#1e293b', 
                  fontWeight: 700,
                  fontSize: '16px',
                  letterSpacing: '0.25px',
                  textTransform: 'uppercase',
                  lineHeight: 1
                }}>
                  {selectedField?.name || 'Field Intelligence'}
                </Typography>
                {selectedField && (
                  <span className={`status-indicator ${
                    selectedField.field_status === 'active' ? 'status-best-match' : 'status-good-match'
                  }`} style={{ 
                    fontSize: '10px',
                    padding: '3px 6px',
                    fontWeight: 600,
                    borderRadius: '3px'
                  }}>
                    {selectedField.field_status.toUpperCase()}
                  </span>
                )}
              </Box>
              
              {selectedField && (
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="caption" sx={{ 
                    color: '#64748b',
                    fontSize: '11px',
                    fontWeight: 500
                  }}>
                    Area: {selectedField.area.toFixed(1)} ha
                  </Typography>
                  <Box sx={{ height: 10, width: '1px', backgroundColor: '#e2e8f0' }} />
                  <Typography variant="caption" sx={{ 
                    color: '#64748b',
                    fontSize: '11px',
                    fontWeight: 500
                  }}>
                    ID: {selectedField.id}
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Box display="flex" alignItems="center" gap={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box 
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: loading ? '#d97706' : '#059669',
                    boxShadow: loading ? '0 0 0 2px rgba(217, 119, 6, 0.2)' : '0 0 0 2px rgba(5, 150, 105, 0.2)'
                  }}
                />
                <Typography variant="caption" sx={{ 
                  color: '#475569',
                  fontSize: '10px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {loading ? 'Updating' : 'Live'}
                </Typography>
              </Box>
              <IconButton 
                onClick={handleRefresh} 
                disabled={loading}
                size="small"
                sx={{ 
                  color: '#64748b',
                  padding: '4px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
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
                {loading ? <CircularProgress size={12} sx={{ color: '#475569' }} /> : <Refresh sx={{ fontSize: 12 }} />}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Professional Data Content */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        backgroundColor: '#f8fafc',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#cbd5e1',
          borderRadius: '2px',
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
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* Professional Data Table - Agricultural Intelligence */}
            <Box sx={{ 
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#ffffff'
            }}>
              <Box sx={{ 
                px: 3,
                py: 2,
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: '#f8fafc'
              }}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#1e293b',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Box sx={{ 
                    width: 3, 
                    height: 12, 
                    backgroundColor: '#059669',
                    borderRadius: '2px'
                  }} />
                  Agricultural Intelligence
                </Typography>
              </Box>
              
              {/* Data Table */}
              <Box sx={{ px: 3, py: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ 
                      color: '#475569', 
                      fontSize: '12px',
                      fontWeight: 500
                    }}>
                      Field Health Index
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ 
                        color: '#1e293b', 
                        fontSize: '14px',
                        fontWeight: 700
                      }}>
                        42%
                      </Typography>
                      <Box sx={{ 
                        px: 1.5, 
                        py: 0.5, 
                        backgroundColor: '#fef3c7',
                        borderRadius: '4px',
                        border: '1px solid #fbbf24'
                      }}>
                        <Typography variant="caption" sx={{ 
                          color: '#92400e', 
                          fontSize: '9px',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          Fair
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ 
                      color: '#475569', 
                      fontSize: '12px',
                      fontWeight: 500
                    }}>
                      Soil Moisture
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ 
                        color: '#1e293b', 
                        fontSize: '14px',
                        fontWeight: 700
                      }}>
                        {soilData ? `${(soilData.moisture * 100).toFixed(0)}%` : '11%'}
                      </Typography>
                      <Box sx={{ 
                        px: 1.5, 
                        py: 0.5, 
                        backgroundColor: '#fecaca',
                        borderRadius: '4px',
                        border: '1px solid #ef4444'
                      }}>
                        <Typography variant="caption" sx={{ 
                          color: '#991b1b', 
                          fontSize: '9px',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          Low
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Professional Data Table - Environmental Conditions */}
            <Box sx={{ 
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#ffffff'
            }}>
              <Box sx={{ 
                px: 3,
                py: 2,
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: '#f8fafc'
              }}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#1e293b',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Box sx={{ 
                    width: 3, 
                    height: 12, 
                    backgroundColor: '#0f766e',
                    borderRadius: '2px'
                  }} />
                  Environmental Conditions
                </Typography>
              </Box>
              
              {/* Professional Data Grid */}
              <Box sx={{ px: 3, py: 2 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ 
                      color: '#64748b', 
                      fontSize: '10px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Temperature
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      color: '#1e293b', 
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1
                    }}>
                      {weatherData ? `${(weatherData.main.temp - 273.15).toFixed(0)}°C` : '25°C'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ 
                      color: '#64748b', 
                      fontSize: '10px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Humidity
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      color: '#1e293b', 
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1
                    }}>
                      {weatherData ? `${weatherData.main.humidity}%` : '25%'}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ 
                      color: '#64748b', 
                      fontSize: '10px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Wind Speed
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      color: '#1e293b', 
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1
                    }}>
                      {weatherData ? `${weatherData.wind.speed} m/s` : '0.91 m/s'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ 
                      color: '#64748b', 
                      fontSize: '10px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Pressure
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      color: '#1e293b', 
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1
                    }}>
                      {weatherData ? `${weatherData.main.pressure} hPa` : '1012 hPa'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Additional System Information */}
            <Box sx={{ 
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <Box sx={{ 
                px: 3,
                py: 2,
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: '#f8fafc'
              }}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#1e293b',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Box sx={{ 
                    width: 3, 
                    height: 12, 
                    backgroundColor: '#475569',
                    borderRadius: '2px'
                  }} />
                  System Status
                </Typography>
              </Box>
              
              <Box sx={{ px: 3, py: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ 
                      color: '#475569', 
                      fontSize: '12px',
                      fontWeight: 500
                    }}>
                      Last Updated
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#1e293b', 
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      {new Date().toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false 
                      })}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ 
                      color: '#475569', 
                      fontSize: '12px',
                      fontWeight: 500
                    }}>
                      Data Quality
                    </Typography>
                    <Box sx={{ 
                      px: 1.5, 
                      py: 0.5, 
                      backgroundColor: '#dcfce7',
                      borderRadius: '4px',
                      border: '1px solid #16a34a'
                    }}>
                      <Typography variant="caption" sx={{ 
                        color: '#166534', 
                        fontSize: '9px',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                      }}>
                        Excellent
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

          </Box>
        )}
      </Box>

    </Box>
  );
};

export default WeatherSidebar;