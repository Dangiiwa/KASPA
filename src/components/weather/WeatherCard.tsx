import React from 'react';
import { Box, Typography } from '@mui/material';
import { 
  Thermostat, 
  WaterDrop, 
  Air, 
  Visibility,
  Speed,
  WbSunny
} from '@mui/icons-material';
import type { WeatherData } from '../../types';

// Color mapping function
const getColorForType = (color: string): string => {
  const colorMap: Record<string, string> = {
    primary: '#004408',
    secondary: '#E8DDB5',
    accent: '#3abe66',
    gold: '#b99d34',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
  };
  return colorMap[color] || '#ffffff';
};

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'accent' | 'info' | 'gold';
  trend?: 'up' | 'down' | 'stable';
  subtitle?: string;
  darkTheme?: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  title,
  value,
  unit = '',
  icon,
  color = 'primary',
  trend,
  subtitle,
  darkTheme = false
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [animationDelay, setAnimationDelay] = React.useState(0);

  React.useEffect(() => {
    // Add staggered animation delay based on card position
    const delay = Math.random() * 200;
    setAnimationDelay(delay);
  }, []);

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'success';
      case 'down': return 'error';
      default: return 'default';
    }
  };

  const getTrendSymbol = () => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  const getCardThemeClass = () => {
    switch (color) {
      case 'accent': 
      case 'success':
        return 'dashlet-health';
      case 'info':
        return 'dashlet-humidity';
      case 'warning':
      case 'gold':
        return 'dashlet-temperature';
      default:
        return '';
    }
  };

  const getDynamicValueColor = () => {
    if (title === 'Temperature' && typeof value === 'number') {
      if (value > 30) return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
      if (value > 20) return 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)';
      if (value > 10) return 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)';
      return 'linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)';
    }
    
    if (title === 'Humidity' && typeof value === 'number') {
      if (value > 70) return 'linear-gradient(135deg, #29b6f6 0%, #0277bd 100%)';
      if (value > 40) return 'linear-gradient(135deg, #42a5f5 0%, #1565c0 100%)';
      return 'linear-gradient(135deg, #ef5350 0%, #c62828 100%)';
    }

    return getColorForType(color);
  };

  if (value === '--' || value === null || value === undefined) {
    return (
      <div className={`dashlet ${getCardThemeClass()} animate-fade-in-up`} 
           style={{ 
             animationDelay: `${animationDelay}ms`
           }}>
        <div className="dashlet-header">
          <h3 className="dashlet-title">{title}</h3>
          {icon && (
            <Box className="dashlet-icon" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              {icon}
            </Box>
          )}
        </div>
        
        <Box flex={1} display="flex" flexDirection="column" justifyContent="center">
          <div className="skeleton skeleton-value" style={{ height: '20px', marginBottom: '8px' }}></div>
          {subtitle && (
            <div className="skeleton skeleton-subtitle" style={{ height: '12px' }}></div>
          )}
        </Box>
      </div>
    );
  }

  return (
    <div className={`dashlet ${getCardThemeClass()} animate-fade-in-up`} 
         style={{ 
           animationDelay: `${animationDelay}ms`
         }}>
      <div className="dashlet-header">
        <h3 className="dashlet-title">{title}</h3>
        {icon && (
          <Box className="dashlet-icon" sx={{ 
            color: typeof getDynamicValueColor() === 'string' && getDynamicValueColor().includes('gradient') 
              ? getColorForType(color) 
              : getDynamicValueColor() 
          }}>
            {icon}
          </Box>
        )}
      </div>
      
      <Box flex={1} display="flex" flexDirection="column" justifyContent="center">
        <div 
          className="dashlet-value" 
          style={{ 
            background: typeof getDynamicValueColor() === 'string' && getDynamicValueColor().includes('gradient')
              ? getDynamicValueColor()
              : 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.9) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '20px',
            margin: '4px 0'
          }}
        >
          {value}{unit}
        </div>
        
        {subtitle && (
          <p className="dashlet-subtitle" style={{ fontSize: '11px', margin: 0 }}>
            {subtitle}
          </p>
        )}
        
        {trend && (
          <Box mt={0.5}>
            <span 
              className={`status-indicator ${
                getTrendColor() === 'success' ? 'status-best-match' :
                getTrendColor() === 'error' ? 'status-bad-match' : 'status-good-match'
              }`}
              style={{ fontSize: '9px', padding: '3px 6px' }}
            >
              {getTrendSymbol()} Trend
            </span>
          </Box>
        )}
      </Box>
    </div>
  );
};

// Helper function to convert Kelvin to Celsius
const kelvinToCelsius = (kelvin: number): number => kelvin - 273.15;

