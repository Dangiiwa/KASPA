import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { 
  TemperatureCard,
  HumidityCard,
  WindCard,
  PressureCard,
  VisibilityCard,
  UVIndexCard,
  SoilMoistureCard
} from './WeatherCard';
import { 
  getCurrentWeather, 
  getCurrentSoil, 
  getCurrentUVI 
} from '../../services/geo';
import type { Field, WeatherData, CurrentSoil, CurrentUVI } from '../../types';
import { enqueueSnackbar } from 'notistack';

interface WeatherDashboardProps {
  selectedField?: Field | null;
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ selectedField }) => {
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
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Weather Information
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Select a field to view weather information
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Weather Information
          </Typography>
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Weather Information
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Weather Information - {selectedField.name}
        </Typography>
        {weatherData && (
          <Chip 
            label={weatherData.weather[0]?.description || 'Unknown'}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      <Box display="flex" flexWrap="wrap" gap={2}>
        <Box sx={{ minWidth: 200, flex: '1 1 200px' }}>
          <TemperatureCard weatherData={weatherData || undefined} />
        </Box>
        
        <Box sx={{ minWidth: 200, flex: '1 1 200px' }}>
          <HumidityCard weatherData={weatherData || undefined} />
        </Box>
        
        <Box sx={{ minWidth: 200, flex: '1 1 200px' }}>
          <WindCard weatherData={weatherData || undefined} />
        </Box>
        
        <Box sx={{ minWidth: 200, flex: '1 1 200px' }}>
          <PressureCard weatherData={weatherData || undefined} />
        </Box>
        
        <Box sx={{ minWidth: 200, flex: '1 1 200px' }}>
          <VisibilityCard weatherData={weatherData || undefined} />
        </Box>
        
        <Box sx={{ minWidth: 200, flex: '1 1 200px' }}>
          <UVIndexCard currentUVI={uviData || undefined} />
        </Box>
        
        <Box sx={{ minWidth: 200, flex: '1 1 200px' }}>
          <SoilMoistureCard currentSoil={soilData || undefined} />
        </Box>
      </Box>

      {weatherData && (
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date(weatherData.dt * 1000).toLocaleString()}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default WeatherDashboard;