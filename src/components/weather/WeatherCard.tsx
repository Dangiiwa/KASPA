import React from 'react';
import { Box } from '@mui/material';
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
  const [animatedValue, setAnimatedValue] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setAnimatedValue(temp || 0);
    }, 200);
    return () => clearTimeout(timer);
  }, [temp]);
  
  const getTemperatureVariant = () => {
    if (!temp) return 'dashlet--info';
    if (temp > 30) return 'dashlet--primary';  // Very hot - red
    if (temp > 20) return 'dashlet--warning';  // Warm - orange
    if (temp > 10) return 'dashlet--success';  // Comfortable - green
    return 'dashlet--info';  // Cold - blue
  };
  
  const getTemperatureStatus = () => {
    if (!temp) return 'Loading';
    if (temp > 30) return 'Very Hot';
    if (temp > 20) return 'Warm';
    if (temp > 10) return 'Optimal';
    return 'Cool';
  };
  
  const getTempGradient = () => {
    if (!temp) return 'linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)';
    if (temp > 30) return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
    if (temp > 20) return 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)';
    if (temp > 10) return 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)';
    return 'linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)';
  };
  
  return (
    <div className={`dashlet ${getTemperatureVariant()} animate-fade-in-up`}>
      <div className="dashlet-header">
        <h3 className="dashlet-title">Temperature</h3>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Thermostat className="dashlet-icon" sx={{ 
            color: temp ? (temp > 30 ? '#ff6b6b' : temp > 20 ? '#ffa726' : temp > 10 ? '#66bb6a' : '#42a5f5') : '#42a5f5'
          }} />
          <span className={`status-indicator ${
            temp && temp > 30 ? 'status-critical' : 
            temp && temp > 20 ? 'status-low-match' : 
            temp && temp > 10 ? 'status-best-match' : 
            'status-good-match'
          }`}>
            {getTemperatureStatus()}
          </span>
        </Box>
      </div>
      
      <Box flex={1} display="flex" flexDirection="column" justifyContent="center">
        <div 
          className="dashlet-value" 
          style={{ 
            background: getTempGradient(),
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
          {weatherData ? `${temp?.toFixed(0)}°C` : '--'}
        </div>
        
        {weatherData && (
          <p className="dashlet-subtitle" style={{ fontSize: '11px', margin: 0 }}>
            Feels like {kelvinToCelsius(weatherData.main.feels_like).toFixed(0)}°C
          </p>
        )}
      </Box>
    </div>
  );
};

export const HumidityCard: React.FC<{ weatherData?: WeatherData; darkTheme?: boolean }> = ({ weatherData, darkTheme = true }) => {
  const humidity = weatherData?.main.humidity;
  const [animatedValue, setAnimatedValue] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setAnimatedValue(humidity || 0);
    }, 250);
    return () => clearTimeout(timer);
  }, [humidity]);
  
  const getHumidityVariant = () => {
    if (!humidity) return 'dashlet--info';
    if (humidity > 70) return 'dashlet--info';     // High humidity - blue
    if (humidity >= 40) return 'dashlet--success'; // Optimal - green
    return 'dashlet--warning';                     // Low humidity - orange
  };
  
  const getHumidityStatus = () => {
    if (!humidity) return 'Loading';
    if (humidity > 70) return 'High';
    if (humidity >= 40) return 'Optimal';
    return 'Low';
  };
  
  const getHumidityGradient = () => {
    if (!humidity) return 'linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)';
    if (humidity > 70) return 'linear-gradient(135deg, #29b6f6 0%, #0277bd 100%)';
    if (humidity >= 40) return 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)';
    return 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)';
  };
  
  return (
    <div className={`dashlet ${getHumidityVariant()} animate-fade-in-up`}>
      <div className="dashlet-header">
        <h3 className="dashlet-title">Humidity</h3>
        <Box display="flex" alignItems="center" gap={0.5}>
          <WaterDrop className="dashlet-icon" sx={{ 
            color: humidity ? (humidity > 70 ? '#29b6f6' : humidity >= 40 ? '#66bb6a' : '#ffa726') : '#42a5f5'
          }} />
          <span className={`status-indicator ${
            humidity && humidity > 70 ? 'status-good-match' : 
            humidity && humidity >= 40 ? 'status-best-match' : 
            'status-low-match'
          }`}>
            {getHumidityStatus()}
          </span>
        </Box>
      </div>
      
      <Box flex={1} display="flex" flexDirection="column" justifyContent="center">
        <div 
          className="dashlet-value" 
          style={{ 
            background: getHumidityGradient(),
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
          {humidity ? `${humidity}%` : '--'}
        </div>
      </Box>
    </div>
  );
};

export const WindCard: React.FC<{ weatherData?: WeatherData; darkTheme?: boolean }> = ({ weatherData, darkTheme = true }) => {
  const windSpeed = weatherData?.wind.speed;
  const [animatedValue, setAnimatedValue] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setAnimatedValue(windSpeed || 0);
    }, 300);
    return () => clearTimeout(timer);
  }, [windSpeed]);
  
  const getWindVariant = () => {
    if (!windSpeed) return 'dashlet--success';
    if (windSpeed > 10) return 'dashlet--primary';   // Strong wind - red
    if (windSpeed > 5) return 'dashlet--warning';    // Moderate wind - orange
    return 'dashlet--success';                       // Light wind - green
  };
  
  const getWindStatus = () => {
    if (!windSpeed) return 'Calm';
    if (windSpeed > 10) return 'Strong';
    if (windSpeed > 5) return 'Moderate';
    return 'Light';
  };
  
  const getWindGradient = () => {
    if (!windSpeed) return 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)';
    if (windSpeed > 10) return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
    if (windSpeed > 5) return 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)';
    return 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)';
  };
  
  return (
    <div className={`dashlet ${getWindVariant()} animate-fade-in-up`}>
      <div className="dashlet-header">
        <h3 className="dashlet-title">Wind</h3>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Air className="dashlet-icon" sx={{ 
            color: windSpeed ? (windSpeed > 10 ? '#ff6b6b' : windSpeed > 5 ? '#ffa726' : '#66bb6a') : '#66bb6a'
          }} />
          <span className={`status-indicator ${
            windSpeed && windSpeed > 10 ? 'status-critical' : 
            windSpeed && windSpeed > 5 ? 'status-low-match' : 
            'status-best-match'
          }`}>
            {getWindStatus()}
          </span>
        </Box>
      </div>
      
      <Box flex={1} display="flex" flexDirection="column" justifyContent="center">
        <div 
          className="dashlet-value" 
          style={{ 
            background: getWindGradient(),
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
          {windSpeed ? `${windSpeed} m/s` : '--'}
        </div>
        
        {weatherData && (
          <p className="dashlet-subtitle" style={{ fontSize: '11px', margin: 0 }}>
            {getWindDirection(weatherData.wind.deg)} ({weatherData.wind.deg}°)
          </p>
        )}
      </Box>
    </div>
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
  const [animatedValue, setAnimatedValue] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setAnimatedValue(pressure || 0);
    }, 350);
    return () => clearTimeout(timer);
  }, [pressure]);
  
  const getPressureVariant = () => {
    if (!pressure) return 'dashlet--info';
    if (pressure > 1020) return 'dashlet--success';   // High pressure - green
    if (pressure >= 1000) return 'dashlet--info';     // Normal pressure - blue
    return 'dashlet--warning';                        // Low pressure - orange
  };
  
  const getPressureStatus = () => {
    if (!pressure) return 'Loading';
    if (pressure > 1020) return 'High';
    if (pressure >= 1000) return 'Normal';
    return 'Low';
  };
  
  const getPressureGradient = () => {
    if (!pressure) return 'linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)';
    if (pressure > 1020) return 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)';
    if (pressure >= 1000) return 'linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)';
    return 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)';
  };
  
  return (
    <div className={`dashlet ${getPressureVariant()} animate-fade-in-up`}>
      <div className="dashlet-header">
        <h3 className="dashlet-title">Pressure</h3>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Speed className="dashlet-icon" sx={{ 
            color: pressure ? (pressure > 1020 ? '#66bb6a' : pressure >= 1000 ? '#42a5f5' : '#ffa726') : '#42a5f5'
          }} />
          <span className={`status-indicator ${
            pressure && pressure > 1020 ? 'status-best-match' : 
            pressure && pressure >= 1000 ? 'status-good-match' : 
            'status-low-match'
          }`}>
            {getPressureStatus()}
          </span>
        </Box>
      </div>
      
      <Box flex={1} display="flex" flexDirection="column" justifyContent="center">
        <div 
          className="dashlet-value" 
          style={{ 
            background: getPressureGradient(),
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
          {pressure ? `${pressure} hPa` : '--'}
        </div>
      </Box>
    </div>
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