// Helper function to get wind direction
const getWindDirection = (deg: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
};

// Helper function to get UV level
const getUVLevel = (uvi: number): string => {
  if (uvi <= 2) return 'Low';
  if (uvi <= 5) return 'Moderate';
  if (uvi <= 7) return 'High';
  if (uvi <= 10) return 'Very High';
  return 'Extreme';
};

// Individual card components with contextual styling
export const TemperatureCard: React.FC<{ weatherData?: WeatherData; darkTheme?: boolean }> = ({ weatherData, darkTheme = true }) => {
  const temp = weatherData ? kelvinToCelsius(weatherData.main.temp) : null;
  
  const getTemperatureColor = () => {
    if (!temp) return '#64748b';
    if (temp > 30) return '#ef4444';
    if (temp > 20) return '#f59e0b';
    if (temp > 10) return '#10b981';
    return '#3b82f6';
  };
  
  return (
    <Box
      sx={{
        width: 160,
        height: 100,
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: 'none',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1.5,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#fafafa',
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)'
        }
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" mb={1}>
        <Typography
          variant="caption"
          sx={{
            fontSize: '12px',
            color: '#6b7280',
            fontWeight: 500,
          }}
        >
          Temperature
        </Typography>
        <Thermostat sx={{ 
          fontSize: 16, 
          color: getTemperatureColor()
        }} />
      </Box>

      {/* Value */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          fontSize: '24px',
          color: getTemperatureColor(),
          lineHeight: 1,
          mb: 0.5
        }}
      >
        {weatherData ? `${temp?.toFixed(0)}°C` : '--'}
      </Typography>
      
      {/* Subtitle */}
      {weatherData && (
        <Typography
          variant="caption"
          sx={{
            fontSize: '10px',
            color: '#94a3b8',
            textAlign: 'center'
          }}
        >
          Feels like {kelvinToCelsius(weatherData.main.feels_like).toFixed(0)}°C
        </Typography>
      )}
    </Box>
  );
};

export const HumidityCard: React.FC<{ weatherData?: WeatherData; darkTheme?: boolean }> = ({ weatherData, darkTheme = true }) => {
  const humidity = weatherData?.main.humidity;
  
  const getHumidityColor = () => {
    if (!humidity) return '#64748b';
    if (humidity > 70) return '#3b82f6';
    if (humidity >= 40) return '#10b981';
    return '#f59e0b';
  };
  
  return (
    <Box
      sx={{
        width: 160,
        height: 100,
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: 'none',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1.5,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#fafafa',
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)'
        }
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" mb={1}>
        <Typography
          variant="caption"
          sx={{
            fontSize: '12px',
            color: '#6b7280',
            fontWeight: 500,
          }}
        >
          Humidity
        </Typography>
        <WaterDrop sx={{ 
          fontSize: 16, 
          color: getHumidityColor()
        }} />
      </Box>

      {/* Value */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          fontSize: '24px',
          color: getHumidityColor(),
          lineHeight: 1,
        }}
      >
        {humidity ? `${humidity}%` : '--'}
      </Typography>
    </Box>
  );
};

export const WindCard: React.FC<{ weatherData?: WeatherData; darkTheme?: boolean }> = ({ weatherData, darkTheme = true }) => {
  const windSpeed = weatherData?.wind.speed;
  
  const getWindColor = () => {
    if (!windSpeed) return '#64748b';
    if (windSpeed > 10) return '#ef4444';
    if (windSpeed > 5) return '#f59e0b';
    return '#10b981';
  };
  
  return (
    <Box
      sx={{
        width: 160,
        height: 100,
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: 'none',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1.5,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#fafafa',
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)'
        }
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" mb={1}>
        <Typography
          variant="caption"
          sx={{
            fontSize: '12px',
            color: '#6b7280',
            fontWeight: 500,
          }}
        >
          Wind
        </Typography>
        <Air sx={{ 
          fontSize: 16, 
          color: getWindColor()
        }} />
      </Box>

      {/* Value */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          fontSize: '20px',
          color: getWindColor(),
          lineHeight: 1,
          mb: 0.5
        }}
      >
        {windSpeed ? `${windSpeed} m/s` : '--'}
      </Typography>
      
      {/* Subtitle */}
      {weatherData && (
        <Typography
          variant="caption"
          sx={{
            fontSize: '10px',
            color: '#94a3b8',
            textAlign: 'center'
          }}
        >
          {getWindDirection(weatherData.wind.deg)} ({weatherData.wind.deg}°)
        </Typography>
      )}
    </Box>
  );
};

export const VisibilityCard: React.FC<{ weatherData?: WeatherData; darkTheme?: boolean }> = ({ darkTheme = true }) => (
  <WeatherCard
    title="Visibility"
    value="--"
    unit=" km"
    icon={<Visibility />}
    color="primary"
    darkTheme={darkTheme}
  />
);

export const PressureCard: React.FC<{ weatherData?: WeatherData; darkTheme?: boolean }> = ({ weatherData, darkTheme = true }) => {
  const pressure = weatherData?.main.pressure;
  
  const getPressureColor = () => {
    if (!pressure) return '#64748b';
    if (pressure > 1020) return '#10b981';
    if (pressure >= 1000) return '#3b82f6';
    return '#f59e0b';
  };
  
  return (
    <Box
      sx={{
        width: 160,
        height: 100,
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: 'none',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1.5,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#fafafa',
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)'
        }
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" mb={1}>
        <Typography
          variant="caption"
          sx={{
            fontSize: '12px',
            color: '#6b7280',
            fontWeight: 500,
          }}
        >
          Pressure
        </Typography>
        <Speed sx={{ 
          fontSize: 16, 
          color: getPressureColor()
        }} />
      </Box>

      {/* Value */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          fontSize: '20px',
          color: getPressureColor(),
          lineHeight: 1,
        }}
      >
        {pressure ? `${pressure} hPa` : '--'}
      </Typography>
    </Box>
  );
};

export const UVIndexCard: React.FC<{ currentUVI?: any; darkTheme?: boolean }> = ({ currentUVI, darkTheme = true }) => {
  const uvValue = currentUVI?.uvi;
  const [animatedValue, setAnimatedValue] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setAnimatedValue(uvValue || 0);
    }, 400);
    return () => clearTimeout(timer);
  }, [uvValue]);
  
  const getUVVariant = () => {
    if (!uvValue) return 'dashlet--info';
    if (uvValue > 10) return 'dashlet--primary';    // Extreme - red
    if (uvValue > 7) return 'dashlet--primary';     // Very High - red
    if (uvValue > 5) return 'dashlet--warning';     // High - orange
    if (uvValue > 2) return 'dashlet--warning';     // Moderate - orange
    return 'dashlet--success';                      // Low - green
  };
  
  const getUVGradient = () => {
    if (!uvValue) return 'linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)';
    if (uvValue > 10) return 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)';
    if (uvValue > 7) return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
    if (uvValue > 5) return 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)';
    if (uvValue > 2) return 'linear-gradient(135deg, #ffcc02 0%, #ffb300 100%)';
    return 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)';
  };
  
  const getUVIconColor = () => {
    if (!uvValue) return '#42a5f5';
    if (uvValue > 10) return '#d32f2f';
    if (uvValue > 7) return '#ff6b6b';
    if (uvValue > 5) return '#ffa726';
    if (uvValue > 2) return '#ffcc02';
    return '#66bb6a';
  };
  
  return (
    <div className={`dashlet ${getUVVariant()} animate-fade-in-up`}>
      <div className="dashlet-header">
        <h3 className="dashlet-title">UV Index</h3>
        <Box display="flex" alignItems="center" gap={0.5}>
          <WbSunny className="dashlet-icon" sx={{ 
            color: getUVIconColor()
          }} />
          <span className={`status-indicator ${
            uvValue && uvValue > 7 ? 'status-critical' : 
            uvValue && uvValue > 5 ? 'status-bad-match' : 
            uvValue && uvValue > 2 ? 'status-low-match' : 
            'status-best-match'
          }`}>
            {getUVLevel(uvValue || 0)}
          </span>
        </Box>
      </div>
      
      <Box flex={1} display="flex" flexDirection="column" justifyContent="center">
        <div 
          className="dashlet-value" 
          style={{ 
            background: getUVGradient(),
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '22px',
            margin: '4px 0',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isVisible ? 'scale(1)' : 'scale(0.9)',
            opacity: isVisible ? 1 : 0
          }}
        >
          {currentUVI ? getUVLevel(currentUVI.uvi) : '--'}
        </div>
        
        {currentUVI && (
          <p className="dashlet-subtitle" style={{ fontSize: '11px', margin: 0 }}>
            {currentUVI.uvi.toFixed(1)} UVI
          </p>
        )}
      </Box>
    </div>
  );
};

export const SoilMoistureCard: React.FC<{ currentSoil?: any; darkTheme?: boolean }> = ({ currentSoil, darkTheme = true }) => (
  <WeatherCard
    title="Soil Moisture"
    value={currentSoil ? (currentSoil.moisture * 100).toFixed(1) : '--'}
    unit="%"
    icon={<WaterDrop />}
    color="accent"
    subtitle={currentSoil ? `Temp: ${currentSoil.t0.toFixed(1)}°C` : undefined}
    darkTheme={darkTheme}
  />
);

export default WeatherCard;